import React from "react";
import { Routes, Route } from "react-router-dom";
import DepartmentDashboard from "../modules/department/pages/Dashboard";
import AssignedComplaints from "../modules/department/pages/AssignedComplaints";
import UpdateStatus from "../modules/department/pages/UpdateStatus";

export default function DepartmentRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<DepartmentDashboard />} />
      <Route path="assigned" element={<AssignedComplaints />} />
      <Route path="update-status" element={<UpdateStatus />} />
    </Routes>
  );
}
