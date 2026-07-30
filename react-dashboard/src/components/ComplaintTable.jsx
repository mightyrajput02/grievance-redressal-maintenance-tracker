import React from "react";
import "../css/Table.css";

function ComplaintTable() {
  const complaints = [
    {
      id: 1,
      student: "22BCS001",
      title: "Fan not working",
      category: "Electrical",
      priority: "High",
      status: "Pending",
      staff: "Ravi",
    },

    {
      id: 2,
      student: "22BCS014",
      title: "Water leakage",
      category: "Plumbing",
      priority: "Medium",
      status: "In Progress",
      staff: "Kiran",
    },

    {
      id: 3,
      student: "22BCS029",
      title: "WiFi Issue",
      category: "IT",
      priority: "Low",
      status: "Resolved",
      staff: "Arjun",
    },
  ];

  return (
    <div className="table-container">
      <h2>Complaint Management</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>

            <th>Student</th>

            <th>Title</th>

            <th>Category</th>

            <th>Priority</th>

            <th>Status</th>

            <th>Staff</th>

            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {complaints.map((complaint) => (
            <tr key={complaint.id}>
              <td>{complaint.id}</td>

              <td>{complaint.student}</td>

              <td>{complaint.title}</td>

              <td>{complaint.category}</td>

              <td>{complaint.priority}</td>

              <td>{complaint.status}</td>

              <td>{complaint.staff}</td>

              <td>
                <button className="edit-btn">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ComplaintTable;
