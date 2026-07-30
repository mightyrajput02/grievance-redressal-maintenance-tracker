import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function RootRedirect() {
  const portal = localStorage.getItem("portal");
  if (portal === "admin") {
    return <Navigate to="/admin" replace />;
  }
  return <Navigate to="/user" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
