// frontend/src/router/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ allowed = [], redirectTo = "/login", children }) {
  const { user } = useAuth(); // 🔹 Removed `loading` since loader not needed

  // If not logged in, redirect to login
  if (!user) return <Navigate to={redirectTo} replace />;

  // If user exists but no role (shouldn't happen, but safeguard)
  if (!user.role) return <Navigate to={redirectTo} replace />;

  // If user's role not in allowed list, redirect to home
  if (allowed.length && !allowed.includes(user.role)) {
    console.warn("Access denied for role:", user.role);
    return <Navigate to="/" replace />;
  }

  // ✅ Support both usage patterns
  // 1) <ProtectedRoute> <SomeLayout/> </ProtectedRoute>
  // 2) <Route element={<ProtectedRoute/>}> <Route .../> </Route>
  return children || <Outlet />;
}
