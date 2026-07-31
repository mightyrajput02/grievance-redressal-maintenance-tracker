import React, { useState } from "react";

function EditComplaintModal({ complaint, onClose, onSave, onDelete }) {
  const [status, setStatus] = useState(complaint.status || "Pending");
  const [priority, setPriority] = useState(complaint.priority || "Medium");
  const [staff, setStaff] = useState(complaint.staff || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(complaint.id, { status, priority, staff });
    setLoading(false);
    onClose();
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete complaint ${complaint.id}?`)) {
      setLoading(true);
      await onDelete(complaint.id);
      setLoading(false);
      onClose();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "480px",
          padding: "24px",
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "18px" }}>Manage Complaint: {complaint.id}</h3>
          <button
            onClick={onClose}
            style={{ border: "none", background: "transparent", fontSize: "18px", cursor: "pointer" }}
          >
            ✕
          </button>
        </div>

        <div style={{ marginBottom: "16px", background: "#f8fafc", padding: "12px", borderRadius: "6px" }}>
          <p style={{ margin: "0 0 4px 0", fontWeight: "bold" }}>{complaint.title}</p>
          <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
            Student: {complaint.student_id} | Category: {complaint.category}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
              Assigned Maintenance Staff
            </label>
            <input
              type="text"
              placeholder="e.g. Ravi, Kiran, Arjun"
              value={staff}
              onChange={(e) => setStaff(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              style={{
                background: "#ef4444",
                color: "#fff",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Delete
            </button>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: "#e2e8f0",
                  color: "#334155",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditComplaintModal;
