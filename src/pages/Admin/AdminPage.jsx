import React, { useState } from 'react';
import { getRequest, postRequest, putRequest } from '../../Utils/axios';
import { Editor } from '@monaco-editor/react';

const AdminPage = () => {
  const [tab, setTab] = useState('admin-code');
  const [adminCode, setAdminCode] = useState('');
  const [languages, setLanguages] = useState({
    javascript: '',
    python: '',
    java: '',
    cpp: ''
  });
  const [inputNames, setInputNames] = useState(['nums', 'target']);
  const [testcases, setTestcases] = useState([{ input: '[2,7,11,15]', expected: '' }]);
  const [timeout, setProblemTimeout] = useState('1');
  const [problemId, setProblemId] = useState("oeaUY3h1krO3b4YcqhuQ");
  const [message, setMessage] = useState('');
  const [executingJobId, setExecutingJobId] = useState(null);

  const encodeBase64 = (str) => btoa(unescape(encodeURIComponent(str)));
  const decodeBase64 = (str) => {
    try {
      return decodeURIComponent(escape(atob(str)));
    } catch (e) {
      return '';
    }
  };

  // Map language codes to Monaco Editor's supported languages
  const getMonacoLanguage = (lang) => {
    const langMap = {
      'javascript': 'javascript',
      'python': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c++': 'cpp',
      'plaintext': null,
      'text': null,
      'json': 'json'
    };
    return langMap[lang] || null; // null disables syntax highlighting for plain text
  };

  const loadProblem = async () => {
    if (!problemId) {
      setMessage('Please enter a problem ID');
      return;
    }

    try {
      const response = await getRequest(`/api/problems/${problemId}`);
      const data = response.data || response;

      if (data && data.status === 'ok' && data.data) {
        const problem = data.data;
        // Decode admin code from base64
        setAdminCode(problem.Adminsrc ? decodeBase64(problem.Adminsrc) : '');
        setInputNames(problem.Inputname || []);
        setProblemTimeout(problem.Timeout || '1');

        const decoded = {};
        if (problem.Remaining) {
          Object.keys(problem.Remaining).forEach(lang => {
            decoded[lang] = decodeBase64(problem.Remaining[lang]);
          });
          setLanguages(prev => ({ ...prev, ...decoded }));
        }
         const updatedTestcases = problem.Testcases.map(tc => ({
          input: tc.input,
          expected: tc.expected
        }));
        console.log("Loaded testcases:", updatedTestcases);
          setTestcases(updatedTestcases.length > 0 ? updatedTestcases : [{ input: '', expected: '' }]);
     

        setMessage('✅ Problem loaded successfully!');
      } else {
        setMessage('Problem not found or invalid response');
      }
    } catch (error) {
      setMessage(`Error loading problem: ${error.message}`);
    }
  };

  const saveProblem = async () => {
    if (!problemId) {
      setMessage('Please enter a problem ID');
      return;
    }

    try {
      const encodedRemaining = {};
      Object.keys(languages).forEach(lang => {
        if (languages[lang]) {
          encodedRemaining[lang] = encodeBase64(languages[lang]);
        }
      });

   

      const problemData = {
        Adminsrc: encodeBase64(adminCode), // Encode admin code to base64
        Inputname: inputNames,
        Remaining: encodedRemaining,
        Testcases: testcases,
        Timeout: timeout,
        updatedAt: new Date().toISOString()
      };

      const result = await putRequest(`/api/problems/${problemId}`, problemData);
      
      if (result.success) {
        setMessage('✅ Problem saved successfully!');
      } else {
        setMessage(`Error: ${result.error?.message || 'Failed to save'}`);
      }
    } catch (error) {
      setMessage(`Error saving problem: ${error.message}`);
    }
  };

  const addInputName = () => setInputNames([...inputNames, '']);
  const updateInputName = (index, value) => {
    const newNames = [...inputNames];
    newNames[index] = value;
    setInputNames(newNames);
  };
  const removeInputName = (index) => setInputNames(inputNames.filter((_, i) => i !== index));

  const addTestcase = () => setTestcases([...testcases, { input: '', expected: '' }]);
  const updateTestcase = (index, field, value) => {
    const newTestcases = [...testcases];
    newTestcases[index][field] = value;
    setTestcases(newTestcases);
  };
  const removeTestcase = (index) => setTestcases(testcases.filter((_, i) => i !== index));
   
  const executeAdminCode = async () => {
    try {
      setMessage('⏳ Queuing admin code execution...');
      
      // Step 1: Queue the job and get jobId immediately (non-blocking)
      const queueResult = await postRequest('/api/execute-admin', {
        adminCode,
        testcases: testcases.map(t => t.input),
        language: 'javascript'
      });

      if (!queueResult.success || !queueResult.data?.data?.jobId) {
        setMessage(`Error: Failed to queue execution - ${queueResult.error?.message || 'Unknown error'}`);
        return;
      }

      const jobId = queueResult.data.data.jobId;
      setExecutingJobId(jobId);
      setMessage(`🔄 Executing admin code... (Job: ${jobId.substring(0, 20)}...)`);
      const finalResult = await waitForCompletion(jobId, 2); // Poll every 2 seconds
      console.log("Final execution result:", finalResult);

      if (finalResult && finalResult.testcases) {
        // Step 2: Update testcases with expected outputs from the result
        const updatedTestcases = finalResult.testcases.map(tc => ({
          input: tc.input,
          expected: tc.expected
        }));
        setTestcases(updatedTestcases);
        console.log("Updated testcases:", updatedTestcases);

        // Step 3: Save the problem with updated testcases
        try {
          const encodedRemaining = {};
          Object.keys(languages).forEach(lang => {
            if (languages[lang]) {
              encodedRemaining[lang] = encodeBase64(languages[lang]);
            }
          });


          const problemData = {
            Adminsrc: encodeBase64(adminCode),
            Inputname: inputNames,
            Remaining: encodedRemaining,
            Testcases: updatedTestcases,
            Timeout: timeout,
            updatedAt: new Date().toISOString()
          };

          const saveResult = await putRequest(`/api/problems/${problemId}`, problemData);
          
          if (saveResult.success) {
            setMessage(`✅ Admin outputs generated and saved!`);
          } else {
            setMessage(`✅ Outputs generated but save failed: ${saveResult.error?.message || 'Unknown error'}`);
          }
        } catch (saveError) {
          setMessage(`✅ Outputs generated but failed to save: ${saveError.message}`);
        }
      } else {
        setMessage('❌ No testcases returned from execution');
      }
    } catch (error) {
      setExecutingJobId(null);
      setMessage(`Error executing: ${error.message}`);
    } finally {
      setExecutingJobId(null);
    }
  };
 const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function waitForCompletion(submissionId, interval) {
  let attempts = 0;
  const maxAttempts = 30;

  while (attempts < maxAttempts) {
    const response = await getRequest(`/api/execute-admin/${submissionId}`);

    if (!response.success) {
      console.error("Failed to fetch submission status");
      return null;
    }

    const result = response.data?.data || response.data;
    const state = result?.state || result?.status;

    console.log(`Attempt ${attempts + 1}: ${state}`);

    const processing =
      state === "Processing" ||
      state === "queued" ||
      state === "pending";

    if (!processing) {
      console.log("Submission complete:", state);
      return result;
    }

  const start = Date.now();

console.log("waiting...", start);

await delay(interval * 1000);

const end = Date.now();
console.log("done waiting", end);
console.log("actual delay:", end - start);
console.log("done waiting", new Date().toISOString());

    attempts++;
  }

  console.log("Timeout reached");
  return null;
}
  const tabs = [
    { id: 'admin-code', label: 'Admin Code', icon: '📝' },
    { id: 'templates', label: 'Code Templates', icon: '🔤' },
    { id: 'inputs', label: 'Input Names', icon: '📥' },
    { id: 'testcases', label: 'Test Cases', icon: '🧪' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-900 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">⚙️</span> Problem Admin Panel
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Manage problem code, templates, inputs and test cases</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        
        {/* Problem Loader Section */}
        <div className="p-6 border-b border-gray-700 bg-gray-900/50">
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="Enter Problem ID (quesId)"
              value={problemId}
              onChange={(e) => setProblemId(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={loadProblem}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <span>📂</span> Load
            </button>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`px-4 py-3 rounded-lg font-medium flex items-center gap-2 ${
              message.includes('✅') 
                ? 'bg-green-900/30 border border-green-700 text-green-300' 
                : message.includes('⏳') || message.includes('🔄')
                ? 'bg-blue-900/30 border border-blue-700 text-blue-300'
                : message.includes('❌')
                ? 'bg-red-900/30 border border-red-700 text-red-300'
                : 'bg-yellow-900/30 border border-yellow-700 text-yellow-300'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700 bg-gray-900/50 sticky top-16 z-30">
          <div className="px-6 flex gap-1 overflow-x-auto">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-4 font-medium whitespace-nowrap border-b-2 transition-colors duration-200 flex items-center gap-2 ${
                  tab === t.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {t.icon} {t.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          
          {/* Admin Code Tab */}
          {tab === 'admin-code' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Admin Solution Code</h2>
                <p className="text-gray-400 text-sm">Write the reference solution that generates expected outputs</p>
              </div>
              <div className="flex gap-4 text-sm text-gray-400">
                <span>Characters: <span className="text-blue-400 font-mono">{adminCode.length}</span></span>
                <span>Lines: <span className="text-blue-400 font-mono">{adminCode.split('\n').length}</span></span>
              </div>
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                <Editor
                  height="500px"
                  defaultLanguage="javascript"
                  value={adminCode}
                  onChange={(value) => setAdminCode(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: true },
                    fontSize: 13,
                    fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
                    wordWrap: 'on',
                    scrollBeyondLastLine: false,
                    backgroundColor: '#0f172a',
                  }}
                />
              </div>
              <button
                onClick={executeAdminCode}
                disabled={executingJobId}
                className={`px-6 py-2.5 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
                  executingJobId
                    ? 'bg-gray-600 cursor-not-allowed opacity-75'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {executingJobId ? '⏳ Executing...' : '▶️ Execute & Generate Outputs'}
              </button>
            </div>
          )}

          {/* Code Templates Tab */}
          {tab === 'templates' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Language Templates</h2>
                <p className="text-gray-400 text-sm">Edit code templates with // INSERT_CODE_HERE placeholder</p>
              </div>
              {Object.keys(languages).length === 0 ? (
                <div className="p-8 text-center rounded-lg bg-gray-800 border border-gray-700">
                  <p className="text-gray-400">No language templates loaded. Load a problem first.</p>
                </div>
              ) : (
                Object.keys(languages).map(lang => (
                  <div key={lang} className="border border-gray-700 rounded-lg overflow-hidden">
                    <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
                      <h3 className="text-lg font-bold text-blue-400">{lang.toUpperCase()}</h3>
                      <p className="text-gray-400 text-xs mt-1">
                        {(languages[lang] || '').length} chars • {(languages[lang] || '').split('\n').length} lines
                      </p>
                    </div>
                    <Editor
                      height="300px"
                      language={getMonacoLanguage(lang)}
                      value={languages[lang] || ''}
                      onChange={(value) => setLanguages({ ...languages, [lang]: value || '' })}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 12,
                        fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
                        wordWrap: 'on',
                        scrollBeyondLastLine: false,
                        backgroundColor: '#0f172a',
                      }}
                    />
                    <div className="bg-gray-800 px-4 py-3 border-t border-gray-700">
                      <details className="text-sm">
                        <summary className="cursor-pointer text-blue-400 hover:text-blue-300 font-medium">
                          📦 Base64 Encoded
                        </summary>
                        <div className="mt-3 space-y-2">
                          <textarea
                            value={encodeBase64(languages[lang] || '')}
                            readOnly
                            className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-xs text-gray-300 font-mono resize-none"
                            rows={2}
                          />
                          <button
                            onClick={() => navigator.clipboard.writeText(encodeBase64(languages[lang] || ''))}
                            className="text-xs px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                          >
                            📋 Copy
                          </button>
                        </div>
                      </details>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Input Names Tab */}
          {tab === 'inputs' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Input Parameters</h2>
                <p className="text-gray-400 text-sm">Define the names of input parameters displayed to users</p>
              </div>

              <div className="space-y-2">
                {inputNames.length === 0 ? (
                  <div className="p-8 text-center rounded-lg bg-gray-800 border border-gray-700">
                    <p className="text-gray-400">No input parameters yet.</p>
                  </div>
                ) : (
                  inputNames.map((name, index) => (
                    <div key={index} className="flex gap-3 items-center bg-gray-800 p-3 rounded-lg border border-gray-700">
                      <span className="text-blue-400 font-bold min-w-8">#{index + 1}</span>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => updateInputName(index, e.target.value)}
                        placeholder={`Parameter name`}
                        className="flex-1 px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                      />
                      <button
                        onClick={() => removeInputName(index)}
                        className="px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={addInputName}
                className="px-4 py-2.5 bg-blue-600/30 hover:bg-blue-600/40 text-blue-400 border border-blue-600/50 font-medium rounded-lg transition-colors"
              >
                ➕ Add Parameter
              </button>
            </div>
          )}

          {/* Test Cases Tab */}
          {tab === 'testcases' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Test Cases</h2>
                <p className="text-gray-400 text-sm">Manage test cases and execution timeout</p>
              </div>

              {/* Timeout Setting */}
              <div className="bg-gray-800 border border-blue-700/30 rounded-lg p-4 flex items-center gap-4">
                <span className="text-blue-400 font-medium">⏱️ Timeout:</span>
                <input
                  type="number"
                  value={timeout}
                  onChange={(e) => setTimeout(e.target.value)}
                  min="1"
                  max="30"
                  className="w-24 px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                />
                <span className="text-gray-400 text-sm">seconds</span>
              </div>

              {/* Test Cases List */}
              <div className="space-y-6">
                {testcases.length === 0 ? (
                  <div className="p-8 text-center rounded-lg bg-gray-800 border border-gray-700">
                    <p className="text-gray-400">No test cases yet.</p>
                  </div>
                ) : (
                  testcases.map((tc, index) => (
                    <div key={index} className="border border-gray-700 rounded-lg overflow-hidden">
                      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                        <h4 className="text-lg font-bold text-white">Test Case #{index + 1}</h4>
                        {testcases.length > 1 && (
                          <button
                            onClick={() => removeTestcase(index)}
                            className="px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded transition-colors text-sm"
                          >
                            ✕ Remove
                          </button>
                        )}
                      </div>

                      <div className="p-4 bg-gray-900/50 space-y-4">
                        {/* Inputs based on inputNames count */}
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-300">
                            Inputs ({inputNames.length})
                            <span className="text-gray-500 ml-2 text-xs">
                              {(tc.input || '').length} chars
                            </span>
                          </label>
                          {inputNames.length === 0 ? (
                            <div className="p-3 bg-gray-800 border border-gray-700 rounded text-gray-400 text-sm">
                              No input parameters defined. Add parameters in the "Input Names" tab.
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {inputNames.map((paramName, paramIndex) => {
                                // Ensure tc.input is a string (handle cases where it might be an array or object from old data)
                                const inputString = typeof tc.input === 'string' ? tc.input : (Array.isArray(tc.input) ? tc.input.join('\n') : '');
                                const inputValues = (inputString || '').split('\n');
                                const value = inputValues[paramIndex] || '';
                                
                                return (
                                  <div key={paramIndex} className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-blue-400 font-semibold text-sm">[{paramName}]</span>
                                      <span className="text-gray-500 text-xs">({value.length} chars)</span>
                                    </div>
                                    <textarea
                                      value={value}
                                      onChange={(e) => {
                                        const inputString = typeof tc.input === 'string' ? tc.input : (Array.isArray(tc.input) ? tc.input.join('\n') : '');
                                        const inputValues = (inputString || '').split('\n');
                                        inputValues[paramIndex] = e.target.value;
                                        // Join with \n, maintaining proper count
                                        const joinedInput = inputValues.slice(0, inputNames.length).join('\n');
                                        updateTestcase(index, 'input', joinedInput);
                                      }}
                                      className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono text-sm resize-none focus:border-blue-500 focus:outline-none"
                                      placeholder={`Enter ${paramName} value...`}
                                      rows={2}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Expected Output */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Expected Output
                            <span className="text-gray-500 ml-2 text-xs">
                              {(tc.expected || '').length} chars
                            </span>
                          </label>
                          <textarea
                            value={tc.expected || ''}
                            onChange={(e) => updateTestcase(index, 'expected', e.target.value)}
                            className="w-full h-32 p-3 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono text-sm resize-none focus:border-blue-500 focus:outline-none"
                            placeholder="Expected output..."
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={addTestcase}
                className="px-4 py-2.5 bg-blue-600/30 hover:bg-blue-600/40 text-blue-400 border border-blue-600/50 font-medium rounded-lg transition-colors"
              >
                ➕ Add Test Case
              </button>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="border-t border-gray-700 bg-gray-900/50 p-6 sticky bottom-0">
          <button
            onClick={saveProblem}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg transition-all duration-200 text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            💾 Save Problem
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
