import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../modules/admin/pages/Dashboard";
import MapMonitor from "../modules/admin/pages/MapMonitor";
import OfficersList from "../modules/admin/pages/OfficersList";
import Reports from "../modules/admin/pages/Reports";
import Settings from "../modules/admin/pages/Settings";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="map-monitor" element={<MapMonitor />} />
      <Route path="officers" element={<OfficersList />} />
      <Route path="reports" element={<Reports />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  );
}
