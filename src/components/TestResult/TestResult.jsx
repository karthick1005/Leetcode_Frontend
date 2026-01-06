import React, { useState, useEffect } from "react";
import { CopyIcon } from "../../assets/icon";

const TestResult = ({ data, quesdata, Loading }) => {
  const [activecase, setactivecase] = useState(0);
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   if (!data) {
  //     setIsLoading(true);
  //     // Simulate a loading delay (e.g., fetching data)
  //     setTimeout(() => setIsLoading(false), 1000); // Adjust delay as needed
  //   }
  // }, [data]);
  useEffect(() => {
    if (data?.data[activecase]?.stdout.length >= 1) {
      const container = document.getElementById("Stdout");
      const totalItems = data.data[activecase].stdout.length;
      const itemHeight = 20; // Height of each item (adjust accordingly)
      const buffer = 5; // Number of items to render above and below the viewport

      container.style.height = "500px"; // Set a fixed height to enable scrolling
      container.style.overflowY = "auto";

      // This function will be called whenever the user scrolls
      function renderVisibleItems() {
        const containerHeight = container.clientHeight;
        const scrollTop = container.scrollTop;

        // Calculate start and end indices for visible items based on scroll position
        const start = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
        const end = Math.min(
          totalItems,
          Math.ceil((scrollTop + containerHeight) / itemHeight) + buffer
        );

        let htmlContent = "";

        // Build the HTML content for the visible range
        for (let i = start; i < end; i++) {
          htmlContent += `<div class="font-menlo relative mx-3 whitespace-pre-wrap break-all leading-5 text-white">${data.data[activecase].stdout[i]}</div>`;
        }

        // Update the container's innerHTML with the visible content
        container.innerHTML = htmlContent;
      }

      // Initial render of visible items
      renderVisibleItems();

      // Add scroll event listener to render items as the user scrolls
      container.addEventListener("scroll", renderVisibleItems);
    }
  }, [data]);
  const copyText = (text) => {
    navigator.clipboard.writeText(text);
  };
  return (
    <div
      className={`bg-[#262626] h-[100%] ${Loading ? "overflow-hidden" : ""}`}
    >
      {Loading && data ? (
        <div className="flex flex-col gap-4 px-5 py-4 ">
          <div className="h-6 bg-[#3c3c3c] w-32 rounded animate-pulse"></div>
          <div className="h-5 bg-[#3c3c3c] w-20 rounded animate-pulse"></div>

          <div className="flex flex-wrap gap-2">
            {data.data.map((_, index) => (
              <div
                key={index}
                className="h-8 w-20 bg-[#3c3c3c] rounded-lg animate-pulse"
              ></div>
            ))}
          </div>

          <div className="space-y-4">
            {["Input", "Output", "Expected"].map((label) => (
              <div key={label}>
                <div className="mb-2 h-4 bg-[#3c3c3c] w-16 rounded animate-pulse"></div>
                <div className="h-12 bg-[#3c3c3c] rounded-lg animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      ) : data ? (
        <div className="flex h-full flex-col justify-between">
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4 px-5 py-4">
              <div className="flex items-center">
                {data.Accepted ? (
                  <div className="text-xl font-medium text-[#2cbb5d]">
                    Accepted
                  </div>
                ) : (
                  <div className="text-xl font-medium text-[#ef4743]">
                    <>{data.status ? data.error : "Wrong Answer"}</>
                    {/* {data.error} */}
                  </div>
                )}
                <div className="ml-4 text-[#eff2f699]">
                  Runtime: {Math.ceil(data.runtime)} ms
                </div>
              </div>
              {data.status && data.error === "Runtime Error" && (
                <div className="group relative rounded-lg bg-[rgba(246,54,54,0.08)] px-3 py-4 dark:bg-[rgba(248,97,92,0.08)]">
                  <div className="line-break: anywhere;">
                    <div className="relative gap-2">
                      <div className="mb-6 align-middle">
                        <div className=" whitespace-pre-wrap break-all text-xs text-[#f8615c]">
                          {data.data[0].stderr}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-4">
                {data.data.map((val, index) => {
                  if (index >= 8) return null;
                  return (
                    <button
                      key={index}
                      className={`text-[#eff1f6bf] hover:bg-[#ffffff1a] hover:text-white py-1 px-4 rounded-lg flex relative group justify-between items-center gap-2 ${
                        activecase === index ? "bg-[#ffffff1a]" : ""
                      }`}
                      onClick={() => {
                        setactivecase(index);
                      }}
                    >
                      <div
                        className={`h-1 w-1 rounded-full ${
                          data.data[index].testcasestatus
                            ? "bg-[#2cbb5d]"
                            : "bg-[#ef4743]"
                        }`}
                      ></div>
                      Case {index + 1}
                    </button>
                  );
                })}
              </div>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 text-xs font-medium text-[#eff2f699]">
                    Input
                  </div>
                  <div className="space-y-2">
                    {quesdata.Inputname.map((val, i) => (
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
                              copyText(data.data[activecase].input[i])
                            }
                          >
                            <div className="relative cursor-pointer flex h-[22px] w-[22px] items-center justify-center bg-[#323232] hover:bg-[#ffffff14] rounded-[4px]">
                              <CopyIcon />
                            </div>
                          </div>
                          <div className="mx-3 whitespace-pre-wrap break-all leading-5 text-white">
                            <div>{data.data[activecase].input[i]}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {data.data[activecase]?.stdout.length >= 1 && (
                  <div className="flex h-full w-full flex-col space-y-2 ">
                    <div className="flex text-xs font-medium text-[#eff2f699]">
                      Stdout
                    </div>
                    <div className="group relative rounded-lg bg-[#ffffff12] ">
                      <div className="relative py-3 hide-scrollbar" id="Stdout">
                        {/* {data.data[activecase].stdout.map((val) => (
                          <div className="font-menlo relative mx-3 whitespace-pre-wrap break-all leading-5 text-white">
                            {val}
                          </div>
                        ))} */}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex h-full w-full flex-col space-y-2">
                  <div className="flex text-xs font-medium text-[#eff2f699]">
                    Output
                  </div>
                  <div className="group relative rounded-lg bg-[#ffffff12]">
                    <div className="relative py-3">
                      <div className="font-menlo relative mx-3 whitespace-pre-wrap break-all leading-5 text-white">
                        {data.data[activecase].output === null
                          ? "Undefined"
                          : data.data[activecase].output}
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
                        {data.data[activecase].Expected === ""
                          ? "undefined"
                          : data.data[activecase].Expected}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[100%] text-[#ebebf54d]">
          You must run your code first
        </div>
      )}
    </div>
  );
};

export default TestResult;
