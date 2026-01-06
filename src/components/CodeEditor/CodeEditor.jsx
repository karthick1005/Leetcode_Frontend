import { Editor, useMonaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { wireTmGrammars } from "monaco-editor-textmate";
import { Registry } from "monaco-textmate";
import { loadWASM } from "onigasm";
import { useEffect, useRef, useState } from "react";
import { getRequest, postRequest } from "../../Utils/axios";
import "./CodeEditor.css";
import Editortheme from "./Editortheme.json";
import javascriptjson from "./javascript.json";
const Dropdown = ({ language, setlanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const languages = ["java", "python", "javascript"];
  const toggleDropdown = () => setIsOpen(!isOpen);
  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return (
    <div className="relative">
      <button
        className="dropbtn rounded items-center whitespace-nowrap focus:outline-none   px-1.5 py-0.5 text-sm hover:bg-[#ffffff14] first-letter:capitalize text-[#AFAFAF]"
        onClick={() => setIsOpen(!isOpen)}
      >
        {language === "cpp" ? "C++" : capitalizeFirstLetter(language)}
        <div className="relative flex items-center justify-center text-[12px] leading-[normal] p-0.5 before:block before:h-3 before:w-3 ml-1 text-gray-60 dark:text-gray-60 mt-[3px]">
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="far"
            data-icon="chevron-down"
            class="svg-inline--fa fa-chevron-down absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M239 401c9.4 9.4 24.6 9.4 33.9 0L465 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-175 175L81 175c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9L239 401z"
            ></path>
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="dropdown-content absolute flex p-[8px] rounded-lg z-50">
          {languages.map((language_, index) => {
            return (
              <div
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("hello");
                  setlanguage(language_);
                  setIsOpen(false);
                }}
                // className="border-r border-solid px-2 first:pl-0 last:border-r-0 last:pr-0 border-border-tertiary dark:border-border-tertiary"
                //  hover:bg-fill-tertiary dark:hover:bg-fill-tertiary
                className=" group flex min-w-[140px] cursor-pointer items-center justify-between rounded-[4px] py-[6px] pl-[6px] pr-3 hover:bg-[#ffffff14] "
              >
                {language_ === "cpp" ? "C++" : capitalizeFirstLetter(language_)}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  class="pointer-events-none ml-1 h-[14px] w-[14px] opacity-0 group-hover:pointer-events-auto group-hover:opacity-100 text-gray-60 dark:text-gray-60"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12 11a1 1 0 011 1v4a1 1 0 11-2 0v-4a1 1 0 011-1zm0-3a1 1 0 110 2 1 1 0 010-2zm0 14C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const CodeEditor = ({ code, setcurrentcode, language, setlanguage }) => {
  const [autocomplete, setautocomplete] = useState(false);
  // const [language, setlanguage] = useState("javascript");
  const monacoref = useRef();
  const monacoInstance = useMonaco();
  var json = {
    comments: {
      lineComment: "//",
      blockComment: ["/*", "*/"],
    },
    brackets: [
      ["{", "}"],
      ["[", "]"],
      ["(", ")"],
    ],
    autoClosingPairs: [
      {
        open: "{",
        close: "}",
      },
      {
        open: "[",
        close: "]",
      },
      {
        open: "(",
        close: ")",
      },
      {
        open: "'",
        close: "'",
        notIn: ["string", "comment"],
      },
      {
        open: '"',
        close: '"',
        notIn: ["string"],
      },
      {
        open: "`",
        close: "`",
        notIn: ["string", "comment"],
      },
      {
        open: "/**",
        close: " */",
        notIn: ["string"],
      },
    ],
    surroundingPairs: [
      ["{", "}"],
      ["[", "]"],
      ["(", ")"],
      ["'", "'"],
      ['"', '"'],
      ["`", "`"],
    ],
    autoCloseBefore: ";:.,=}])>` \n\t",
    folding: {
      markers: {
        start: "^\\s*//\\s*#?region\\b",
        end: "^\\s*//\\s*#?endregion\\b",
      },
    },
  };
  // const darkPlusTheme = {
  //   base: "vs-dark",
  //   inherit: true,
  //   rules: [
  //     { token: "comment", foreground: "6A9955" },
  //     { token: "constant.language", foreground: "569cd6" },
  //     { token: "constant.numeric", foreground: "b5cea8" },
  //     { token: "entity.name.tag", foreground: "569cd6" },
  //     { token: "entity.other.attribute-name", foreground: "9cdcfe" },
  //     { token: "keyword", foreground: "569cd6" },
  //     { token: "markup.bold", fontStyle: "bold", foreground: "569cd6" },
  //     { token: "markup.italic", fontStyle: "italic" },
  //     { token: "markup.inserted", foreground: "b5cea8" },
  //     { token: "markup.deleted", foreground: "ce9178" },
  //     { token: "markup.inline.raw", foreground: "ce9178" },
  //     { token: "string", foreground: "ce9178" },
  //     { token: "variable", foreground: "d4d4d4" },
  //     { token: "variable.language", foreground: "569cd6" },
  //     { token: "meta.preprocessor", foreground: "569cd6" },
  //     { token: "storage.type", foreground: "569cd6" },
  //     { token: "punctuation.definition.tag", foreground: "808080" },
  //     { token: "invalid", foreground: "f44747" },
  //     { token: "string.regexp", foreground: "d16969" },
  //     { token: "keyword.operator", foreground: "d4d4d4" },
  //   ],
  //   colors: {
  //     "editor.background": "#1E1E1E",
  //     "editor.foreground": "#D4D4D4",
  //     "editor.selectionBackground": "#ADD6FF26",
  //     "editor.selectionHighlightBackground": "#ADD6FF26",
  //     "editor.inactiveSelectionBackground": "#3A3D41",
  //     "editorIndentGuide.background": "#404040",
  //     "editorIndentGuide.activeBackground": "#707070",
  //     "list.dropBackground": "#383B3D",
  //     "activityBarBadge.background": "#007ACC",
  //     "sideBarTitle.foreground": "#BBBBBB",
  //     "input.placeholderForeground": "#A6A6A6",
  //     "menu.background": "#252526",
  //     "menu.foreground": "#CCCCCC",
  //     "statusBarItem.remoteForeground": "#FFF",
  //     "statusBarItem.remoteBackground": "#16825D",
  //     "ports.iconRunningProcessForeground": "#369432",
  //     "sideBarSectionHeader.background": "#0000",
  //     "sideBarSectionHeader.border": "#ccc3",
  //     "tab.lastPinnedBorder": "#ccc3",
  //   },
  // };
  const darkPlusTheme = Editortheme;
  const onMount = async (editor) => {
    monacoref.current = editor;
    editor.focus();
    if (!autocomplete) {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, () => {});
    }
    editor.onDidChangeCursorSelection((event) => {
      setcurrentline(monacoref?.current?.getPosition().lineNumber);
      setcurrentcol(monacoref?.current?.getPosition().column);
    });
    setcurrentcode(editor.getValue());
    loadgrammer(editor);
  };
  const loadgrammer = async (editor) => {
    // Load the Oniguruma WASM for advanced regex support

    try {
      // Load the WASM file
      await loadWASM("/wasm/onigasm.wasm");
      console.log("WASM file loaded successfully!");
    } catch (error) {
      console.error("Failed to load WASM file:", error);
    }
    // Initialize the TextMate grammar registry
    const registry = new Registry({
      getGrammarDefinition: async (scopeName) => {
        console.log(scopeName);
        if (scopeName === "source.js") {
          return {
            format: "json",
            // content: await fetch("/path/to/JavaScript.tmLanguage.json").then(
            //   (res) => res.json()
            // ),
            content: javascriptjson,
          };
        }
        return null;
      },
    });
    const grammars = new Map();
    grammars.set("javascript", "source.js");
    try {
      await wireTmGrammars(monaco, registry, grammars, editor);
      console.log("text mate loaded");
    } catch (error) {
      console.error("Failed to wire TextMate grammar:", error);
    }
  };
  useEffect(() => {
    // monacoInstance?.languages.register({ id: "myCustomLanguage" });

    // // Define the tokens and syntax for the custom language
    // monacoInstance?.languages.setMonarchTokensProvider("javascript", {
    //   tokenizer: {
    //     root: [
    //       [/["'][^"']*["']/, "string"], // Strings
    //       [/\/\/.*$/, "comment"], // Single-line comments
    //       [/\/\*\*[\s\S]*?\*\//, "comment.doc"], // Multi-line comments
    //       [/[+\-*/=<>!]+/, "operator"], // Operators
    //       [
    //         /\b(?:if|else|for|while|return|function|const|let|var|class|new|this|try|catch|throw|async|await|'@param')\b/,
    //         "keyword",
    //       ], // Keywords
    //       [/\b\d+\.?\d*\b/, "number"], // Numbers
    //       [/[{}()\[\]]/, "@brackets"], // Brackets and Parentheses
    //     ],
    //   },
    // });
    // monacoInstance?.languages.setMonarchTokensProvider("javascript", {
    //   tokenizer: {
    //     root: [[/\b(if|else|for|while|return)\b/, "keyword.control"]],
    //   },
    // });
    // Define the language configuration
    // monacoInstance?.languages.setLanguageConfiguration("myCustomLanguage", {
    //   comments: {
    //     lineComment: "//",
    //     blockComment: ["/*", "*/"],
    //   },
    //   brackets: [
    //     ["{", "}"],
    //     ["[", "]"],
    //     ["(", ")"],
    //   ],
    // });
    // monacoInstance?.languages.setLanguageConfiguration("javascript", json);

    // monacoInstance?.editor.defineTheme("leetcode-theme", {
    //   base: "vs-dark",
    //   inherit: true,
    //   rules: [
    //     { token: "comment", foreground: "6A9955" },
    //     { token: "keyword", foreground: "569CD6" },
    //     { token: "string", foreground: "CE9178" },
    //     { token: "number", foreground: "B5CEA8" },
    //     { token: "identifier", foreground: "dcdcaa" },
    //     { token: "operator", foreground: "6A9955" },
    //     { token: "comment.doc", foreground: "6A9955" },
    //     { token: "invalid", foreground: "00000000" },
    //     { token: "error", foreground: "00000000" },
    //     { token: "warning", foreground: "00000000" },
    //   ],
    //   colors: {
    //     "editor.foreground": "#D4D4D4",
    //     "editor.background": "#1E1E1E",
    //     "editorCursor.foreground": "#AEAFAD",
    //     "editor.lineHighlightBackground": "#2B2B2B",
    //     "editor.lineHighlightBorder": "#282828",
    //     "editorLineNumber.foreground": "#858585",
    //     "editor.selectionBackground": "#264F78",
    //     "editor.inactiveSelectionBackground": "#3A3D41",
    //     "editorError.foreground": "#00000000",
    //     "editorWarning.foreground": "#00000000",
    //   },
    // });
    monacoInstance?.editor.defineTheme("leetcode-theme", darkPlusTheme);
    monacoInstance?.editor.setTheme("leetcode-theme");
  }, [monacoInstance]);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

  const sumbitdata = async () => {
    let code = monacoref?.current.getValue();
    console.log(code);
    let data = {
      src: code,
      stdin: [
        {
          input: "5 \n 2",
          expected: "7",
        },
      ],
      lang: "c",
      timeout: 1,
      testcase: false,
    };
    let resp = await postRequest("/submit", data);
    if (!resp.success) {
      console.log("Internal server error");
      return;
    }
    resp = resp.data;
    console.log(resp);
    if (resp.status == "ok") {
      console.log("hello");
      const result = await waitForCompletion(resp, 5);

      console.log("Final result:", result);
    }
  };

  const darkVsTheme = {
    base: "vs-dark",
    inherit: true,
    colors: {
      "editor.background": "#1E1E1E",
      "editor.foreground": "#D4D4D4",
      "editor.selectionBackground": "#ADD6FF26",
      "editor.selectionHighlightBackground": "#ADD6FF26",
      "editor.inactiveSelectionBackground": "#3A3D41",
      "editorIndentGuide.background": "#404040",
      "editorIndentGuide.activeBackground": "#707070",
      "list.dropBackground": "#383B3D",
      "activityBarBadge.background": "#007ACC",
      "sideBarTitle.foreground": "#BBBBBB",
      "input.placeholderForeground": "#A6A6A6",
      "menu.background": "#252526",
      "menu.foreground": "#CCCCCC",
      "statusBarItem.remoteForeground": "#FFF",
      "statusBarItem.remoteBackground": "#16825D",
      "ports.iconRunningProcessForeground": "#369432",
      "sideBarSectionHeader.background": "#0000",
      "sideBarSectionHeader.border": "#ccc3",
      "tab.lastPinnedBorder": "#ccc3",
    },
    tokenColorCustomizations: {
      textMateRules: [
        {
          scope: "comment",
          settings: { foreground: "#6A9955" },
        },
        {
          scope: "constant.language",
          settings: { foreground: "#569cd6" },
        },
        {
          scope: "keyword",
          settings: { foreground: "#569cd6" },
        },
        {
          scope: "string",
          settings: { foreground: "#ce9178" },
        },
        {
          scope: "invalid",
          settings: { foreground: "#f44747" },
        },
      ],
    },
  };
  const [currentline, setcurrentline] = useState(0);
  const [currentcol, setcurrentcol] = useState(0);
  useEffect(() => {
    if (monacoref.current) {
      console.log(language);
      monacoref.current.getModel().setValue(code[language]);
      monacoref.current.getModel().setLanguage(language);
    }
  }, [language]);
  return (
    <div className="editorcss">
      <div className="h-[32px] relative overflow-visible">
        {/* hello */}
        <Dropdown setlanguage={setlanguage} language={language} />
      </div>
      <div className="relative min-h-0 h-[100%]">
        <Editor
          // height={"100vh"}
          // width={"100vw"}

          defaultLanguage={language}
          // theme="vs-dark"
          value={code[language]}
          theme="leetcode-theme"
          onMount={onMount}
          options={{
            hover: {
              enabled: false,
            },
            quickSuggestions: false,
            suggestOnTriggerCharacters: false,
            contextmenu: false,
            minimap: { enabled: false },
            // disableSuggestions: true,
            // scrollbar: {
            //   vertical: "hidden",
            // },
            scrollBeyondLastLine: false,
            wordBasedSuggestions: "off",
          }}
          loading=""
          onChange={(e) => setcurrentcode(e)}
        />
      </div>
      <div className="flex h-9 items-center justify-between px-3 py-2  text-[#AFAFAF] text-[12px]">
        <div>Saved</div>
        <div>
          Ln {currentline} , Col {currentcol}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
