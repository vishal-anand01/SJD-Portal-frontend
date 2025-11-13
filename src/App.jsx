// Path: frontend/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout, PublicNavbar, PublicFooter } from "./components/layout";
import Home from "./modules/public/pages/Home";
import Login from "./modules/auth/Login";
import AdminDashboard from "./modules/admin/pages/Dashboard";
import "./index.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public layout pages */}
        <Route element={<><PublicNavbar /><div style={{minHeight:"70vh"}}><OutletPlaceholder /></div><PublicFooter/></>}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {/* track etc can be added */}
        </Route>

        {/* Dashboard protected routes */}
        <Route path="/admin" element={<DashboardLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          {/* other admin routes */}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

// small placeholder to avoid importing Outlet in top-level public wrapper (keeps snippet self-contained)
const OutletPlaceholder = ({children}) => (children ? children : null);

export default App;
