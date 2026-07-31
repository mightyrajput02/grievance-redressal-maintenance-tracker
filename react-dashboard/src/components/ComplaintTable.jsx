import React, { useState, useEffect } from "react";
import { fetchComplaints, updateComplaint, deleteComplaint } from "../services/api";
import EditComplaintModal from "./EditComplaintModal";
import "../css/Table.css";

function ComplaintTable() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const loadComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchComplaints();
      setComplaints(data);
    } catch (err) {
      setError(err.message || "Failed to load complaints from backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleSave = async (id, updatedData) => {
    try {
      await updateComplaint(id, updatedData);
      loadComplaints();
    } catch (err) {
      alert("Failed to update: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteComplaint(id);
      loadComplaints();
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  return (
    <div className="table-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2 style={{ margin: 0 }}>Complaint Management</h2>
        <button
          onClick={loadComplaints}
          style={{
            padding: "6px 12px",
            background: "#0284c7",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "13px"
          }}
        >
          Refresh Data
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>Loading data from server...</div>
      ) : error ? (
        <div style={{ color: "red", padding: "10px" }}>{error}</div>
      ) : complaints.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px" }}>No complaints in database.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Title</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Staff</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint.id}>
                <td>{complaint.id}</td>
                <td>{complaint.student_id}</td>
                <td>{complaint.title}</td>
                <td>{complaint.category}</td>
                <td>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      backgroundColor:
                        complaint.priority === "High"
                          ? "#fee2e2"
                          : complaint.priority === "Medium"
                          ? "#fef3c7"
                          : "#e0f2fe",
                      color:
                        complaint.priority === "High"
                          ? "#b91c1c"
                          : complaint.priority === "Medium"
                          ? "#b45309"
                          : "#0369a1",
                    }}
                  >
                    {complaint.priority}
                  </span>
                </td>
                <td>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      backgroundColor:
                        complaint.status === "Resolved"
                          ? "#dcfce7"
                          : complaint.status === "In Progress"
                          ? "#e0e7ff"
                          : "#fef3c7",
                      color:
                        complaint.status === "Resolved"
                          ? "#15803d"
                          : complaint.status === "In Progress"
                          ? "#4338ca"
                          : "#b45309",
                    }}
                  >
                    {complaint.status}
                  </span>
                </td>
                <td>{complaint.staff || "Unassigned"}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => setSelectedComplaint(complaint)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedComplaint && (
        <EditComplaintModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default ComplaintTable;
