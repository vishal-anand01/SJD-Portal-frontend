import React from "react";
import {
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  IconButton,
  Avatar,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

// 📦 ICONS
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ReportIcon from "@mui/icons-material/Report";
import GroupIcon from "@mui/icons-material/Group";
import SettingsIcon from "@mui/icons-material/Settings";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// 🧑‍⚖️ DM Icons
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TimelineIcon from "@mui/icons-material/Timeline";
import AssessmentIcon from "@mui/icons-material/Assessment";

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  role = "public",
}) {
  const location = useLocation();
  const drawerWidth = 260;
  const collapsedWidth = 80;

  // 🌍 PUBLIC MENU
  const publicMenu = [
    { label: "Dashboard", path: "/public/dashboard", icon: <DashboardIcon /> },
    { label: "Profile", path: "/public/profile", icon: <AccountCircleIcon /> },
    {
      label: "Add Complaints",
      path: "/public/complaints/add",
      icon: <AssignmentIcon />,
    },
    {
      label: "My Complaints",
      path: "/public/complaints",
      icon: <AssignmentIcon />,
    },
    {
      label: "Track Status",
      path: "/public/track-status",
      icon: <TrackChangesIcon />,
    },
  ];

  // 👮 OFFICER MENU
  const officerMenu = [
    { label: "Dashboard", path: "/officer/dashboard", icon: <DashboardIcon /> },
    { label: "Profile", path: "/officer/profile", icon: <AccountCircleIcon /> },
    {
      label: "Add Complaint",
      path: "/officer/add-complaint",
      icon: <AssignmentIcon />,
    },
    { label: "Complaints", path: "/officer/complaints", icon: <ListAltIcon /> },
    { label: "My Assignments", path: "/officer/assignments", icon: <AssignmentTurnedInIcon /> },

  ];

  // 🧑‍⚖️ DM MENU (District Magistrate)
  const dmMenu = [
    { label: "Dashboard", path: "/dm/dashboard", icon: <DashboardIcon /> },
    { label: "Profile", path: "/dm/profile", icon: <AccountCircleIcon /> },
    { label: "Officers", path: "/dm/officers", icon: <GroupIcon /> },
    { label: "Assign Officer", path: "/dm/assign", icon: <AssignmentIcon /> },
    {
      label: "Assigned Visits",
      path: "/dm/assigned-visits",
      icon: <AssignmentTurnedInIcon />,
    },
    {
      label: "Complaints",
      path: "/dm/complaints",
      icon: <ReportProblemIcon />,
    },
    {
      label: "Track Status",
      path: "/dm/track-status",
      icon: <TrackChangesIcon />,
    },
  ];

  // 🏢 DEPARTMENT MENU
  const departmentMenu = [
    {
      label: "Dashboard",
      path: "/department/dashboard",
      icon: <DashboardIcon />,
    },
    {
      label: "Assigned Complaints",
      path: "/department/assigned",
      icon: <AssignmentIcon />,
    },
    { label: "Reports", path: "/department/reports", icon: <ReportIcon /> },
    {
      label: "Update Status",
      path: "/department/update-status",
      icon: <TrackChangesIcon />,
    },
    {
      label: "Profile",
      path: "/department/profile",
      icon: <AccountCircleIcon />,
    },
  ];

  // 🧑‍💼 ADMIN MENU
  const adminMenu = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon /> },
    { label: "Manage Officers", path: "/admin/officers", icon: <GroupIcon /> },
    {
      label: "Create Visit",
      path: "/admin/create-visit",
      icon: <LocationOnIcon />,
    },
    { label: "Reports", path: "/admin/reports", icon: <ReportIcon /> },
    { label: "Settings", path: "/admin/settings", icon: <SettingsIcon /> },
  ];

  // 👑 SUPERADMIN MENU
  const superAdminMenu = [
    {
      label: "Dashboard",
      path: "/superadmin/dashboard",
      icon: <DashboardIcon />,
    },
    {
      label: "Manage Users",
      path: "/superadmin/manage-users",
      icon: <GroupIcon />,
    },
    {
      label: "Manage Departments",
      path: "/superadmin/manage-departments",
      icon: <AssignmentIcon />,
    },
    {
      label: "System Settings",
      path: "/superadmin/system-settings",
      icon: <SettingsIcon />,
    },
    { label: "Reports", path: "/superadmin/reports", icon: <ReportIcon /> },
  ];

  // 🎯 SELECT MENU BASED ON ROLE
  const menuItems =
    role === "officer"
      ? officerMenu
      : role === "department"
      ? departmentMenu
      : role === "admin"
      ? adminMenu
      : role === "superadmin"
      ? superAdminMenu
      : role === "DM" || role === "dm"
      ? dmMenu
      : publicMenu;

  // 🎨 Sidebar Content
  const drawerContent = (
    <Box
      sx={{
        width: collapsed ? collapsedWidth : drawerWidth,
        height: "100%",
        bgcolor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRight: "1px solid #e5e7eb",
        transition: "width 0.3s ease",
        overflowX: "hidden",
        boxShadow: "4px 0 12px rgba(0,0,0,0.05)",
      }}
    >
      {/* Header / Logo */}
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            px: 2,
            py: 2,
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          {!collapsed && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                src="/vite.svg"
                alt="logo"
                sx={{ width: 36, height: 36, bgcolor: "#1e3a8a" }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#1e3a8a",
                  letterSpacing: 0.5,
                }}
              >
                SJD{" "}
                <Box component="span" sx={{ color: "#f59e0b" }}>
                  Portal
                </Box>
              </Typography>
            </Box>
          )}
          <IconButton
            onClick={() => setCollapsed(!collapsed)}
            sx={{
              color: "#1e3a8a",
              transition: "transform 0.3s ease",
            }}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Box>

        {/* Menu Items */}
        <List sx={{ mt: 1 }}>
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Tooltip
                key={item.path}
                title={collapsed ? item.label : ""}
                placement="right"
              >
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={() => mobileOpen && setMobileOpen(false)}
                  sx={{
                    color: active ? "#1e3a8a" : "#475569",
                    borderRadius: "10px",
                    mx: 1,
                    mb: 0.5,
                    py: 1.3,
                    fontWeight: active ? 600 : 500,
                    background: active
                      ? "linear-gradient(90deg, rgba(30,58,138,0.1), rgba(30,58,138,0.05))"
                      : "transparent",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      background: "rgba(30,58,138,0.08)",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: active ? "#1e3a8a" : "#94a3b8",
                      minWidth: 40,
                      transition: "color 0.2s ease",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        sx: { fontSize: 15, fontWeight: active ? 600 : 500 },
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            );
          })}
        </List>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          px: collapsed ? 0 : 2,
          py: 2,
          borderTop: "1px solid #f1f5f9",
          textAlign: collapsed ? "center" : "left",
          transition: "all 0.3s ease",
          bgcolor: "#f9fafb",
        }}
      >
        {!collapsed && (
          <Typography
            variant="body2"
            sx={{ mb: 1, color: "#94a3b8", fontSize: 13 }}
          >
            © 2025 SJD Portal
          </Typography>
        )}
      </Box>
    </Box>
  );

  // 📱 Return both desktop and mobile versions
  return (
    <>
      {/* Desktop Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", lg: "block" },
          "& .MuiDrawer-paper": {
            width: collapsed ? collapsedWidth : drawerWidth,
            border: "none",
            background: "#ffffff",
            boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
            transition: "width 0.3s ease",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Mobile Sidebar */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            background: "#ffffff",
            boxShadow: "4px 0 12px rgba(0,0,0,0.1)",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
