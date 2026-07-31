import React, { useState, useEffect } from "react";
import { fetchStats } from "../services/api";
import "../css/Cards.css";

function DashboardCards() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    resolved: 0,
  });

  useEffect(() => {
    const getStats = async () => {
      try {
        const data = await fetchStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      }
    };
    getStats();
  }, []);

  const cards = [
    {
      title: "Total Complaints",
      count: stats.total,
    },
    {
      title: "Pending",
      count: stats.pending,
    },
    {
      title: "In Progress",
      count: stats.in_progress,
    },
    {
      title: "Resolved",
      count: stats.resolved,
    },
  ];

  return (
    <div className="cards-container">
      {cards.map((card, index) => (
        <div className="card" key={index}>
          <h3>{card.title}</h3>
          <h1>{card.count}</h1>
        </div>
      ))}
    </div>
  );
}

export default DashboardCards;
