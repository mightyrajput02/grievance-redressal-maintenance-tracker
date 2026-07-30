import React, { useState } from "react";
import { ArrowLeft, Star, Send, MessageSquareHeart } from "lucide-react";
import "./Feedback.css";

const Feedback = ({ onBack }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Later, you will send this data to your Node/Express backend!
    console.log("Feedback Submitted:", { rating, comment });
    setIsSubmitted(true);
  };

  return (
    <div className="feedback-container">
      {/* Background elements to match your theme */}
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
              <p>
                Help us improve campus life by rating our maintenance services.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="feedback-form">
              {/* Star Rating Section */}
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

              {/* Text Area Section */}
              <div className="comment-section">
                <label htmlFor="feedback-text">Any additional thoughts?</label>
                <textarea
                  id="feedback-text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="e.g., The response time for the AC repair in my hostel was great, but the Wi-Fi in the AI/ML labs needs some improvement..."
                  rows="5"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="submit-feedback-btn"
                disabled={rating === 0}
              >
                <Send size={20} />
                Submit Feedback
              </button>
            </form>
          </div>
        ) : (
          // Success State after clicking submit
          <div className="success-message">
            <MessageSquareHeart size={80} color="#16a34a" />
            <h2>Thank You!</h2>
            <p>Your feedback has been sent to the campus care team.</p>
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
