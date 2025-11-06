// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import Login from "./pages/Login";
// import DashboardLayout from "./layout/DashboardLayout";
// import Products from "./pages/Products";
// import AuditLogs from "./pages/AuditLogs";
// import RoleManagement from "./pages/RoleManagement";
// import Dashboard from "./pages/Dashboard";
// import { api } from "./api";

// export default function App() {
//   const [token, setToken] = useState(null);

//   // Load token on refresh
//   useEffect(() => {
//     const stored = localStorage.getItem("token");
//     if (stored) {
//       setToken(stored);
//       api.defaults.headers.common["Authorization"] = `Bearer ${stored}`;
//     }
//   }, []);

//   const handleLogin = (newToken) => {
//     // ✅ Remove any old token
//     localStorage.removeItem("token");

//     // ✅ Save new token
//     localStorage.setItem("token", newToken);
//     setToken(newToken);

//     // ✅ Apply to axios immediately
//     api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
//   };

//   const handleLogout = () => {
//     // ✅ Remove token everywhere
//     localStorage.removeItem("token");
//     delete api.defaults.headers.common["Authorization"];
//     setToken(null);
//   };

//   // If no token, show login page
//   if (!token) return <Login onLogin={handleLogin} />;

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route element={<DashboardLayout onLogout={handleLogout} />}>
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/products" element={<Products />} />
//           <Route path="/audit" element={<AuditLogs />} />
//           <Route path="/roles" element={<RoleManagement />} />
//           <Route path="*" element={<Navigate to="/dashboard" />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AuditLogs from "./pages/AuditLogs";
import RoleManagement from "./pages/RoleManagement";
import { api } from "./api";

export default function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (saved) {
      setToken(saved);
      api.defaults.headers.common["Authorization"] = `Bearer ${saved}`;
    }
  }, []);

  const handleLogin = (t) => {
    localStorage.setItem("token", t);
    api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
    setToken(t);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setToken(null);
  };

  if (!token) return <Login onLogin={handleLogin} />;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout onLogout={handleLogout} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/audit" element={<AuditLogs />} />
          <Route path="/roles" element={<RoleManagement />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
