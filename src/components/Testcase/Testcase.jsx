import React, { useEffect, useRef, useState } from "react";
import { Closeicon, Plusicon, TestcaseCodeicon } from "../../assets/icon";
import CodeMirror from "@uiw/react-codemirror";
// import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import { createTheme } from "@uiw/codemirror-themes";
import "./Testcase.css";
const Testcase = ({ testcase, settestcase, data }) => {
  const [datas, setdatas] = useState(["testcase", "testcase", "testcase"]);
  // const [testcase, settestcase] = useState(data.SampleTestcase);
  const [activecase, setactivecase] = useState(0);
  const [source, setsource] = useState(false);
  const editorRef = useRef(null);
  const onChange = React.useCallback((val, viewUpdate) => {
    console.log("val:", val);
    setValue(val);
  }, []);
  const myTheme = createTheme({
    theme: "dark",
    settings: {
      background: "#262626",
      backgroundImage: "",
      foreground: "#fffff",
      caret: "white",
      selection: "#036dd626",
      selectionMatch: "#036dd626",
      lineHighlight: "#ffffff0f",
      gutterBackground: "#262626",
      gutterForeground: "#838383",
      // fontFamily:""
    },
  });
  const myEditorTheme = EditorView.theme(
    {
      // Background and foreground colors
      ".cm-content": {
        backgroundColor: "#262626", // Background color of the editor
        color: "#ffffff", // Text color (foreground)
      },
      // Caret (cursor) color
      ".cm-cursor": {
        borderLeftColor: "white", // Cursor color
      },
      // Selection color
      // ".cm-selectionBackground , .cm-selectionMatch": {
      //   backgroundColor: "#036dd626", // Selection background color (matches will also use this)
      // },
      "&.cm-focused .cm-selectionBackground, ::selection ,.cm-selectionMatch": {
        backgroundColor: "red",
      },
      ".cm-focused .cm-selectionBackground, .cm-line::selection, .cm-selectionLayer .cm-selectionBackground, .cm-content ::selection":
        {
          backgroundColor: "red !important", // Update this with your desired color
        },
      // Line highlight color
      ".cm-activeLine , .cm-activeLineGutter": {
        backgroundColor: "#ffffff0f", // Highlight the current line
      },
      // Gutter (line numbers) background and foreground
      ".cm-gutters": {
        backgroundColor: "#262626", // Gutter background color
        // width: "40px",
      },
      ".cm-lineNumbers": {
        width: "40px",
        color: "#838383", // Gutter text color (line numbers)
      },

      // Add more customizations if needed
    },
    { dark: true }
  );
  const [currentLine, setCurrentLine] = useState(
    editorRef.current?.view.state.doc.lineAt(
      editorRef.current?.view.state.selection.main.head
    ).number || 1
  );
  const updatelinenumber = () => {
    setCurrentLine(
      editorRef.current?.view.state.doc.lineAt(
        editorRef.current?.view.state.selection.main.head
      ).number
    );
  };
  return (
    <div className="bg-[#262626]  flex h-full w-full flex-col justify-between">
      <div className="flex-1 overflow-y-auto">
        {!source ? (
          <div>
            <div className="mx-5 my-4 flex flex-col space-y-4">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-4">
                {datas.map((val, index) => {
                  if (index >= 8) return null;
                  return (
                    <button
                      className={`text-[#eff1f6bf] hover:bg-[#ffffff1a] hover:text-white py-1 px-4 rounded-lg flex relative group ${
                        activecase === index ? "bg-[#ffffff1a]" : ""
                      }`}
                      onClick={() => {
                        console.log("this is clicked  ");
                        setactivecase(index);
                      }}
                    >
                      Case {index + 1}
                      {datas.length > 1 && (
                        <div
                          className="bg-transparent  flex h-6 w-6 items-center justify-center absolute right-0 top-0 -translate-y-[40%] translate-x-[40%] opacity-0 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            let test = testcase;
                            test.splice(
                              index * data.Inputname.length,
                              data.Inputname.length
                            );
                            settestcase(test);
                            let newdata = datas.slice(0, datas.length - 1);
                            if (newdata.length == 1) {
                              setactivecase(0);
                            } else {
                              setactivecase(newdata.length - 1);
                            }
                            setdatas(newdata);
                          }}
                        >
                          <div className="bg-[#5C5C5C]  hover:bg-[#8A8A8A]  flex h-3 w-3 cursor-pointer items-center justify-center rounded-full">
                            <Closeicon />
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
                {datas.length <= 7 && (
                  <button
                    // data-state="closed"
                    className="rounded font-medium whitespace-nowrap focus:outline-none  text-[#5C5C5C] hover:text-[#8A8A8A]  bg-transparent  hover:bg-transparent dark:hover:bg-transparent m-0 flex h-4 w-4 items-center justify-center p-0"
                    onClick={() => {
                      setdatas([...datas, "testcase"]);
                      let newtestcase = [];
                      for (let i = 0; i < data.Inputname.length; i++) {
                        if (data.Inputname.length == 1) {
                          newtestcase[i] = testcase[activecase];
                        } else {
                          if (activecase == 0) {
                            newtestcase[i] = testcase[activecase + i];
                          } else {
                            newtestcase[i] =
                              testcase[activecase * data.Inputname.length + i];
                          }
                        }
                      }
                      settestcase([...testcase, ...newtestcase]);
                      setactivecase(datas.length);
                    }}
                  >
                    <Plusicon />
                  </button>
                )}
              </div>
              <div>
                <div className="flex h-full w-full flex-col space-y-2"></div>

                {data.Inputname.map((val, index) => (
                  <>
                    <div className="text-xs font-medium text-[#eff2f699]">
                      {val} =
                    </div>
                    <div className=" w-full cursor-text rounded-lg border px-3 py-[10px] bg-fill-3 dark:bg-[#ffffff1a] border-transparent">
                      <input
                        type="text"
                        className="w-full resize-none whitespace-pre-wrap break-words outline-none placeholder:text-label-4 dark:placeholder:text-dark-label-4 sentry-unmask bg-transparent"
                        placeholder="Enter Testcase"
                        value={
                          data.Inputname.length === 1
                            ? testcase[activecase]
                            : `${
                                activecase === 0
                                  ? testcase[activecase + index] || ""
                                  : testcase[
                                      activecase * data.Inputname.length + index
                                    ] || ""
                              }`
                        }
                        onChange={(e) => {
                          const currentval = e.target.value;
                          const test = [...testcase]; // Create a copy to avoid mutating state directly

                          if (data.Inputname.length === 1) {
                            test[activecase] = currentval;
                          } else {
                            if (activecase === 0) {
                              test[activecase + index] = currentval;
                            } else {
                              test[activecase * data.Inputname.length + index] =
                                currentval;
                            }
                          }

                          settestcase(test);
                        }}
                      />
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 h-[calc(100%_-_28px)]">
            <div className="ml-0 mr-5 h-full">
              <div className="relative h-full">
                <div className="relative h-full rounded-lg pb-6">
                  <div className="flex flex-1 flex-col overflow-hidden h-full w-full">
                    <div className="flex-1 overflow-hidden">
                      <CodeMirror
                        value={testcase.join("\n")}
                        height="200px"
                        theme={myTheme}
                        extensions={[
                          EditorView.lineWrapping, // Enables line wrapping

                          // customTheme,
                        ]}
                        ref={editorRef}
                        onChange={(value) => {
                          console.log(
                            value.split("\n").length / data.Inputname.length
                          );
                          let newarr = Array(
                            Math.ceil(
                              value.split("\n").length / data.Inputname.length
                            )
                          ).fill("testcase");
                          console.log(newarr);
                          setdatas(newarr);
                          settestcase(value.split("\n"));
                        }}
                        onUpdate={(e) => updatelinenumber()}
                        // style={{ fontSize: "13px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex w-full flex-none items-center justify-between gap-2 p-1">
        <div className="flex items-center">
          <div
            className={`cursor-pointer mr-1 select-none p-1 text-xs bg-transparent  group active:bg-[#ffffff24]  rounded-lg px-2 py-1 ${
              source ? "bg-[#454545]" : ""
            }`}
            onClick={() => setsource(!source)}
          >
            <div className="group flex items-center gap-2 text-sm text-[#b7b7b799] ">
              <div className="relative text-[14px] leading-[normal] p-[1px] before:block before:h-3.5 before:w-3.5 text-[#8A8A8A]-6 group-hover:text-[#f5f5f5bf] ">
                <TestcaseCodeicon />
              </div>
              <span className=" group-hover:text-[#eff2f699]">Source</span>
            </div>
          </div>
          {data.SampleTestcase !== testcase && (
            <span
              className="flex cursor-pointer items-center whitespace-nowrap text-xs mr-2 text-[#b7b7b799]   hover:text-[#f5f5f5bf]"
              onClick={() => {
                settestcase(data.SampleTestcase);
                setdatas(["testcase", "testcase", "testcase"]);
              }}
            >
              Reset Testcases
            </span>
          )}
        </div>
        {source && (
          <div>
            <div className="text-[#ebebf54d]  flex-nowrap items-center space-x-2 whitespace-nowrap py-1 pr-1 text-xs flex">
              <div className="flex items-center">
                <div>
                  {Math.ceil(testcase.length / data.Inputname.length)}/8
                  testcases
                </div>
              </div>
              <div className="bg-[#f7faff2e]  w-px h-3"></div>
              <span>
                Line
                {" " + currentLine}
              </span>

              {Math.ceil(currentLine / data.Inputname.length) <= 8 && (
                <>
                  <div className="bg-[#f7faff2e]  w-px h-3"></div>
                  <span>
                    Case {Math.ceil(currentLine / data.Inputname.length)}:{" "}
                    {
                      data?.Inputname[
                        (currentLine % data.Inputname.length === 0
                          ? data.Inputname.length
                          : currentLine % data.Inputname.length) - 1
                      ]
                    }
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Testcase;
