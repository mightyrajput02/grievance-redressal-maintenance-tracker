import React from "react";
import "../css/Cards.css";

function DashboardCards() {
  const cards = [
    {
      title: "Total Complaints",
      count: 52,
    },
    {
      title: "Pending",
      count: 18,
    },
    {
      title: "In Progress",
      count: 20,
    },
    {
      title: "Resolved",
      count: 14,
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
