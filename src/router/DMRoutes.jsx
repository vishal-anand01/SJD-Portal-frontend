import React from "react";
import { Route } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout/DashboardLayout";

// ✅ Import all DM pages from single index barrel file
import {
  DMDashboard,
  AssignOfficer,
  OfficerList,
  AssignmentsList,
  VisitList,
  DMProfile,
  DMComplaintList,
  TrackStatus,
} from "../modules/dm";

/**
 * 🧭 DMRoutesConfig
 * All available DM routes mapped with their components
 */
export const DMRoutesConfig = [
  { path: "dashboard", element: <DMDashboard /> },
  { path: "assign", element: <AssignOfficer /> },
  { path: "officers", element: <OfficerList /> },
  { path: "assigned-visits", element: <AssignmentsList /> },
  { path: "visits", element: <VisitList /> },
  { path: "profile", element: <DMProfile /> },
  { path: "complaints", element: <DMComplaintList /> }, // ✅ Added route for DM Complaint List
  { path: "track-status", element: <TrackStatus /> },
];

/**
 * 🧱 DMRoutes
 * Injects all DM-specific routes inside DashboardLayout
 */
export default function DMRoutes() {
  return (
    <Route element={<DashboardLayout role="dm" />}>
      {DMRoutesConfig.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Route>
  );
}
