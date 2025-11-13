// frontend/src/router/PublicRoutes.jsx
import React from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { PublicNavbar, PublicFooter } from "../components/layout";
import Home from "../modules/public/pages/Home";
import About from "../modules/public/pages/About";
import Contact from "../modules/public/pages/Contact";
import TrackComplaint from "../modules/public/pages/TrackComplaint";
import VisitSchedule from "../modules/public/pages/VisitSchedule";
import { Login, Register, ForgotPassword, ResetPassword } from "../modules/auth";
import DashboardLayout from "../components/layout/DashboardLayout/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import useAuth from "../hooks/useAuth";

import PublicDashboard from "../modules/public/Dashboard/Dashboard";
import MyComplaints from "../modules/public/Dashboard/MyComplaints";
import TrackStatus from "../modules/public/Dashboard/TrackStatus";
import Profile from "../modules/public/Dashboard/Profile";
import AddComplaint from "../modules/public/Dashboard/AddComplaint";

export default function PublicRoutes() {
  const { user } = useAuth(); // 🔹 Removed `loading` since loader not needed

  // 🧭 If user logged in but NOT public → redirect to their respective dashboard
  if (user && user.role !== "public") {
    switch (user.role) {
      case "officer":
        return <Navigate to="/officer/dashboard" replace />;
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "dm":
        return <Navigate to="/dm/dashboard" replace />;
      case "department":
        return <Navigate to="/department/dashboard" replace />;
      case "superadmin":
        return <Navigate to="/superadmin/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // 🏠 Public area
  return (
    <Routes>
      <Route
        element={
          <>
            <PublicNavbar />
            <div style={{ minHeight: "70vh" }}>
              <Outlet />
            </div>
            <PublicFooter />
          </>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/track" element={<TrackComplaint />} />
        <Route path="/visit-schedule" element={<VisitSchedule />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      {/* 🔒 Public user's dashboard */}
      <Route element={<ProtectedRoute allowed={["public"]} />}>
        <Route element={<DashboardLayout role="public" />}>
          <Route path="/public/dashboard" element={<PublicDashboard />} />
          <Route path="/public/profile" element={<Profile />} />
          <Route path="/public/complaints/add" element={<AddComplaint />} />
          <Route path="/public/complaints" element={<MyComplaints />} />
          <Route path="/public/track-status" element={<TrackStatus />} />
        </Route>
      </Route>
    </Routes>
  );
}
