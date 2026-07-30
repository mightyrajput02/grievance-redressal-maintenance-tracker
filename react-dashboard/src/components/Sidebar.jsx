import React from "react";
import {
  FaTachometerAlt,
  FaClipboardList,
  FaSearch,
  FaChartBar,
  FaSignOutAlt,
} from "react-icons/fa";

import "../css/Sidebar.css";

function Sidebar({ activePage, setActivePage }) {
  return (
    <div className="sidebar">
      <h2 className="logo">Grievance Tracker</h2>

      <ul>
        <li
          className={activePage === "dashboard" ? "active" : ""}
          onClick={() => setActivePage("dashboard")}
        >
          <FaTachometerAlt className="icon" />
          Dashboard
        </li>

        <li
          className={activePage === "complaints" ? "active" : ""}
          onClick={() => setActivePage("complaints")}
        >
          <FaClipboardList className="icon" />
          Complaints
        </li>

        <li
          className={activePage === "search" ? "active" : ""}
          onClick={() => setActivePage("search")}
        >
          <FaSearch className="icon" />
          Search
        </li>

        <li
          className={activePage === "reports" ? "active" : ""}
          onClick={() => setActivePage("reports")}
        >
          <FaChartBar className="icon" />
          Reports
        </li>
      </ul>

      <button
        className="logout-btn"
        onClick={() =>
          (window.location.href = "http://localhost:5500/frontend/index.html")
        }
      >
        <FaSignOutAlt />
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
