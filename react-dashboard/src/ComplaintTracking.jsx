import React, { useState, useEffect } from "react";
import { ArrowLeft, Search, Clock, CheckCircle, Wrench, AlertCircle } from "lucide-react";
import { fetchComplaints } from "./services/api";
import "./ComplaintTracking.css";

const ComplaintTracking = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async (query = "") => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchComplaints({ search: query });
      setComplaints(data);
    } catch (err) {
      setError(err.message || "Failed to load complaints from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadData(searchQuery);
  };

  const getStatusBadge = (status) => {
    const s = (status || "Pending").toLowerCase();
    if (s.includes("in progress")) {
      return (
        <div className="status-badge progress">
          <Wrench size={18} />
          <span>In Progress</span>
        </div>
      );
    }
    if (s.includes("resolved")) {
      return (
        <div className="status-badge resolved">
          <CheckCircle size={18} />
          <span>Resolved</span>
        </div>
      );
    }
    return (
      <div className="status-badge pending">
        <Clock size={18} />
        <span>Pending</span>
      </div>
    );
  };

  return (
    <div className="tracking-container">
      <div className="bg-circle top-left"></div>
      <div className="bg-circle bottom-right"></div>

      <div className="tracking-content">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <header className="tracking-header">
          <h1>Track Your Complaints</h1>
          <p>Check the real-time status of your maintenance requests.</p>
        </header>

        <form onSubmit={handleSearch} className="search-bar-container">
          <Search className="search-icon" size={20} color="#64748b" />
          <input
            type="text"
            placeholder="Enter Complaint ID, Student ID, or Title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
            Loading complaints from database...
          </div>
        ) : error ? (
          <div style={{ padding: "16px", background: "#fee2e2", color: "#b91c1c", borderRadius: "8px", textAlign: "center" }}>
            <AlertCircle size={20} style={{ verticalAlign: "middle", marginRight: "8px" }} />
            {error}
          </div>
        ) : complaints.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
            No complaints found matching your search.
          </div>
        ) : (
          <div className="complaints-list">
            {complaints.map((item) => (
              <div key={item.id} className="complaint-card">
                <div className="complaint-info">
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <span className="complaint-id">{item.id}</span>
                    <span style={{ fontSize: "12px", background: "#e2e8f0", padding: "2px 8px", borderRadius: "4px", color: "#475569" }}>
                      Student: {item.student_id}
                    </span>
                    <span style={{ fontSize: "12px", background: "#e0e7ff", padding: "2px 8px", borderRadius: "4px", color: "#4338ca" }}>
                      {item.category}
                    </span>
                  </div>
                  <h3 style={{ marginTop: "6px" }}>{item.title}</h3>
                  {item.description && <p style={{ fontSize: "14px", color: "#475569", margin: "4px 0" }}>{item.description}</p>}
                  <p style={{ fontSize: "12px", color: "#94a3b8" }}>
                    Submitted on: {item.date} | Staff Assigned: {item.staff || "Unassigned"}
                  </p>
                </div>
                {getStatusBadge(item.status)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintTracking;
