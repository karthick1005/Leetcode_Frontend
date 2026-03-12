import React from 'react'

const SubmissionDetails = ({selectedSubmission}) => {
    console.log("Selected Submission in Details:", selectedSubmission);
   return (
          <div style={{ padding: "20px", color: "#fff", background: "#1f1f1f", height: "100%", overflowY: "auto" }}>
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ color: "#fff", marginBottom: "10px" }}>Submission Details</h3>
              <div style={{ backgroundColor: "#262626", padding: "15px", borderRadius: "8px" }}>
                <div style={{ marginBottom: "10px" }}>
                  <span style={{ color: "#888" }}>Status: </span>
                  <span style={{ color: selectedSubmission?.status === "Accepted" ? "#28a745" : "#dc3545" }}>
                    {selectedSubmission?.status}
                  </span>
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <span style={{ color: "#888" }}>Language: </span>
                  <span>{selectedSubmission?.language}</span>
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <span style={{ color: "#888" }}>Runtime: </span>
                  <span>{selectedSubmission?.runtime || "N/A"}</span>
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <span style={{ color: "#888" }}>Memory: </span>
                  <span>{selectedSubmission?.memory || "N/A"}</span>
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <span style={{ color: "#888" }}>Submitted: </span>
                  <span>
                    {selectedSubmission?.submittedAt &&
                      (selectedSubmission.submittedAt.toDate
                        ? selectedSubmission.submittedAt.toDate().toLocaleString()
                        : new Date(selectedSubmission.submittedAt).toLocaleString())}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h3 style={{ color: "#fff", marginBottom: "10px" }}>Code</h3>
              <pre
                style={{
                  backgroundColor: "#1e1e1e",
                  padding: "15px",
                  borderRadius: "8px",
                  color: "#d4d4d4",
                  fontSize: "12px",
                  overflowX: "auto",
                  maxHeight: "300px",
                }}
              >
                {selectedSubmission?.code}
              </pre>
            </div>
          </div>
        )
}

export default SubmissionDetails