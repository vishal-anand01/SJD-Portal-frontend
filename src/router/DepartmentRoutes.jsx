import React from "react";
import { Route } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout/DashboardLayout";

import {
  DepartmentDashboard,
  AssignedComplaints,
  TrackStatus,
  DepartmentProfile,
} from "../modules/department";

export const DepartmentRoutesConfig = [
  { path: "dashboard", element: <DepartmentDashboard /> },
  { path: "assigned-complaints", element: <AssignedComplaints /> },
  { path: "track-status", element: <TrackStatus /> },
  { path: "profile", element: <DepartmentProfile /> },
];

export default function DepartmentRoutes() {
  return (
    <Route element={<DashboardLayout role="department" />}>
      {DepartmentRoutesConfig.map((route, idx) => (
        <Route key={idx} path={route.path} element={route.element} />
      ))}
    </Route>
  );
}
