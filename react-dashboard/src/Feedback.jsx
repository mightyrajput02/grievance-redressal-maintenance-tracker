import React, { useState } from "react";
import { ArrowLeft, Star, Send, MessageSquareHeart } from "lucide-react";
import { submitFeedback } from "./services/api";
import "./Feedback.css";

const Feedback = ({ onBack }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [studentId, setStudentId] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;

    setLoading(true);
    setError(null);
    try {
      await submitFeedback({
        student_id: studentId || "Anonymous",
        rating,
        comments: comment,
      });
      setIsSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-container">
      <div className="bg-circle top-left"></div>
      <div className="bg-circle bottom-right"></div>

      <div className="feedback-content">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        {!isSubmitted ? (
          <div className="feedback-form-wrapper">
            <header className="feedback-header">
              <h1>Share Your Experience</h1>
              <p>Help us improve campus life by rating our maintenance services.</p>
            </header>

            {error && (
              <div style={{ padding: "12px", background: "#fee2e2", color: "#b91c1c", borderRadius: "8px", marginBottom: "16px" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="feedback-form">
              <div className="comment-section" style={{ marginBottom: "16px" }}>
                <label>Student ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 22BCS001"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div className="rating-section">
                <label>How would you rate the service?</label>
                <div className="stars-container">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={40}
                      className={`star ${star <= (hoveredRating || rating) ? "active" : ""}`}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
              </div>

              <div className="comment-section">
                <label htmlFor="feedback-text">Any additional thoughts?</label>
                <textarea
                  id="feedback-text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="e.g., The response time for the AC repair in my hostel was great..."
                  rows="5"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="submit-feedback-btn"
                disabled={rating === 0 || loading}
              >
                <Send size={20} />
                {loading ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>
          </div>
        ) : (
          <div className="success-message">
            <MessageSquareHeart size={80} color="#16a34a" />
            <h2>Thank You!</h2>
            <p>Your feedback has been saved in the database.</p>
            <button className="return-btn" onClick={onBack}>
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;
