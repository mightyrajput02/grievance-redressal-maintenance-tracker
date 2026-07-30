import React from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import "../css/Topbar.css";

function Topbar() {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <h2>Welcome, Admin 👋</h2>
      </div>

      <div className="topbar-right">
        <FaBell className="top-icon" />

        <div className="admin-profile">
          <FaUserCircle className="profile-icon" />
          <span>Admin</span>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
