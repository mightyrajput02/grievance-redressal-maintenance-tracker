import React, { useState } from "react";
import { FileText, Search, Trash2, MessageSquare, LogOut } from "lucide-react";
import ComplaintForm from "./ComplaintForm.jsx";
import ComplaintTracking from "./ComplaintTracking.jsx";
import Feedback from "./Feedback.jsx";
import "./dashboard.css";

// ADD THIS LINE!

const Dashboard = () => {
  // This state controls what is on the screen: 'dashboard' or 'complaint-form'
  const [activeView, setActiveView] = useState("dashboard");

  const features = [
    {
      id: 1,
      title: "Complaint Registration",
      description:
        "File a new grievance or request maintenance for your hostel or classroom.",
      icon: <FileText size={36} color="#f97316" />,
      // When this button is clicked, change the view!
      action: () => setActiveView("complaint-form"),
    },
    {
      id: 2,
      title: "Complaint Tracking",
      description:
        "Check the real-time status and updates of your active requests.",
      icon: <Search size={36} color="#1e3a8a" />,
      action: () => setActiveView("complaint-tracking"),
    },
    {
      id: 3,
      title: "Complaint Removal",
      description:
        "Withdraw a pending complaint or remove a resolved issue from your history.",
      icon: <Trash2 size={36} color="#dc2626" />,
      action: () => alert("Management feature coming soon!"),
    },
    {
      id: 4,
      title: "Feedback",
      description:
        "Share your experience with the campus care team to help us improve.",
      icon: <MessageSquare size={36} color="#16a34a" />,
      action: () => setActiveView("feedback"),
    },
  ];

  // If the view state changes to 'complaint-form', show the form!
  if (activeView === "complaint-form") {
    return <ComplaintForm onBack={() => setActiveView("dashboard")} />;
  }
  if (activeView === "complaint-tracking") {
    return <ComplaintTracking onBack={() => setActiveView("dashboard")} />;
  }
  if (activeView === "feedback") {
    return <Feedback onBack={() => setActiveView("dashboard")} />;
  }

  // Otherwise, show the normal styled dashboard
  return (
    <div className="dashboard-container">
      {/* Background decorations matching your CSS */}
      <div className="bg-circle top-left"></div>
      <div className="bg-circle bottom-right"></div>

      <div className="dashboard-content">
        <header className="dashboard-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1>Campus Care Dashboard</h1>
            <p>Select an option below to manage your grievances and requests.</p>
          </div>
          <button
            className="logout-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              background: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px"
            }}
            onClick={() => {
              localStorage.removeItem("portal");
              window.location.href = "http://localhost:5500/frontend/index.html";
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </header>

        <div className="button-layout">
          {features.map((feature) => (
            <button
              key={feature.id}
              className="big-action-btn"
              onClick={feature.action}
            >
              <div className="icon-ring">{feature.icon}</div>
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
