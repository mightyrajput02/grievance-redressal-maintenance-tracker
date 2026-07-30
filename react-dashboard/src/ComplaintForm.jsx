import React from "react";
import { ArrowLeft, Upload, Send } from "lucide-react";
import "./ComplaintForm.css";

const ComplaintForm = ({ onBack }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, this just shows a success pop-up and sends you back
    alert("Complaint registered successfully!");
    onBack();
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

          <form onSubmit={handleSubmit} className="complaint-form">
            <div className="input-group">
              <label>Student ID</label>
              <input type="text" placeholder="e.g., 25BAIXXXX" required />
            </div>

            <div className="input-group">
              <label>Complaint Title</label>
              <input
                type="text"
                placeholder="Briefly describe the issue (e.g., AC not working)"
                required
              />
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea
                rows="5"
                placeholder="Explain the problem in detail..."
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

            <button type="submit" className="submit-form-btn">
              <Send size={20} /> Submit Complaint
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComplaintForm;
