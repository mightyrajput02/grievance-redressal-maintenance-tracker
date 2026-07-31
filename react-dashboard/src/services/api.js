const API_BASE_URL = "http://127.0.0.1:8000/api";

export const fetchComplaints = async (params = {}) => {
  const url = new URL(`${API_BASE_URL}/complaints`);
  if (params.student_id) url.searchParams.append("student_id", params.student_id);
  if (params.search) url.searchParams.append("search", params.search);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch complaints");
  return await res.json();
};

export const createComplaint = async (complaintData) => {
  const res = await fetch(`${API_BASE_URL}/complaints`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(complaintData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to create complaint");
  }
  return await res.json();
};

export const updateComplaint = async (id, updateData) => {
  const res = await fetch(`${API_BASE_URL}/complaints/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update complaint");
  }
  return await res.json();
};

export const deleteComplaint = async (id) => {
  const res = await fetch(`${API_BASE_URL}/complaints/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to delete complaint");
  }
  return await res.json();
};

export const fetchStats = async () => {
  const res = await fetch(`${API_BASE_URL}/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return await res.json();
};

export const submitFeedback = async (feedbackData) => {
  const res = await fetch(`${API_BASE_URL}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(feedbackData),
  });
  if (!res.ok) throw new Error("Failed to submit feedback");
  return await res.json();
};

export const fetchFeedback = async () => {
  const res = await fetch(`${API_BASE_URL}/feedback`);
  if (!res.ok) throw new Error("Failed to fetch feedback");
  return await res.json();
};
