import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import DashboardCards from "../components/DashboardCards";
import ComplaintTable from "../components/ComplaintTable";
import SearchPage from "./SearchPage";
import { fetchStats, fetchFeedback } from "../services/api";

function AdminDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0, in_progress: 0 });
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    if (activePage === "reports") {
      fetchStats().then(setStats).catch(console.error);
      fetchFeedback().then(setFeedbacks).catch(console.error);
    }
  }, [activePage]);

  return (
    <div>
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <Topbar />

      {activePage === "dashboard" && (
        <>
          <DashboardCards />
          <ComplaintTable />
        </>
      )}

      {activePage === "complaints" && <ComplaintTable />}

      {activePage === "search" && <SearchPage />}

      {activePage === "reports" && (
        <div
          style={{
            marginLeft: "280px",
            marginTop: "30px",
            padding: "20px",
          }}
        >
          <h2>Reports & Analytics</h2>
          <p>Real-time analytics fetched directly from the database.</p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "16px",
              marginBottom: "30px",
            }}
          >
            <div style={{ padding: "16px", background: "#f1f5f9", borderRadius: "8px" }}>
              <span style={{ fontSize: "12px", color: "#64748b" }}>Total Complaints</span>
              <h3 style={{ margin: "4px 0", fontSize: "24px" }}>{stats.total}</h3>
            </div>
            <div style={{ padding: "16px", background: "#fef3c7", borderRadius: "8px" }}>
              <span style={{ fontSize: "12px", color: "#b45309" }}>Pending</span>
              <h3 style={{ margin: "4px 0", fontSize: "24px", color: "#b45309" }}>{stats.pending}</h3>
            </div>
            <div style={{ padding: "16px", background: "#e0e7ff", borderRadius: "8px" }}>
              <span style={{ fontSize: "12px", color: "#4338ca" }}>In Progress</span>
              <h3 style={{ margin: "4px 0", fontSize: "24px", color: "#4338ca" }}>{stats.in_progress}</h3>
            </div>
            <div style={{ padding: "16px", background: "#dcfce7", borderRadius: "8px" }}>
              <span style={{ fontSize: "12px", color: "#15803d" }}>Resolved</span>
              <h3 style={{ margin: "4px 0", fontSize: "24px", color: "#15803d" }}>{stats.resolved}</h3>
            </div>
          </div>

          <h3>Recent Student Feedback</h3>
          {feedbacks.length === 0 ? (
            <p style={{ color: "#64748b" }}>No user feedback recorded yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {feedbacks.map((fb) => (
                <div key={fb.id} style={{ border: "1px solid #e2e8f0", padding: "12px", borderRadius: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong>Student: {fb.student_id}</strong>
                    <span style={{ color: "#eab308" }}>{"★".repeat(fb.rating)}</span>
                  </div>
                  <p style={{ margin: "4px 0 0 0", color: "#334155" }}>{fb.comments}</p>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>Date: {fb.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
