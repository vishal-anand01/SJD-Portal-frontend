// frontend/src/router/OfficerRoutes.jsx
import React from "react";
import OfficerDashboard from "../modules/officer/pages/Dashboard";
import ComplaintList from "../modules/officer/pages/ComplaintList";
import ComplaintDetails from "../modules/officer/pages/ComplaintDetails";
import AddComplaint from "../modules/officer/pages/AddComplaint";
import MyVisits from "../modules/officer/pages/MyVisits";
import Profile from "../modules/officer/pages/Profile";
import MyAssignments from "../modules/officer/pages/MyAssignments.jsx";

export const OfficerRoutesConfig = [
  { path: "dashboard", element: <OfficerDashboard /> },
  { path: "add-complaint", element: <AddComplaint /> },
  { path: "complaints", element: <ComplaintList /> },
  { path: "complaints/:id", element: <ComplaintDetails /> },
  { path: "visits", element: <MyVisits /> },
  { path: "profile", element: <Profile /> },
  { path: "assignments", element: <MyAssignments /> },
];

export default function OfficerRoutes() {
  return null; // no nested <Routes> — handled via AppRouter
}
