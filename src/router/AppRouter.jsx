import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PublicRoutes from "./PublicRoutes";
import AdminRoutes from "./AdminRoutes";
import DepartmentRoutes from "./DepartmentRoutes";
import { OfficerRoutesConfig } from "./OfficerRoutes";
import { DMRoutesConfig } from "./DMRoutes";
import SuperAdminRoutes from "./SuperAdminRoutes";
import ProtectedRoute from "./ProtectedRoute";
import RoleBasedLayout from "./RoleBasedLayout";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌍 Public Routes */}
        <Route path="/*" element={<PublicRoutes />} />

        {/* 👮 Officer */}
        <Route
          path="/officer"
          element={
            <ProtectedRoute allowed={["officer", "admin", "superadmin"]}>
              <RoleBasedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          {OfficerRoutesConfig.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Route>

        {/* 🏛️ DM */}
        <Route
          path="/dm"
          element={
            <ProtectedRoute allowed={["dm", "admin", "superadmin"]}>
              <RoleBasedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          {DMRoutesConfig.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Route>

        {/* 🧑‍💼 Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowed={["admin", "superadmin"]}>
              <RoleBasedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="*" element={<AdminRoutes />} />
        </Route>

        {/* 🏢 Department */}
        <Route
          path="/department"
          element={
            <ProtectedRoute allowed={["department", "admin", "superadmin"]}>
              <RoleBasedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="*" element={<DepartmentRoutes />} />
        </Route>

        {/* 👑 Super Admin */}
        <Route
          path="/superadmin"
          element={
            <ProtectedRoute allowed={["superadmin"]}>
              <RoleBasedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="*" element={<SuperAdminRoutes />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
