import React, { useState } from "react";
import { ArrowLeft, Upload, Send } from "lucide-react";
import { createComplaint } from "./services/api";
import "./ComplaintForm.css";

const ComplaintForm = ({ onBack }) => {
  const [studentId, setStudentId] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Electrical");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const created = await createComplaint({
        student_id: studentId,
        title,
        category,
        priority,
        description,
      });

      setMessage({ type: "success", text: `Complaint registered successfully! ID: ${created.id}` });
      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to register complaint. Make sure backend server is running." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <div className="form-card">
          <div className="form-header">
            <h2>Register a Complaint</h2>
            <p>Please provide the details of your issue below.</p>
          </div>

          {message && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "20px",
                fontWeight: "500",
                fontSize: "14px",
                background: message.type === "success" ? "#dcfce7" : "#fee2e2",
                color: message.type === "success" ? "#15803d" : "#b91c1c",
                border: `1px solid ${message.type === "success" ? "#86efac" : "#fca5a5"}`,
              }}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="complaint-form">
            <div className="input-group">
              <label>Student ID</label>
              <input
                type="text"
                placeholder="e.g., 22BCS001"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Complaint Title</label>
              <input
                type="text"
                placeholder="Briefly describe the issue (e.g., AC not working)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="input-group">
                <label>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                  }}
                >
                  <option value="Electrical">Electrical</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="IT">IT Support</option>
                  <option value="Carpentry">Carpentry</option>
                  <option value="Cleanliness">Cleanliness</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="input-group">
                <label>Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                  }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea
                rows="4"
                placeholder="Explain the problem in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="input-group">
              <label>Upload Attachment (Optional)</label>
              <div className="file-upload-wrapper">
                <input type="file" id="attachment" className="file-input" />
                <label htmlFor="attachment" className="file-label">
                  <Upload size={20} /> Choose an Image or PDF
                </label>
              </div>
            </div>

            <button type="submit" className="submit-form-btn" disabled={loading}>
              <Send size={20} /> {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComplaintForm;
