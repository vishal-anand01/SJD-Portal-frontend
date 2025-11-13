import React from "react";
import { Routes, Route } from "react-router-dom";
import SuperAdminDashboard from "../modules/superadmin/pages/Dashboard";

export default function SuperAdminRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<SuperAdminDashboard />} />
    </Routes>
  );
}
