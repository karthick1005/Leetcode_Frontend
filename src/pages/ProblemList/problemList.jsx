// import ProblemsTable from "@/components/ProblemsTable/ProblemsTable";
// import Topbar from "@/components/Topbar/Topbar";
// import useHasMounted from "@/hooks/useHasMounted";

import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../Utils/Firebase";
export default function ProblemList() {
  const [loadingProblems, setLoadingProblems] = useState(false);
  const [problems, setproblems] = useState(null);
  //   const hasMounted = useHasMounted();
  useEffect(() => {
    const fetchdata = async () => {
      let querySnapshot = await getDocs(collection(db, "problemset"));
      let newproblem = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        let data = {
          id: doc.id,
          data: doc.data(),
        };
        newproblem.push(data);
        console.log(data);
      });
      setproblems(newproblem);
    };
    fetchdata();
  }, []);
  //   if (!hasMounted) return null;

  return (
    <>
      <main className="bg-[#1A1A1A] min-h-screen">
        {/* <Topbar /> */}
        <h1
          className="text-2xl text-center text-gray-700 dark:text-gray-400 font-medium
					uppercase mt-10 mb-5"
        >
          &ldquo; QUALITY OVER QUANTITY &rdquo; 👇
        </h1>
        <div className="relative overflow-x-auto mx-auto px-6 pb-10">
          {/* {loadingProblems && (
            <div className="max-w-[1200px] mx-auto sm:w-7/12 w-full animate-pulse">
              {[...Array(10)].map((_, idx) => (
                <LoadingSkeleton key={idx} />
              ))}
            </div>
          )} */}
          <table className="text-sm text-left text-gray-500 dark:text-gray-400 sm:w-7/12 w-full max-w-[1200px] mx-auto">
            {!loadingProblems && (
              <thead className="text-xs text-gray-700 uppercase dark:text-gray-400 border-b ">
                <tr>
                  {/* <th scope="col" className="px-1 py-3 w-0 font-medium">
                    Status
                  </th> */}
                  <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Difficulty
                  </th>

                  <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Category
                  </th>
                  {/* <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Solution
                  </th> */}
                </tr>
              </thead>
            )}
            {!loadingProblems && (
              <tbody className="text-white">
                {problems?.map((problem, idx) => {
                  console.log("hello");
                  const difficulyColor =
                    problem.data.Type === "Easy"
                      ? "text-dark-green-s"
                      : problem.data.Type === "Medium"
                        ? "text-dark-yellow"
                        : "text-dark-pink";
                  return (
                    <tr
                      className={`${idx % 2 == 1 ? "bg-[#282828]" : ""}`}
                      key={idx}
                    >
                      {/* <th className="px-2 py-4 font-medium whitespace-nowrap text-dark-green-s">
                      {solvedProblems.includes(problem.id) && (
                        <BsCheckCircle fontSize={"18"} width="18" />
                      )}
                    </th> */}
                      <td className="px-6 py-4">
                        <a
                          className="hover:text-blue-600 cursor-pointer"
                          href={`/${problem.id}`}
                        >
                          {problem.data.Title}
                        </a>
                      </td>
                      <td className={`px-6 py-4 ${difficulyColor}`}>
                        {problem.data.Type}
                      </td>
                      <td className={"px-6 py-4"}>
                        {problem.data.Topics.join(",")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )}
            {/* <ProblemsTable setLoadingProblems={setLoadingProblems} /> */}
          </table>
        </div>
      </main>
    </>
  );
}

const LoadingSkeleton = () => {
  return (
    <div className="flex items-center space-x-12 mt-4 px-6">
      <div className="w-6 h-6 shrink-0 rounded-full bg-dark-layer-1"></div>
      <div className="h-4 sm:w-52  w-32  rounded-full bg-dark-layer-1"></div>
      <div className="h-4 sm:w-52  w-32 rounded-full bg-dark-layer-1"></div>
      <div className="h-4 sm:w-52 w-32 rounded-full bg-dark-layer-1"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};
