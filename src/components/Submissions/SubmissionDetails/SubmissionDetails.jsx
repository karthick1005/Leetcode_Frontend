import React, { useState } from "react";
import { CopyIcon } from "../../../assets/icon";
import CodeEditor from "../../CodeEditor/CodeEditor";

const SubmissionDetails = ({ selectedSubmission }) => {
  const [selectedColor, setSelectedColor] = useState(0);
  console.log("Selected submission:", selectedSubmission);
  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "#28a745";
      case "Wrong Answer":
      case "Runtime Error":
      case "Compilation Error":
        return "#dc3545";
      default:
        return "#888";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Accepted":
        return "✅";
      case "Wrong Answer":
        return "❌";
      case "Runtime Error":
        return "⚠️";
      case "Compilation Error":
        return "🔴";
      default:
        return "❓";
    }
  };
  const [expand, setexpand] = useState(false);
  const copyText = (text) => {
    navigator.clipboard.writeText(text);
  };
  if (!selectedSubmission) {
    return (
      <div
        style={{
          padding: "20px",
          color: "#888",
          background: "#262626",
          height: "100%",
          overflowY: "auto",
        }}
      >
        Select a submission to view details
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "0",
        color: "#fff",
        background: "#262626",
        height: "100%",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          borderBottom: "1px solid #262626",
          padding: "12px 16px",
          backgroundColor: "#262626",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            color: "#888",
            fontSize: "14px",
          }}
        >
          ← All Submissions
        </div>
        <div
          style={{
            cursor: "pointer",
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#888",
          }}
        >
          🔗
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Status Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              flex: 1,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  color: getStatusColor(selectedSubmission.status),
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                {selectedSubmission.status}
              </span>
              <div style={{ fontSize: "12px", color: "#888" }}>
                <span>
                  {selectedSubmission?.result.total_correct} /{" "}
                  {selectedSubmission?.result.total_testcases}
                </span>
                <span> testcases passed</span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
              }}
            >
              <img
                src="https://assets.leetcode.com/users/avatars/avatar_1687575557.png"
                alt="avatar"
                style={{ width: "16px", height: "16px", borderRadius: "50%" }}
              />
              <span style={{ color: "#fff", fontWeight: "500" }}>
                Udhayakarthick
              </span>
              <span style={{ color: "#888" }}>
                submitted at{" "}
                {selectedSubmission?.submittedAt
                  ? selectedSubmission.submittedAt.toDate
                    ? selectedSubmission.submittedAt
                        .toDate()
                        .toLocaleDateString()
                    : new Date(
                        selectedSubmission.submittedAt,
                      ).toLocaleDateString()
                  : "now"}
              </span>
            </div>
          </div>
          {selectedSubmission.status === "Accepted" && (
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #262626",
                  color: "#888",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Analysis
              </button>
              <button
                style={{
                  backgroundColor: "#28a745",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                Solution
              </button>
            </div>
          )}
        </div>

        {selectedSubmission.status === "Accepted" && (
          <>
            {/* Stats Cards */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                borderRadius: "8px",
                border: "1px solid #262626",
                padding: "12px",
              }}
            >
              {/* Runtime Card */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: "#262626",
                  padding: "16px",
                  borderRadius: "6px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12px",
                      color: "#888",
                    }}
                  >
                    🕐 Runtime
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "6px",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "24px",
                      fontWeight: "600",
                      color: "#fff",
                    }}
                  >
                    0
                  </span>
                  <span style={{ fontSize: "14px", color: "#888" }}>ms</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12px",
                  }}
                >
                  <span style={{ color: "#888" }}>Beats</span>
                  <span style={{ color: "#fff", fontWeight: "600" }}>
                    100.00%
                  </span>
                  <span style={{ color: "#28a745" }}>🎉</span>
                </div>
              </div>

              {/* Memory Card */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: "#262626",
                  padding: "16px",
                  borderRadius: "6px",
                  opacity: 0.4,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12px",
                      color: "#888",
                    }}
                  >
                    💾 Memory
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "6px",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "24px",
                      fontWeight: "600",
                      color: "#fff",
                    }}
                  >
                    41.93
                  </span>
                  <span style={{ fontSize: "14px", color: "#888" }}>MB</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12px",
                  }}
                >
                  <span style={{ color: "#888" }}>Beats</span>
                  <span style={{ color: "#fff", fontWeight: "600" }}>
                    91.03%
                  </span>
                  <span style={{ color: "#28a745" }}>🎉</span>
                </div>
              </div>
            </div>

            {/* Charts Placeholder */}
            <div
              style={{
                backgroundColor: "#262626",
                borderRadius: "8px",
                padding: "16px",
                minHeight: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#888",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "8px" }}>📊</div>
                <div>Runtime Distribution Chart</div>
              </div>
            </div>
          </>
        )}
        {(selectedSubmission.status &&
          selectedSubmission.status === "Runtime Error") ||
          (selectedSubmission.status === "Compilation Error" && (
            <div className="group relative rounded-lg bg-[rgba(246,54,54,0.08)] px-3 py-4 dark:bg-[rgba(248,97,92,0.08)]">
              <div className="line-break: anywhere;">
                <div className="relative gap-2">
                  <div className="mb-6 align-middle">
                    <div className=" whitespace-pre-wrap break-all text-xs text-[#f8615c]">
                      {selectedSubmission.result.full_runtime_error ||
                        selectedSubmission.result.full_compile_error}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        {selectedSubmission.status === "Wrong Answer" && (
          <>
            <div className="space-y-2">
              {selectedSubmission.Inputname.map((val, i) => (
                <div
                  key={i}
                  className="group relative rounded-lg bg-[#ffffff12]"
                >
                  <div className="relative py-3">
                    <div className="mx-3 mb-2 text-xs text-[#eff2f699]">
                      {val} =
                    </div>
                    <div
                      className="z-base-1 hidden rounded border group-hover:block border-[#ffffff1a] bg-[#323232] absolute right-3 top-2.5"
                      onClick={() =>
                        copyText(
                          selectedSubmission.result.lasttestcase.input.split(
                            "\n",
                          )[i] || "",
                        )
                      }
                    >
                      <div className="relative cursor-pointer flex h-[22px] w-[22px] items-center justify-center bg-[#323232] hover:bg-[#ffffff14] rounded-[4px]">
                        <CopyIcon />
                      </div>
                    </div>
                    <div className="mx-3 whitespace-pre-wrap break-all leading-5 text-white">
                      <div>
                        {selectedSubmission.result.lasttestcase.input.split(
                          "\n",
                        )[i] || ""}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex h-full w-full flex-col space-y-2">
              <div className="flex text-xs font-medium text-[#eff2f699]">
                Output
              </div>
              <div className="group relative rounded-lg bg-[#ffffff12]">
                <div className="relative py-3">
                  <div className="font-menlo relative mx-3 whitespace-pre-wrap break-all leading-5 text-white">
                    {selectedSubmission.result.lasttestcase.output === null
                      ? "Undefined"
                      : selectedSubmission.result.lasttestcase.output}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex h-full w-full flex-col space-y-2">
              <div className="flex text-xs font-medium text-[#eff2f699]">
                Expected
              </div>
              <div className="group relative rounded-lg bg-[#ffffff12]">
                <div className="relative py-3">
                  <div className="font-menlo relative mx-3 whitespace-pre-wrap break-all leading-5 text-white">
                    {selectedSubmission.result.lasttestcase.expected === ""
                      ? "undefined"
                      : selectedSubmission.result.lasttestcase.expected}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {/* Code Section */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#888",
              }}
            >
              Code
              <div
                style={{
                  width: "1px",
                  height: "12px",
                  backgroundColor: "#262626",
                }}
              ></div>
              <span style={{ color: "#888" }}>
                {selectedSubmission?.language || "Java"}
              </span>
            </div>
          </div>
          <div className="relative">
            <div
              className="min-h-[200px] overflow-y-auto rounded-lg bg-[#333333] relative"
              style={{
                height: expand ? `${(selectedSubmission.code.split("\n").length * 18)+20}px` : "200px",
              }}
            >
              {console.log(
                "Code to display:",
                selectedSubmission.code.split("\n").length,
              )}
              <CodeEditor
                code={{
                  [selectedSubmission?.language]: selectedSubmission.code,
                }}
                language={selectedSubmission.language}
                setcurrentcode={() => {}}
                setlanguage={() => {}}
                singlecode={true}
              />
            </div>
            {selectedSubmission.code.split("\n").length > 22 && (
              <div
                style={{
                  position: "absolute",
                  bottom: -32,
                  left: 0,
                  right: 0,
                  // background: "linear-gradient(to top, #262626, transparent)",
                  height: "32px",
                  // pointerEvents: "none",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  paddingBottom: "8px",
                  color: "#888",
                  fontSize: "12px",
                }}
                className="cursor-pointer z-[9999] mt-5 bg-[#333333]"
                onClick={() => setexpand(!expand)}
              >
                {expand ? "View less" : "View more"}
              </div>
            )}
          </div>
        </div>
          <div className="mt-[32px]">

       
        {/* More Challenges Section */}
        {selectedSubmission.status === "Accepted" && (
          <div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: "500",
                color: "#888",
                marginBottom: "12px",
              }}
            >
              More challenges
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {[
                { id: 461, title: "Hamming Distance", color: "#a89657" },
                { id: 2401, title: "Longest Nice Subarray", color: "#d4c33d" },
                { id: 2564, title: "Substring XOR Queries", color: "#d4c33d" },
              ].map((problem) => (
                <a
                  key={problem.id}
                  href={`/problems/${problem.title.toLowerCase().replace(/\s+/g, "-")}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: "none",
                    backgroundColor: "#262626",
                    color: "#fff",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#2a2a2a")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#262626")
                  }
                >
                  <div
                    style={{
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      backgroundColor: problem.color,
                    }}
                  ></div>
                  {problem.id}. {problem.title}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Notes Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderRadius: "8px",
              backgroundColor: "#262626",
              overflow: "hidden",
            }}
          >
            {/* Textarea */}
            <textarea
              placeholder="Write your notes here"
              style={{
                border: "none",
                outline: "none",
                height: "120px",
                width: "100%",
                resize: "none",
                padding: "12px",
                fontSize: "14px",
                backgroundColor: "transparent",
                color: "#fff",
                fontFamily: "system-ui",
              }}
            ></textarea>

            {/* Tags Input */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "8px",
                minHeight: "40px",
                width: "100%",
                padding: "12px",
                borderTop: "1px solid #1a1a1a",
                backgroundColor: "transparent",
                color: "#888",
                cursor: "text",
              }}
            >
              <input
                type="text"
                placeholder="Select related tags"
                style={{
                  border: "none",
                  padding: "6px 0",
                  fontSize: "13px",
                  backgroundColor: "transparent",
                  color: "#aaa",
                  outline: "none",
                  flex: 1,
                }}
              />
              <div style={{ fontSize: "12px", color: "#888" }}>0/5</div>
            </div>
          </div>

          {/* Color Tags */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: "12px",
            }}
          >
            <div style={{ display: "flex", gap: "12px" }}>
              {[
                { bg: "#888", isSelected: true },
                { border: "#d4c33d" },
                { border: "#0076ca" },
                { border: "#28a745" },
                { border: "#d946a6" },
                { border: "#a855f7" },
              ].map((color, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedColor(idx)}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    borderRadius: "50%",
                    padding: "3px",
                    backgroundColor: color.bg,
                    border: color.border ? `1px solid ${color.border}` : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.transform = "scale(1.1)")
                  }
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                >
                  {color.isSelected && (
                    <span style={{ color: "#fff", fontSize: "12px" }}>✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
           </div>
      </div>
    </div>
  );
};

export default SubmissionDetails;
