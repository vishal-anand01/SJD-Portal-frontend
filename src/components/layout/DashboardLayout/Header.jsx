import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import axios from "../../../api/axiosConfig";

export default function Header({ collapsed, setCollapsed, setMobileOpen }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const drawerWidth = 260;
  const collapsedWidth = 80;
  const [snackOpen, setSnackOpen] = useState(false);

  const backendBase =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/uploads";

  const toggleCollapse = () => setCollapsed(!collapsed);
  const toggleMobile = () => setMobileOpen(true);

  /* 🔗 Dynamic Profile Navigation */
  const handleProfileClick = () => {
    if (!user?.role) return navigate("/login");

    switch (user.role.toLowerCase()) {
      case "dm":
        navigate("/dm/profile");
        break;
      case "officer":
        navigate("/officer/profile");
        break;
      case "department":
        navigate("/department/profile");
        break;
      default:
        navigate("/public/profile");
    }
  };

  /* 🚪 Logout Function */
  const handleLogout = () => {
    try {
      localStorage.removeItem("sjd_token");
      localStorage.removeItem("sjd_user");
      sessionStorage.clear();
      delete axios.defaults.headers.common["Authorization"];

      setSnackOpen(true);

      setTimeout(() => {
        navigate("/login", { replace: true });
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  /* 🧩 Prepare Avatar Source */
  const userInitial =
    user?.firstName?.[0]?.toUpperCase() ||
    user?.name?.[0]?.toUpperCase() ||
    "U";

  const photoUrl = user?.photo ? `${backendBase}/${user.photo}` : null;

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: "#ffffff",
          color: "#1e3a8a",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          transition: "all 0.3s ease",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          left: { xs: 0, lg: collapsed ? collapsedWidth : drawerWidth },
          width: {
            xs: "100%",
            lg: `calc(100% - ${collapsed ? collapsedWidth : drawerWidth}px)`,
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: 2,
            minHeight: "72px",
          }}
        >
          {/* ===== LEFT SECTION ===== */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Mobile Menu */}
            <IconButton
              onClick={toggleMobile}
              sx={{
                display: { xs: "inline-flex", lg: "none" },
                color: "#1e3a8a",
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Collapse Toggle */}
            <IconButton
              onClick={toggleCollapse}
              sx={{
                display: { xs: "none", lg: "inline-flex" },
                color: "#1e3a8a",
                transform: collapsed ? "rotate(180deg)" : "rotate(0)",
                transition: "transform 0.4s ease",
              }}
            >
              <DashboardCustomizeIcon sx={{ fontSize: 28 }} />
            </IconButton>

            {/* Welcome Text */}
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Welcome,{" "}
              <Box component="span" sx={{ color: "#f59e0b" }}>
                {user?.firstName || user?.name || "User"}
              </Box>
            </Typography>
          </Box>

          {/* ===== RIGHT SECTION ===== */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* 🔔 Notifications */}
            <Tooltip title="Notifications">
              <IconButton sx={{ color: "#1e3a8a" }}>
                <NotificationsIcon />
              </IconButton>
            </Tooltip>

            {/* ⚙️ Settings */}
            <Tooltip title="Settings">
              <IconButton sx={{ color: "#1e3a8a" }}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>

            {/* 👤 Profile Avatar */}
            <Tooltip
              title={
                user?.role
                  ? `${user.firstName || user.name} (${user.role})`
                  : "Profile"
              }
            >
              <Avatar
                src={photoUrl || undefined}
                alt={user?.firstName || "User"}
                onClick={handleProfileClick}
                sx={{
                  bgcolor: photoUrl ? "transparent" : "#1e3a8a",
                  color: photoUrl ? "transparent" : "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  width: 42,
                  height: 42,
                  "&:hover": { transform: "scale(1.05)" },
                  border: "2px solid #e2e8f0",
                }}
              >
                {!photoUrl && userInitial}
              </Avatar>
            </Tooltip>

            {/* 🚪 Logout */}
            <Tooltip title="Logout">
              <IconButton
                onClick={handleLogout}
                sx={{
                  color: "#ef4444",
                  "&:hover": { bgcolor: "rgba(239,68,68,0.1)" },
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ✅ Snackbar for Logout */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={1000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity="success"
          sx={{
            bgcolor: "#ecfdf5",
            color: "#065f46",
            fontWeight: 600,
            border: "1px solid #6ee7b7",
          }}
        >
          You’ve been logged out successfully
        </Alert>
      </Snackbar>
    </>
  );
}
