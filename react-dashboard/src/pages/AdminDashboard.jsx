import React, { useState } from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import DashboardCards from "../components/DashboardCards";
import SearchBar from "../components/SearchBar";
import ComplaintTable from "../components/ComplaintTable";
import SearchPage from "./SearchPage";

function AdminDashboard() {
  const [activePage, setActivePage] = useState("dashboard");

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
          <h2>Reports</h2>

          <p>Reports and Analytics will appear here.</p>

          <p>Total Complaints: 52</p>

          <p>Resolved: 14</p>

          <p>Pending: 18</p>

          <p>In Progress: 20</p>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
