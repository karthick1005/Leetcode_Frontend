import React from "react";
import { Hinticon, Lockicon, Topicicon } from "../../assets/icon";
const Description = ({ data }) => {
  return (
    <div className=" bg-[#262626]">
      <div className="flex w-full flex-1 flex-col gap-4 overflow-y-auto px-4 py-5">
        <div className="flex">
          <div className="flex justify-center items-center font-semibold text-[24px]">
            {data.Sno}. {data.Title}
          </div>
        </div>
        <div className="flex gap-1">
          <div className="text-[#46c6c2] text-[12px] bg-[#ffffff1a] rounded-full px-2 py-1">
            {data.Type}
          </div>
          <div className="text-white text-[12px] bg-[#ffffff1a] rounded-full px-4 py-1 flex justify-between items-center gap-1 cursor-pointer">
            <div className="relative mr-2">
              <Topicicon />
            </div>
            <div>Topic</div>
          </div>
          <div className="text-white text-[12px] bg-[#ffffff1a] rounded-full px-2 py-1 flex justify-between items-center gap-1 cursor-pointer">
            <div className="relative ">
              <Lockicon />
            </div>
            <div>Companies</div>
          </div>
          <div className="text-white text-[12px] bg-[#ffffff1a] rounded-full px-4 py-1 flex justify-between items-center gap-1 cursor-pointer">
            <div className="relative mr-2">
              <Hinticon />
            </div>
            <div>Hint</div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {data.Description.map((val, i) => {
            return <p>{val}</p>;
          })}
          {data.Examples.map((val, index) => (
            <div>
              <p className="font-bold mb-4">Example {index + 1}</p>
              <div className="border-l pl-4 border-[#ffffff24]">
                {val.Input !== undefined && (
                  <div className="flex gap-3">
                    <p className="font-bold">Input:</p>
                    <p className="text-[#fff9]">{val.Input}</p>
                  </div>
                )}
                {val.Output !== undefined && (
                  <div className="flex gap-3">
                    <p className="font-bold">Output:</p>
                    <p className="text-[#fff9]">{val.Output}</p>
                  </div>
                )}
                {val.Explanation !== undefined && (
                  <div className="flex gap-3">
                    <p className="font-bold">Explanation:</p>
                    <p className="text-[#fff9]">{val.Explanation}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div>
          <p className="font-bold mb-4">Constraints:</p>
          <ul className="list-disc m-4 mt-0 marker:text-white">
            {data.Constraints.map((val, index) => (
              <li className="mb-[.75rem]">
                <code className="bg-[#ffffff12] border-[#f7faff1f] rounded-[5px] border text-[#eff1f6bf] p-[.125rem] ">
                  {val}
                </code>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          {data.Followup !== undefined && (
            <div className="flex gap-1">
              <p className="font-bold mb-4">Follow-up: </p>
              <p>{data.Followup}</p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <hr className="border-[#f7faff1f]" />
          <div className="flex flex-col gap-3">
            <div className="flex gap-5 items-center text-[#fff9]">
              <p>Seen this question in a real interview before?</p>
              <p>1/5</p>
            </div>
            <div className="flex gap-4">
              <button className="py-1 px-2 cursor-pointer rounded-[12px] bg-[#ffffff1a] text-[#eff1f6bf] text-xs">
                Yes
              </button>
              <button className="py-1 px-2 cursor-pointer rounded-[12px] bg-[#ffffff1a] text-[#eff1f6bf] text-xs">
                No
              </button>
            </div>
            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center flex-wrap gap-2">
                <p className="text-[#eff1f6bf] text-xs">Accepted</p>
                <p className="font-medium text-sm">15.4M</p>
              </div>
              <div className="flex items-center flex-wrap gap-2">
                <p className="text-[#eff1f6bf] text-xs">Submissions</p>
                <p className="font-medium text-sm">15.4M</p>
              </div>
              <div className="flex items-center flex-wrap gap-2">
                <p className="text-[#eff1f6bf] text-xs">Acceptance Rate</p>
                <p className="font-medium text-sm">15.4M</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-0">
            <hr className="border-[#f7faff1f]" />
            <div className="collapse collapse-arrow ">
              <input type="checkbox" />
              <div className="collapse-title text-sm font-medium cursor-pointer text-[#f5f5f5] text-[14px] ">
                <div className="flex gap-1 items-center">
                  <div className="relative">
                    <Topicicon />
                  </div>
                  Topics
                </div>
              </div>
              <div className="collapse-content p-0 pl-[28px]">
                <div>
                  <div className="flex gap-4">
                    {data.Topics.map((val, index) => (
                      <button className="py-1 px-2 cursor-pointer rounded-[12px] bg-[#ffffff1a] text-[#fff9] text-xs hover:text-[#f5f5f5]">
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <hr className="border-[#f7faff1f]" />
            {data.Companies !== undefined && (
              <div className="collapse collapse-arrow">
                <input type="checkbox" />
                <div className="collapse-title text-sm font-medium cursor-pointer text-[#f5f5f5] text-[14px]">
                  <div className="flex gap-1 items-center">
                    <div className="relative">
                      <Lockicon />
                    </div>
                    Companies
                  </div>
                </div>
                <div className="collapse-content p-0 pl-[28px]">
                  <div>
                    <div className="flex gap-4">
                      {data.Companies.map((val, index) => (
                        <button className="py-1 px-2 cursor-pointer rounded-[12px] bg-[#ffffff1a] text-[#fff9] text-xs hover:text-[#f5f5f5]">
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {data?.Hint?.map((val, index) => (
              <>
                <hr className="border-[#f7faff1f]" />
                <div className="collapse collapse-arrow">
                  <input type="checkbox" />
                  <div className="collapse-title text-sm font-medium cursor-pointer text-[#f5f5f5] text-[14px]">
                    <div className="flex gap-3 items-center">
                      <div className="relative">
                        <Hinticon />
                      </div>
                      Hint {index + 1}
                    </div>
                  </div>
                  <div className="collapse-content p-0 pl-[28px]">
                    <div>
                      <div className="flex gap-4 text-[14px]">
                        <p>{val}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Description;
