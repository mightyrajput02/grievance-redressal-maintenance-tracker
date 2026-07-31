import React, { useState, useEffect } from "react";
import { fetchComplaints } from "../services/api";
import "../css/SearchPage.css";

function SearchPage() {
  const [search, setSearch] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  const performSearch = async (query = "") => {
    setLoading(true);
    try {
      const data = await fetchComplaints({ search: query });
      setComplaints(data);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performSearch(search);
  }, [search]);

  return (
    <div className="search-page" style={{ marginLeft: "280px", padding: "20px" }}>
      <h2>Search Complaints</h2>

      <input
        type="text"
        placeholder="Search by ID, Student ID, Title, or Category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #cbd5e1",
          marginBottom: "20px",
          fontSize: "14px",
        }}
      />

      {loading ? (
        <p>Searching database...</p>
      ) : complaints.length === 0 ? (
        <p>No matching complaints found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned Staff</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.student_id}</td>
                <td>{item.title}</td>
                <td>{item.category}</td>
                <td>{item.priority}</td>
                <td>{item.status}</td>
                <td>{item.staff || "Unassigned"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SearchPage;
