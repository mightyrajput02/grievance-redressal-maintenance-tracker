import React, { useState } from "react";
import { ArrowLeft, Search, Clock, CheckCircle, Wrench } from "lucide-react";
import "./ComplaintTracking.css";

const ComplaintTracking = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data to show how it will look
  const complaints = [
    {
      id: "CMP-2094",
      issue: "AC not cooling in Room 402",
      date: "Oct 24, 2026",
      status: "Pending",
      icon: <Clock size={18} />,
      statusClass: "pending",
    },
    {
      id: "CMP-2081",
      issue: "Broken projector in Lab 3",
      date: "Oct 21, 2026",
      status: "In Progress",
      icon: <Wrench size={18} />,
      statusClass: "progress",
    },
    {
      id: "CMP-1955",
      issue: "Leaking tap in 2nd Floor Washroom",
      date: "Oct 10, 2026",
      status: "Resolved",
      icon: <CheckCircle size={18} />,
      statusClass: "resolved",
    },
  ];

  return (
    <div className="tracking-container">
      {/* Background elements */}
      <div className="bg-circle top-left"></div>
      <div className="bg-circle bottom-right"></div>

      <div className="tracking-content">
        {/* Back Button */}
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <header className="tracking-header">
          <h1>Track Your Complaints</h1>
          <p>Check the real-time status of your maintenance requests.</p>
        </header>

        {/* Search Bar */}
        <div className="search-bar-container">
          <Search className="search-icon" size={20} color="#64748b" />
          <input
            type="text"
            placeholder="Enter Complaint ID (e.g., CMP-2094)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button className="search-btn">Search</button>
        </div>

        {/* Complaint List */}
        <div className="complaints-list">
          {complaints.map((item) => (
            <div key={item.id} className="complaint-card">
              <div className="complaint-info">
                <span className="complaint-id">{item.id}</span>
                <h3>{item.issue}</h3>
                <p>Submitted on: {item.date}</p>
              </div>
              <div className={`status-badge ${item.statusClass}`}>
                {item.icon}
                <span>{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComplaintTracking;
