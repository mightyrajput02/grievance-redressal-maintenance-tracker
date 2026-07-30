import React, { useState } from "react";
import "../css/SearchPage.css";

function SearchPage() {
  const [search, setSearch] = useState("");

  const complaints = [
    {
      id: 101,
      student: "Aryan",
      category: "Hostel",
      status: "Pending",
    },
    {
      id: 102,
      student: "Rahul",
      category: "Electrical",
      status: "Resolved",
    },
    {
      id: 103,
      student: "Priya",
      category: "WiFi",
      status: "In Progress",
    },
  ];

  const filtered = complaints.filter((item) =>
    (item.student + item.category + item.status + item.id)
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="search-page">
      <h2>Search Complaints</h2>

      <input
        type="text"
        placeholder="Search by ID, Student, Category or Status..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>ID</th>

            <th>Student</th>

            <th>Category</th>

            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>

              <td>{item.student}</td>

              <td>{item.category}</td>

              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SearchPage;
