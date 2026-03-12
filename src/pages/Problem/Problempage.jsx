import { Layout, Model,Actions,DockLocation } from "flexlayout-react";
import "flexlayout-react/style/light.css";
import React, { useEffect, useState } from "react";
import {
  Debuggericon,
  DescriptionIcon,
  EditorialIcon,
  Layouticon,
  MenuIcon,
  Nextbtn,
  Notesicon,
  Opennewtab,
  PlayButton,
  Prevbtn,
  Settingicon,
  SolutionIcon,
  Streakicon,
  SubmissionIcon,
  Suffle,
  TestcaseCodeicon,
  Testcaseicon,
  Testresulticon,
  Timericon,
  Uploadbutton,
} from "../../assets/icon";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import Description from "../../components/Description/Description";
import Testcase from "../../components/Testcase/Testcase";
import TestResult from "../../components/TestResult/TestResult";
import Submissions from "../../components/Submissions/Submissions";
import test from "./des.json";
import "./Problempage.css";
import { collection, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../Utils/Firebase";
import { useNavigate, useParams } from "react-router-dom";
import { getRequest, postRequest } from "../../Utils/axios";
import { showerror } from "../../Utils/toast";
import { saveCode, loadCode } from "../../Utils/indexedDB";
import SubmissionDetails from "../../components/Submissions/SubmissionDetails/SubmissionDetails";
const Problempage = () => {
  var json = {
    global: {},
    borders: [],
    layout: {
      type: "row",
      children: [
        {
          type: "tabset",
          weight: 50,
          children: [
            {
              type: "tab",
              name: "Description",
              component: "Description",
              enableClose: false,
            },
            {
              type: "tab",
              name: "Editorial",
              component: "Editorial",
              enableClose: false,
            },
            {
              type: "tab",
              name: "Solutions",
              component: "Solutions",
              enableClose: false,
            },
            {
              type: "tab",
              name: "Submissions",
              component: "Submissions",
              enableClose: false,
            },
          ],
          // active: true,
        },
        {
          type: "row",
          weight: 50,
          children: [
            {
              type: "tabset",
              weight: 50,
              // weight: 96.04190855697763,
              children: [
                {
                  type: "tab",
                  name: "Code",
                  component: "Codeeditor",
                  enableClose: false,
                },
              ],
            },
            {
              type: "tabset",
              // weight: 4.016298049711612,
              weight: 50,

              // selected: 1,
              children: [
                {
                  type: "tab",
                  name: "Testcase",
                  component: "Testcase",
                  enableClose: false,
                },
                {
                  type: "tab",
                  name: "Test Result",
                  component: "TestResult",
                  enableClose: false,
                },
              ],
            },
          ],
        },
      ],
    },
    popouts: {},
  };

  const navigate = useNavigate();
  const { Id } = useParams();
  const uid = auth.currentUser?.uid;
  const [foldedTabSets, setFoldedTabSets] = useState({});
  const [model, setModel] = useState(Model.fromJson(json));
  const [data, setdata] = useState(null);
  const [Code, setcode] = useState(null);
  const [Testcases, setTestcases] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setlanguage] = useState(() => {
    // Initialize language from localStorage
    const savedLanguage = localStorage.getItem("lastLanguage");
    return savedLanguage || "javascript";
  });
  const [currentcode, setcurrentcode] = useState("");
  const [running, setrunning] = useState(false);
  const [Executeresult, setExecuteresult] = useState(null);
  const [cooldown, setcooldown] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

const handleSubmissionClick = (submission) => {
  console.log("Submission clicked:", submission);

  setSelectedSubmission(submission);

  const layoutJson = model.toJson();
  const tabset = model.getRoot().getChildren()[0];

  const testResultTabNode = findTabNodeByName(layoutJson.layout, "Code");
  const node = model.getNodeById(testResultTabNode.id);

  const parentTabset = node.getParent() || tabset;

  // use submission id as unique tab id
  const existingTab = model.getNodeById("SubmissionDetail");

  if (existingTab) {
    // update tab name
    model.doAction(
      Actions.renameTab(existingTab.getId(), submission.status)
    );

    // focus the tab
    model.doAction(Actions.selectTab(existingTab.getId()));
    return;
  }

  // create new tab
  model.doAction(
    Actions.addNode(
      {
        id: "SubmissionDetail",
        type: "tab",
        name: submission.status,
        component: "SubmissionDetail",
        // componentState: submission,
        enableClose: true,
      },
      parentTabset.getId(),
      DockLocation.CENTER,
      -1
    )
  );
};

  const onRenderTab = (node, renderValues) => {
    console.log("Rendering tab:", node.renderedName,node.getComponent?.());
    if (node.renderedName === "Code") {
      renderValues.content = (
        <div className="relative flex items-center gap-1 overflow-hidden text-sm capitalize">
          <div className="relative text-[14px] leading-[normal] p-[1px] before:block before:h-3.5 before:w-3.5 text-[#02b128]">
            <TestcaseCodeicon />
          </div>

          {renderValues.content}
        </div>
      );
    } else if (node.renderedName === "Testcase") {
      renderValues.content = (
        <div className="relative flex items-center gap-1 overflow-hidden text-sm capitalize">
          <div className="relative text-[14px] leading-[normal] p-[1px] before:block before:h-3.5 before:w-3.5  text-[#02b128]">
            <Testcaseicon />
          </div>

          {renderValues.content}
        </div>
      );
    } else if (node.renderedName === "Test Result") {
      renderValues.content = (
        <div className="relative flex items-center gap-1 overflow-hidden text-sm capitalize">
          {!running ? (
            <div className="relative text-[14px] leading-[normal] p-[1px] before:block before:h-3.5 before:w-3.5  text-[#02b128]">
              <Testresulticon />
            </div>
          ) : (
            <span className="loading loading-spinner loading-sm"></span>
          )}

          {renderValues.content}
        </div>
      );
    } else if (node.renderedName === "Description") {
      renderValues.content = (
        <div className="relative flex items-center gap-1 overflow-hidden text-sm capitalize">
          <div className="relative text-[14px] leading-[normal] p-[1px] before:block before:h-3.5 before:w-3.5  text-[#007bff]">
            <DescriptionIcon />
          </div>

          {renderValues.content}
        </div>
      );
    } else if (node.renderedName === "Editorial") {
      renderValues.content = (
        <div className="relative flex items-center gap-1 overflow-hidden text-sm capitalize">
          <div className="relative text-[14px] leading-[normal] p-[1px] before:block before:h-3.5 before:w-3.5  text-[#ffb700]">
            <EditorialIcon />
          </div>

          {renderValues.content}
        </div>
      );
    } else if (node.renderedName === "Solutions") {
      renderValues.content = (
        <div className="relative flex items-center gap-1 overflow-hidden text-sm capitalize">
          <div className="relative text-[14px] leading-[normal] p-[1px] before:block before:h-3.5 before:w-3.5  text-[#007bff]">
            <SolutionIcon />
          </div>

          {renderValues.content}
        </div>
      );
    } else if (node.renderedName === "Submissions") {
      renderValues.content = (
        <div className="relative flex items-center gap-1 overflow-hidden text-sm capitalize">
          <div className="relative text-[14px] leading-[normal] p-[1px] before:block before:h-3.5 before:w-3.5  text-[#007bff]">
            <SubmissionIcon />
          </div>

          {renderValues.content}
        </div>
      );
    } else if (node.getComponent?.() === "SubmissionDetail") {
    renderValues.content = (
      <div className="relative flex items-center ml-4 gap-3 text-sm capitalize">
        <div className="relative text-[14px] leading-[normal] p-[1px] text-[#007bff]">
          <SubmissionIcon />
        </div>
        {renderValues.content}
      </div>
    );
  }

    
  };
  const onRenderTabSet = (tabSetNode, renderValues) => {
    const tabSetId = tabSetNode.getId();
    const isFolded = !!foldedTabSets[tabSetId];
    renderValues.buttons.push(
      <button
        key={`fold-unfold-${tabSetId}`}
        onClick={() => toggleFold(tabSetId, tabSetNode)}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          marginLeft: "8px",
        }}
        title={isFolded ? "Unfold" : "Fold"}
      >
        {isFolded ? "Unfold" : "Fold"}
      </button>
    );
  };

  // Toggle fold/unfold stat
  // Toggle fold/unfold
  const findTabset = (node, tabsetId) => {
    if (node.id === tabsetId) {
      return node;
    }

    // Recursively search through child nodes (if any)
    if (node.children) {
      for (let child of node.children) {
        const foundTabset = findTabset(child, tabsetId);
        if (foundTabset) {
          return foundTabset;
        }
      }
    }

    return null; // Return null if not found
  };
  const toggleFold = (tabsetId, tabSetNode) => {
    const layoutJson = model.toJson();
    const tabset = findTabset(layoutJson.layout, tabsetId);
    console.log(tabset);
    if (tabset) {
      // Ensure the `config` object exists
      if (!tabset.config) {
        tabset.config = {};
      }

      const parent = layoutJson.layout; // Parent node of the tabset
      const index = parent.children ? parent.children.indexOf(tabset) : -1;
      const sanitizedId = tabsetId.replace(/[^a-zA-Z0-9-_]/g, "");

      const titleElement = document.querySelector(`#${sanitizedId}`);
      console.log(titleElement);
      if (tabset.weight === 4) {
        // Unfold: Restore the original weight
        tabset.weight = tabset.config.lastWeight || 50; // Default to 50 if no weight was saved
        const titleElement = document.querySelector(`#${sanitizedId}`);
        if (titleElement) {
          titleElement.classList.remove("tab-title-rotated");
        }
      } else {
        // Fold: Save the current weight and adjust based on orientation
        tabset.config.lastWeight = tabset.weight;

        tabset.weight = 4; // Fold to left or right
        const titleElement = document.querySelector(
          `#${sanitizedId} .tab-title`
        );
        if (titleElement) {
          titleElement.classList.add("tab-title-rotated");
        }
      }
    }
    console.log(layoutJson);
    setModel(Model.fromJson(layoutJson));
  };
  const factory = (node) => {
    // Try multiple ways to get component
    let component = node.getComponent?.();
    
    // If getComponent returns undefined, check the attributes object
    if (!component && node.attributes) {
      component = node.attributes.component;
    }
    

    switch(component) {
      case "Codeeditor":
        return (
          <CodeEditor
            code={Code}
            setcurrentcode={setcurrentcode}
            language={language}
            setlanguage={setlanguage}
          />
        );
      case "TestResult":
        return (
          <TestResult data={Executeresult} quesdata={data} Loading={running} />
        );
      case "Description":
        return <Description data={data} />;
      case "Testcase":
        return (
          <Testcase data={data} testcase={Testcases} settestcase={setTestcases} />
        );
      case "Submissions":
        return <Submissions problemId={Id} onSubmissionClick={handleSubmissionClick} />;
      case "Editorial":
        return (
          <div style={{ padding: "20px", color: "#a0a0a0" }}>
            Editorial content coming soon
          </div>
        );
      case "Solutions":
        return (
          <div style={{ padding: "20px", color: "#a0a0a0" }}>
            Solutions content coming soon
          </div>
        );
      case "SubmissionDetail":
        return <SubmissionDetails selectedSubmission={selectedSubmission} />;
      default:
        return (
          <div style={{ padding: "20px", color: "#a0a0a0", textAlign: "center" }}>
            <div>Component not found for: {node.getName?.()}</div>
          </div>
        );
    }
  };
  const fetchquestion = async () => {
    const docsnap = await getDoc(doc(db, "problemset", Id));
    if (docsnap.exists()) {
      let value = docsnap.data();
      for (const [key, val] of Object.entries(value.Defaultcode)) {
        // Format the value and update the dictionary

        value.Defaultcode[key] = atob(val);
      }

      console.log(value);
      setdata(value);
      setcode(value.Defaultcode);
      setTestcases(value.SampleTestcase);
      console.log(value.Defaultcode);
      document.title = value.Title + " - LeetCode";

      // Load saved code from IndexedDB for the current language
      try {
        const savedData = await loadCode(Id, language);
        if (savedData && savedData.code) {
          console.log(`Restoring ${language} code from IndexedDB`,savedData.code);
          setcurrentcode(savedData.code);
          // Update the Code state to reflect the saved code
          setcode(prev => ({
            ...prev,
            [language]: savedData.code
          }));
        } else {
          // If no saved code, use default code and save it to IndexedDB
          const defaultCode = value.Defaultcode[language] || "";
          console.log(`Using default ${language} code and saving to IndexedDB`);
          setcurrentcode(defaultCode);
          // Save the default code to IndexedDB
          try {
            await saveCode(Id, defaultCode, language);
            console.log(`Default ${language} code saved to IndexedDB`);
          } catch (error) {
            console.error("Error saving default code to IndexedDB:", error);
          }
        }
      } catch (error) {
        console.error("Error loading saved code:", error);
        // Fallback to default code and save it
        const defaultCode = value.Defaultcode[language] || "";
        setcurrentcode(defaultCode);
        
        try {
          await saveCode(Id, defaultCode, language);
          console.log(`Default ${language} code saved to IndexedDB`);
        } catch (error) {
          console.error("Error saving default code to IndexedDB:", error);
        }
      }

      setLoading(false);
    }
    // const docsnap=await getDoc(query(collection(db, "problemset"), where("Title", "==", "Two Sum")))
  };
  useEffect(() => {
    console.log(Id);
    fetchquestion();
  }, [language]);

  // Instantly load saved code when language changes
  useEffect(() => {
    if (!Id) return;

    const loadSavedCode = async () => {
      try {
        const savedData = await loadCode(Id, language);
        if (savedData && savedData.code) {
          console.log(`Instantly restoring ${language} code from IndexedDB`);
          setcurrentcode(savedData.code);
          setcode(prev => ({
            ...prev,
            [language]: savedData.code
          }));
        }
      } catch (error) {
        console.error("Error loading saved code:", error);
      }
    };

    // Load saved code instantly before fetchquestion runs
    loadSavedCode();
  }, [language, Id]);

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem("lastLanguage", language);
  }, [language]);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Auto-save code to IndexedDB with debouncing
  useEffect(() => {
    if (!currentcode || !Id) return;

    const saveTimeout = setTimeout(async () => {
      try {
        await saveCode(Id, currentcode, language);
        console.log("Code auto-saved to IndexedDB");
      } catch (error) {
        console.error("Failed to auto-save code:", error);
      }
    }, 1000); // Save 1 second after user stops typing

    return () => clearTimeout(saveTimeout);
  }, [currentcode, language, Id]);

  async function waitForCompletion(resp, interval) {
    let checkres;

    do {
      const response = await getRequest(resp.data);
      checkres = response.data;
      console.log(checkres);

      if (checkres?.status === "Processing") {
        console.log("hello");
        await delay(interval * 1000);
      }
    } while (checkres?.status === "Processing");

    return checkres;
  }
  const saveSubmissionToFirestore = async (submissionData) => {
    try {
      const submissionsRef = collection(
        db,
        "users",
        uid,
        "problemSubmissions",
        Id,
        "submissions"
      );
      const docRef = doc(submissionsRef);
      await setDoc(docRef, {
        ...submissionData,
        submittedAt: serverTimestamp(),
      });
      console.log("Submission saved to Firestore");
    } catch (error) {
      console.error("Error saving submission:", error);
    }
  };

  const getSubmissionStatus = (result) => {
    if (!result) return "Unknown";
    if (result.runtime_error) return "Runtime Error";
    if (result.time_limit_exceeded) return "Time Limit Exceeded";
    if (result.memory_exceeded) return "Memory Limit Exceeded";
    if (result.accepted) return "Accepted";
    return "Wrong Answer";
  };

  const Sumbitcode = async (testcase) => {
    console.log(uid)
    if(uid === undefined || uid === null) {
      showerror("Please login to submit code");
      navigate("/login")
      return
    }
    // if (cooldown) {
    //   showerror(
    //     "You have attempted to run code too soon. Please try again in a few seconds, "
    //   );
    //   return;
    // }
    setrunning(true);
    
    // Switch to Test Result tab
  const layoutJson = model.toJson();

const testResultTabNode = findTabNodeByName(layoutJson.layout, "Test Result");

if (testResultTabNode) {
  model.doAction(Actions.selectTab(testResultTabNode.id));
}
    console.log(Testcases);
    let code = currentcode;
    // console.log(code);
    let data = {
      src: code,
      stdin: Testcases,
      lang: language,
      timeout: 1,
      testcase: testcase,
      quesId: "oeaUY3h1krO3b4YcqhuQ",
    };
    let resp = await postRequest("/submit", data);
    if (!resp.success) {
      console.log("Internal server error");
      setrunning(false);
      return;
    }
    resp = resp.data;
    console.log(resp);
    let finalResult = null;
    if (resp.status == "ok") {
      console.log("hello");
      const result = await waitForCompletion(resp, 5);
      finalResult = result?.data;
      setExecuteresult(finalResult);
      console.log("Final result:", result);

      // Save submission to Firestore
      const status = getSubmissionStatus(finalResult);
      const submissionData = {
        code: code,
        language: language,
        status: status,
        result: finalResult,
        runtime: finalResult?.runtime || "N/A",
        memory: finalResult?.memory || "N/A",
        testsPassed: finalResult?.testsPassed 
          ? `${finalResult.testsPassed}/${finalResult.totalTests || finalResult.testsPassed}`
          : "N/A",
      };
      
      await saveSubmissionToFirestore(submissionData);
    }
    setcooldown(true);
    setrunning(false);
    setTimeout(() => setcooldown(false), 10 * 1000);
  };

  // Helper function to find a tab node by name
  const findTabNodeByName = (node, tabName) => {
    if (node.name === tabName && node.type === "tab") {
      return node;
    }

    if (node.children) {
      for (let child of node.children) {
        const found = findTabNodeByName(child, tabName);
        if (found) {
          return found;
        }
      }
    }

    return null;
  };
  if (loading) {
    return (
      <div className="h-[100vh] items-center flex justify-center bg-[#262626]">
        Loading...
      </div>
    ); // Render a loading state
  }
  return (
    <div className="problempage_container flex h-[100vh] min-w-[360px] flex-col  text-label-1 dark:text-dark-label-1 overflow-x-auto">
      <div className="h-[100vh]   min-w-[1000px]">
        <div className="flex h-full w-full flex-col bg-layer-bg-gray dark:bg-layer-bg-gray">
          {/* Add your components above the layout here */}
          <div className="relative text-white h-[48px]">
            <nav className="z-nav-1 relative flex h-[48px] w-full shrink-0 items-center px-5 pr-2.5">
              <div className="flex w-full justify-between">
                <div className="flex w-full justify-between items-center">
                  <div className="flex items-center">
                    <a
                      className="relative mr-2  flex h-10 items-center w-[30px] cursor-pointer"
                      href="/"
                    >
                      <img
                        src="/images/logo.png"
                        className="h-[20px] w-[17px]"
                      />
                    </a>
                    <div className="hover:bg-[#333333] p-[8px] pt-0 pb-0">
                      <div className="flex items-center justify-between h-[32px] w-[122px] cursor-pointer ">
                        <MenuIcon />
                        Problem List
                        <Opennewtab />
                      </div>
                    </div>
                    <div className="w-[32px] h-[32px] relative rounded-lg cursor-pointer hover:bg-[#333333]">
                      <Prevbtn />
                    </div>
                    <div className="w-[32px] h-[32px] relative rounded-lg cursor-pointer hover:bg-[#333333]">
                      <Nextbtn />
                    </div>
                    <div className="w-[32px] h-[32px] relative rounded-lg cursor-pointer hover:bg-[#333333]">
                      <Suffle />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex w-full justify-between">
                <div className="flex w-full justify-end items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-[32px] h-[32px] relative rounded-lg cursor-pointer hover:bg-[#333333]">
                      <Layouticon />
                    </div>
                    <div className="w-[32px] h-[32px] relative rounded-lg cursor-pointer hover:bg-[#333333]">
                      <Settingicon />
                    </div>
                    <div className="w-[43px] h-[32px] relative rounded-lg cursor-pointer hover:bg-[#333333] flex items-center justify-center">
                      <div className="w-[20px] h-[20px]">
                        <Streakicon />
                      </div>

                      <span className="m-[4px] mt-0 mb-0">0</span>
                    </div>
                    <button className="w-[36px] h-[24px] flex justify-center items-center">
                      <img
                        src="/images/logo.png"
                        alt=""
                        className="w-[24px] h-[24px] rounded-full"
                      />
                    </button>
                    <button className="w-[84px] h-[32px] flex justify-center items-center text-[#ffa116] bg-[#ffa1161f] hover:bg-[#ffa11633]">
                      Premium
                    </button>
                  </div>
                </div>
              </div>
            </nav>
            <div className="z-nav-5 absolute left-1/2 top-0 h-full -translate-x-1/2 py-2">
              <div className="flex justify-between items-center flex-none gap-2">
                {!running ? (
                  <div className="flex justify-between items-center flex-none gap-1">
                    <button className="w-[32px] h-[32px] relative rounded-tl-[8px] rounded-bl-[8px] cursor-pointer bg-[#222222] hover:bg-[#2F2F2F] flex items-center justify-center">
                      <Debuggericon />
                    </button>
                    <button
                      className="w-[77px] h-[32px] relative rounded-none cursor-pointer bg-[#222222] hover:bg-[#2F2F2F]  items-center justify-center inline-flex py-[6px] px-[12px]"
                      onClick={() => Sumbitcode(false)}
                    >
                      <div className="w-[20px] h-[20px] relative mr-[8px]">
                        <PlayButton />
                      </div>
                      Run
                    </button>
                    <button
                      className="rounded-tr-[8px] rounded-br-[8px] w-[97px] h-[32px] relative rounded-none cursor-pointer bg-[#222222] hover:bg-[#2F2F2F]  items-center justify-center inline-flex py-[6px] px-[12px] text-[#28c244]"
                      onClick={() => Sumbitcode(true)}
                    >
                      <div className="w-[20px] h-[20px] relative mr-[8px]">
                        <Uploadbutton />
                      </div>
                      Submit
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center flex-none gap-1">
                      <div className="w-[150px] relative rounded cursor-pointer bg-[#222222] hover:bg-[#2F2F2F]  items-center justify-center flex py-[6px] px-[12px] gap-2">
                        <div className="w-5 h-5">
                          <img src="/images/pending.gif" alt="" />
                        </div>
                        <div>Pending</div>
                      </div>
                    </div>
                  </div>
                )}
                <button className="w-[32px] h-[32px] relative rounded-md cursor-pointer bg-[#222222] hover:bg-[#2F2F2F]">
                  <Timericon />
                </button>
                <button className="w-[32px] h-[32px] relative rounded-md cursor-pointer bg-[#222222] hover:bg-[#2F2F2F]">
                  <Notesicon />
                </button>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-grow overflow-y-hidden p-[10px] pt-0">
            <div className="relative flex h-full w-full">
              <Layout
                model={model}
                factory={factory}
                onRenderTab={onRenderTab}
                onRenderTabSet={onRenderTabSet}
                // onRenderTab={onRenderTab}
                // onRenderTab={onRenderTab}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problempage;
