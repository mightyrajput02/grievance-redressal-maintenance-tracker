import React from "react";
import "../css/Search.css";

function SearchBar() {
  return (
    <div className="search-container">
      <input type="text" placeholder="Search complaint..." />

      <select>
        <option>All Status</option>

        <option>Pending</option>

        <option>In Progress</option>

        <option>Resolved</option>
      </select>

      <select>
        <option>All Category</option>

        <option>Electrical</option>

        <option>Plumbing</option>

        <option>IT</option>

        <option>General Maintenance</option>
      </select>
    </div>
  );
}

export default SearchBar;
