// Path: frontend/src/components/layout/DashboardLayout/MenuConfig.js
import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import MapIcon from "@mui/icons-material/Map";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

const MenuConfig = [
  {
    title: "MAIN",
    items: [
      { path: "/admin/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
      { path: "/admin/complaints", label: "Complaints", icon: <DescriptionIcon /> },
      { path: "/admin/map-monitor", label: "Map Monitor", icon: <MapIcon /> },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { path: "/admin/officers", label: "Officers", icon: <PeopleIcon /> },
      { path: "/admin/reports", label: "Reports", icon: <DescriptionIcon /> },
      { path: "/admin/settings", label: "Settings", icon: <SettingsIcon /> },
    ],
  },
  {
    title: "TOOLS",
    items: [
      { path: "/notifications", label: "Notifications", icon: <NotificationsActiveIcon /> },
    ],
  },
];

export default MenuConfig;
    