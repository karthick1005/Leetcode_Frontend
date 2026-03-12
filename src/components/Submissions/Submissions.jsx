import React, { useEffect, useState, useMemo } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption, Transition } from "@headlessui/react";
import { auth, db } from "../../Utils/Firebase";
import NotesModal from "./NotesModal";

const Submissions = ({ problemId, onSubmissionClick }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("Status");
  const [selectedLanguage, setSelectedLanguage] = useState("Language");
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [selectedSubmissionForNotes, setSelectedSubmissionForNotes] = useState(null);

  const uid = auth.currentUser?.uid;

  const statusOptions = [
    "Status",
    "Accepted",
    "Wrong Answer",
    "Runtime Error",
    "Time Limit Exceeded",
    "Memory Limit Exceeded",
  ];

  const languageOptions = useMemo(() => {
    const languages = new Set(submissions.map((s) => s.language));
    return ["Language", ...Array.from(languages).sort()];
  }, [submissions]);

  useEffect(() => {
    if (!uid || !problemId) return;

    const fetchSubmissions = async () => {
      try {
        setLoading(true);

        const submissionsRef = collection(
          db,
          "users",
          uid,
          "problemSubmissions",
          problemId,
          "submissions"
        );

        const q = query(submissionsRef, orderBy("submittedAt", "desc"));
        const querySnapshot = await getDocs(q);

        const submissionsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSubmissions(submissionsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [uid, problemId]);

  const getRelativeTime = (timestamp) => {
    if (!timestamp) return "";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const getStatusStyles = (status) => {
    const baseClasses =
      "text-sm font-medium";
    if (status === "Accepted") {
      return `${baseClasses} text-green-500`;
    }
    return `${baseClasses} text-red-500`;
  };

  const getFullDateTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const ClockIcon = () => (
    <svg
      className="h-3.5 w-3.5"
      fill="currentColor"
      viewBox="0 0 512 512"
    >
      <path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z" />
    </svg>
  );

  const MicrochipIcon = () => (
    <svg
      className="h-3.5 w-3.5"
      fill="currentColor"
      viewBox="0 0 512 512"
    >
      <path d="M184 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64h-8c-35.3 0-64 28.7-64 64v8H24c-13.3 0-24 10.7-24 24s10.7 24 24 24H64v48H24c-13.3 0-24 10.7-24 24s10.7 24 24 24H64v48H24c-13.3 0-24 10.7-24 24s10.7 24 24 24H64v8c0 35.3 28.7 64 64 64h8v40c0 13.3 10.7 24 24 24s24-10.7 24-24V448h48v40c0 13.3 10.7 24 24 24s24-10.7 24-24V448h48v40c0 13.3 10.7 24 24 24s24-10.7 24-24V448h8c35.3 0 64-28.7 64-64v-8h40c13.3 0 24-10.7 24-24s-10.7-24-24-24H448V280h40c13.3 0 24-10.7 24-24s-10.7-24-24-24H448V184h40c13.3 0 24-10.7 24-24s-10.7-24-24-24H448v-8c0-35.3-28.7-64-64-64h-8V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H280V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H184V24zM400 128V384c0 8.8-7.2 16-16 16H128c-8.8 0-16-7.2-16-16V128c0-8.8 7.2-16 16-16H384c8.8 0 16 7.2 16 16zM192 160c-17.7 0-32 14.3-32 32V320c0 17.7 14.3 32 32 32H320c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32H192zm16 48h96v96H208V208z" />
    </svg>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-[#eff1f6bf]">
        Loading submissions...
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-[#eff1f6bf]">
        No submissions yet
      </div>
    );
  }

  const filteredSubmissions = submissions.filter((submission) => {
    const statusMatch =
      selectedStatus === "Status" || submission.status === selectedStatus;
    const languageMatch =
      selectedLanguage === "Language" || submission.language === selectedLanguage;
    return statusMatch && languageMatch;
  });

  return (
    <div className="flex h-full w-full flex-col bg-[#262626]">
      {/* HEADER WITH FILTERS */}
      <div className="sticky top-0 z-20 flex h-10 items-center border-b border-gray-700 bg-[#262626] px-3 text-sm text-[#eff1f6bf] gap-4">
        <div className="w-8 shrink-0"></div>

        {/* STATUS DROPDOWN */}
        <div className="w-[170px]">
          <Listbox value={selectedStatus} onChange={setSelectedStatus}>
            <div className="relative">
              <ListboxButton
                className="relative w-full cursor-pointer rounded-lg bg-[#353535] py-1 px-2 text-left text-xs text-gray-300 hover:bg-[#404040] transition-colors focus:outline-none focus:ring-2 "
                data-headlessui-state={selectedStatus !== "Status" ? "open" : ""}
              >
                <span className="block truncate font-medium">
                  {selectedStatus === "Status" ? "Status" : selectedStatus}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </span>
              </ListboxButton>
              <Transition
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <ListboxOptions className="listbox-options absolute z-10 mt-1 max-h-64 w-full min-w-[220px] overflow-auto rounded-lg bg-[#303030] py-2 shadow-lg border border-[#404040]">
                  {statusOptions.map((status, idx) => (
                    <ListboxOption
                      key={status}
                      className="group relative cursor-pointer select-none h-8 py-1.5 pl-2 pr-12 text-xs hover:bg-[#404040] transition-colors"
                      value={status}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected
                                ? "font-medium text-white"
                                : "font-normal text-gray-300"
                            }`}
                          >
                            {status}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-500">
                              <svg
                                className="h-5 w-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9.688 15.898l-3.98-3.98a1 1 0 00-1.415 1.414L8.98 18.02a1 1 0 001.415 0L20.707 7.707a1 1 0 00-1.414-1.414l-9.605 9.605z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          )}
                        </>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Transition>
            </div>
          </Listbox>
        </div>

        {/* LANGUAGE DROPDOWN */}
        <div className="w-[92px]">
          <Listbox value={selectedLanguage} onChange={setSelectedLanguage}>
            <div className="relative">
              <ListboxButton
                className="relative w-full cursor-pointer rounded-lg bg-[#353535] py-1 px-2 text-left text-xs text-gray-300 hover:bg-[#404040] transition-colors focus:outline-none focus:ring-2 "
                data-headlessui-state={selectedLanguage !== "Language" ? "open" : ""}
              >
                <span className="block truncate font-medium">
                  {selectedLanguage === "Language" ? "Language" : selectedLanguage}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </span>
              </ListboxButton>
              <Transition
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <ListboxOptions className="listbox-options absolute z-10 mt-1 max-h-64 w-full min-w-[220px] overflow-auto rounded-lg bg-[#303030] py-2 shadow-lg border border-[#404040]">
                  {languageOptions.map((language) => (
                    <ListboxOption
                      key={language}
                      className="group relative cursor-pointer select-none h-8 py-1.5 pl-2 pr-12 text-xs hover:bg-[#404040] transition-colors"
                      value={language}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected
                                ? "font-medium text-white"
                                : "font-normal text-gray-300"
                            }`}
                          >
                            {language}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-500">
                              <svg
                                className="h-5 w-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9.688 15.898l-3.98-3.98a1 1 0 00-1.415 1.414L8.98 18.02a1 1 0 001.415 0L20.707 7.707a1 1 0 00-1.414-1.414l-9.605 9.605z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          )}
                        </>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Transition>
            </div>
          </Listbox>
        </div>

        <div className="w-[100px]">Runtime</div>
        <div className="w-[100px]">Memory</div>
        <div className="flex flex-1">Notes</div>
      </div>

      {/* LIST */}
      <div className="overflow-auto flex-1">
        {filteredSubmissions.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No submissions match the selected filters
          </div>
        ) : (
          filteredSubmissions.map((submission, index) => (
            <div
              key={submission.id}
              onClick={() => onSubmissionClick?.(submission)}
              className={`group flex h-12 items-center justify-between border-b border-gray-800 px-3 transition-colors cursor-pointer hover:bg-gray-700/30 ${
                index % 2 === 1 ? "bg-[#353535]" : ""
              }`}
            >
              {/* ID */}
              <div className="w-8 shrink-0 text-xs text-[#eff1f6bf]">
                {submissions.indexOf(submission) + 1}
              </div>

              {/* STATUS */}
              <div className="flex w-[170px] flex-col">
                <span className={getStatusStyles(submission.status)}>
                  {submission.status}
                </span>
                <span
                  className="text-xs text-[#eff1f6bf]"
                  title={getFullDateTime(submission.submittedAt)}
                >
                  {getRelativeTime(submission.submittedAt)}
                </span>
              </div>

              {/* LANGUAGE */}
              <div className="w-[92px]">
                <span className="inline-flex items-center gap-1 rounded-xl bg-[#525252] px-2 py-1 text-xs text-gray-300">
                  {submission.language}
                </span>
              </div>

              {/* RUNTIME */}
              <div className="flex w-[100px] items-center gap-1.5 text-sm text-[#eff1f6bf]">
                <ClockIcon />
                <span className="truncate">{submission.runtime || "N/A"}</span>
              </div>

              {/* MEMORY */}
              <div className="flex w-[100px] items-center gap-1.5 text-sm text-[#eff1f6bf]">
                <MicrochipIcon />
                <span className="truncate">{submission.memory || "N/A"}</span>
              </div>

              {/* NOTES */}
              <div className="flex flex-1 text-sm text-[#eff1f6bf]">
                {submission.notes ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSubmissionForNotes(submission);
                      setNotesModalOpen(true);
                    }}
                    className="max-w-xs truncate text-left text-gray-300  transition-colors line-clamp-1"
                  >
                    {submission.notes}
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSubmissionForNotes(submission);
                      setNotesModalOpen(true);
                    }}
                    className="hidden items-center gap-2 text-blue-500 group-hover:flex hover:text-blue-400 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 11h7a1 1 0 110 2h-7v7a1 1 0 11-2 0v-7H4a1 1 0 110-2h7V4a1 1 0 112 0v7z" />
                    </svg>
                    Notes
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* NOTES MODAL */}
      <NotesModal
        isOpen={notesModalOpen}
        onClose={() => {
          setNotesModalOpen(false);
          // Refresh submissions to show updated notes
          if (uid && problemId) {
            const fetchSubmissions = async () => {
              try {
                const submissionsRef = collection(
                  db,
                  "users",
                  uid,
                  "problemSubmissions",
                  problemId,
                  "submissions"
                );
                const q = query(submissionsRef, orderBy("submittedAt", "desc"));
                const querySnapshot = await getDocs(q);
                const submissionsData = querySnapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }));
                setSubmissions(submissionsData);
              } catch (error) {
                console.error(error);
              }
            };
            fetchSubmissions();
          }
        }}
        submission={selectedSubmissionForNotes}
        problemId={problemId}
      />
    </div>
  );
};

export default Submissions;