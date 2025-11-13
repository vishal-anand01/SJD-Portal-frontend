import React from "react";
import { Outlet } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout/DashboardLayout";
import useAuth from "../hooks/useAuth";

export default function RoleBasedLayout() {
  const { user } = useAuth();

  return (
    <DashboardLayout role={user?.role || "public"}>
      <Outlet />
    </DashboardLayout>
  );
}
