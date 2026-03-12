import React, { useState, useEffect } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../Utils/Firebase";

const NotesModal = ({ isOpen, onClose, submission, problemId }) => {
  const [notes, setNotes] = useState("");
  const [tag, setTag] = useState(null);
  const [saving, setSaving] = useState(false);
  const uid = auth.currentUser?.uid;

  const tags = [
    { id: "default", color: "#b0acac", label: "Default" },
    { id: "yellow", color: "#ffb800", label: "Yellow" },
    { id: "blue", color: "#007aff", label: "Blue" },
    { id: "green", color: "#24c241", label: "Green" },
    { id: "magenta", color: "#ff1493", label: "Magenta" },
    { id: "purple", color: "#7731ff", label: "Purple" },
  ];

  useEffect(() => {
    if (submission?.notes) {
      setNotes(submission.notes);
    } else {
      setNotes("");
    }
    if (submission?.tag) {
      setTag(submission.tag);
    } else {
      setTag("default");
    }
  }, [submission, isOpen]);

  const handleSave = async () => {
    if (!uid || !problemId || !submission?.id) return;

    setSaving(true);
    try {
      const submissionRef = doc(
        db,
        "users",
        uid,
        "problemSubmissions",
        problemId,
        "submissions",
        submission.id
      );

      await updateDoc(submissionRef, {
        notes: notes,
        tag: tag,
      });

      onClose();
    } catch (error) {
      console.error("Error saving notes:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Transition show={isOpen} as="div">
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as="div"
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="fixed inset-0 bg-black/50"
        />

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="div"
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="relative w-full max-w-lg transform rounded-lg bg-[#262626] p-4 shadow-lg transition-all border border-[#404040]">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                  type="button"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 384 512"
                  >
                    <path d="M345 137c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-119 119L73 103c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l119 119L39 375c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l119-119L311 409c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-119-119L345 137z" />
                  </svg>
                </button>

                {/* Header */}
                <div className="mb-4">
                  <h2 className="text-lg font-medium text-white">Notes</h2>
                </div>

                {/* Textarea */}
                <div className="mb-4">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Write your notes here"
                    className="h-40 w-full resize-none rounded-lg border-0 bg-[#353535] px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                {/* Tags */}
                <div className="mb-6 flex gap-2">
                  {tags.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTag(t.id)}
                      className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-2 transition-all hover:scale-110"
                      style={{
                        borderColor: t.color,
                        backgroundColor:
                          tag === t.id ? t.color : "transparent",
                      }}
                      title={t.label}
                    >
                      {tag === t.id && (
                        <svg
                          className="h-3 w-3"
                          fill="white"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9.688 15.898l-3.98-3.98a1 1 0 00-1.415 1.414L8.98 18.02a1 1 0 001.415 0L20.707 7.707a1 1 0 00-1.414-1.414l-9.605 9.605z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={onClose}
                    disabled={saving}
                    className="relative inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 bg-[#353535] text-gray-300 hover:bg-[#404040] h-8 px-3 text-sm rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="relative inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-8 px-3 text-sm rounded-md"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default NotesModal;
