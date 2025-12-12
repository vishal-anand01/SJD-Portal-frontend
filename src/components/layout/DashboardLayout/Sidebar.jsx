// frontend/src/components/layout/Sidebar.jsx
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
  Popper,
  Paper,
  ClickAwayListener,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

import UpdateIcon from "@mui/icons-material/Update";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import ApartmentIcon from "@mui/icons-material/Apartment";
import BadgeIcon from "@mui/icons-material/Badge";

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
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

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

  // openMenu keeps track of which parent is currently open (expanded sidebar).
  const [openMenu, setOpenMenu] = React.useState({});

  // Popper state for collapsed sidebar submenus
  const [popperOpen, setPopperOpen] = React.useState(false);
  const [popperAnchor, setPopperAnchor] = React.useState(null);
  const [popperMenuLabel, setPopperMenuLabel] = React.useState(null);
  const popperTimeoutRef = React.useRef(null);

  // Toggle a parent menu. Opening one will close all others.
  const toggleMenu = (label) => {
    setOpenMenu((prev) => {
      const currentlyOpen = !!prev[label];
      // if currently open -> close it
      if (currentlyOpen) return {};
      // open this and close others
      return { [label]: true };
    });
  };

  // Close all open parents
  const closeAllMenus = () => setOpenMenu({});

  // Popper handlers (used only when collapsed)
  const openPopper = (label, event) => {
    // clear any pending close
    if (popperTimeoutRef.current) {
      clearTimeout(popperTimeoutRef.current);
      popperTimeoutRef.current = null;
    }
    setPopperAnchor(event.currentTarget);
    setPopperMenuLabel(label);
    setPopperOpen(true);
  };

  const scheduleClosePopper = () => {
    // small delay so mouse can move between anchor and popper
    if (popperTimeoutRef.current) clearTimeout(popperTimeoutRef.current);
    popperTimeoutRef.current = setTimeout(() => {
      setPopperOpen(false);
      setPopperAnchor(null);
      setPopperMenuLabel(null);
      popperTimeoutRef.current = null;
    }, 150);
  };

  const closePopperImmediately = () => {
    if (popperTimeoutRef.current) {
      clearTimeout(popperTimeoutRef.current);
      popperTimeoutRef.current = null;
    }
    setPopperOpen(false);
    setPopperAnchor(null);
    setPopperMenuLabel(null);
  };

  /* ---------------------------
     MENU DEFINITIONS
     Each child item may include icon (optional)
  ----------------------------*/

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
    {
      label: "Track Complaints",
      path: "/officer/track-status",
      icon: <TrackChangesIcon />,
    },
    {
      label: "My Assignments",
      path: "/officer/assignments",
      icon: <AssignmentTurnedInIcon />,
    },
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
      label: "Profile",
      path: "/department/profile",
      icon: <AccountCircleIcon />,
    },
    {
      label: "Assigned Complaints",
      path: "/department/assigned-complaints",
      icon: <AssignmentTurnedInIcon />,
    },
    {
      label: "Track Status",
      path: "/department/track-status",
      icon: <TrackChangesIcon />,
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

  // 👑 SUPERADMIN MENU (FINAL COMPLETE) - children include icons
  const superAdminMenu = [
    {
      label: "Dashboard",
      path: "/superadmin/dashboard",
      icon: <DashboardIcon />,
    },

    {
      label: "DM Management",
      icon: <SupervisorAccountIcon />,
      children: [
        { label: "DM List", path: "/superadmin/dm", icon: <ListAltIcon /> },
        { label: "Add DM", path: "/superadmin/dm/add", icon: <AssignmentIcon /> },
      ],
    },

    {
      label: "Department Management",
      icon: <ApartmentIcon />,
      children: [
        {
          label: "Department List",
          path: "/superadmin/departments",
          icon: <ListAltIcon />,
        },
        {
          label: "Add Department",
          path: "/superadmin/departments/add",
          icon: <AssignmentIcon />,
        },
      ],
    },

    {
      label: "Officer Management",
      icon: <BadgeIcon />,
      children: [
        { label: "Officer List", path: "/superadmin/officers", icon: <ListAltIcon /> },
        { label: "Add Officer", path: "/superadmin/officers/add", icon: <AssignmentIcon /> },
      ],
    },

    {
      label: "Public Users",
      icon: <GroupIcon />,
      children: [
        { label: "Public List", path: "/superadmin/public", icon: <ListAltIcon /> },
        { label: "Add Public User", path: "/superadmin/public/add", icon: <AssignmentIcon /> },
      ],
    },

    {
      label: "Complaints",
      icon: <ReportIcon />,
      children: [
        { label: "All Complaints", path: "/superadmin/complaints/all", icon: <ListAltIcon /> },
        { label: "Track Complaint", path: "/superadmin/complaints/track", icon: <TrackChangesIcon /> },
      ],
    },
  ];

  // choose menu based on role
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

  /* ---------------------------
     Helper: render tooltip content when collapsed
     We'll show a small list of child items (read-only) for preview
  ----------------------------*/
  const CollapsedTooltipContent = ({ item }) => {
    if (!item.children) {
      return <Typography sx={{ fontWeight: 600 }}>{item.label}</Typography>;
    }
    return (
      <Box sx={{ minWidth: 220 }}>
        <Typography sx={{ fontWeight: 700, mb: 1 }}>{item.label}</Typography>
        {item.children.map((c, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              py: 0.5,
            }}
          >
            {c.icon ? (
              <Box sx={{ display: "flex", alignItems: "center", minWidth: 26 }}>
                {c.icon}
              </Box>
            ) : (
              <FiberManualRecordIcon sx={{ fontSize: 10, color: "grey.600", minWidth: 26 }} />
            )}
            <Typography sx={{ fontSize: 14 }}>{c.label}</Typography>
          </Box>
        ))}
      </Box>
    );
  };

  /* ---------------------------
     Drawer content
  ----------------------------*/
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
          {menuItems.map((item, index) => {
            // active detection: strict equality for direct paths,
            // for parent we check startsWith so /superadmin/dm/edit/... still marks child active.
            const isActive =
              item.path && (location.pathname === item.path || location.pathname.startsWith(item.path + "/"));

            // decide whether to show tooltip: only when collapsed AND item has no children
            const showTooltip = collapsed && !item.children;

            // CASE 1: simple menu item (no children)
            if (!item.children) {
              return (
                <Tooltip
                  key={index}
                  title={showTooltip ? <CollapsedTooltipContent item={item} /> : null}
                  placement="right"
                  arrow
                  disableHoverListener={!showTooltip}
                >
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    onClick={() => {
                      // if dashboard clicked -> close all open menus
                      if (item.path && item.path.endsWith("/dashboard")) {
                        closeAllMenus();
                      }
                      if (mobileOpen) setMobileOpen(false);
                    }}
                    sx={{
                      color: isActive ? "#1e3a8a" : "#475569",
                      borderRadius: "10px",
                      mx: 1,
                      mb: 0.5,
                      py: 1.3,
                      fontWeight: isActive ? 600 : 500,
                      background: isActive
                        ? "linear-gradient(90deg, rgba(30,58,138,0.1), rgba(30,58,138,0.05))"
                        : "transparent",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        background: "rgba(30,58,138,0.06)",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive ? "#1e3a8a" : "#94a3b8",
                        minWidth: 40,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    {!collapsed && (
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          sx: { fontSize: 15, fontWeight: isActive ? 600 : 500 },
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              );
            }

            // CASE 2: parent menu with children (submenu)
            const menuOpen = !!openMenu[item.label];

            // For collapsed state: attach hover handlers to open popper
            const parentHandlers = collapsed
              ? {
                  onMouseEnter: (e) => openPopper(item.label, e),
                  onMouseLeave: () => scheduleClosePopper(),
                }
              : {
                  onClick: () => toggleMenu(item.label),
                };

            return (
              <Box key={index}>
                <Tooltip
                  key={`parent-tooltip-${index}`}
                  title={showTooltip ? <CollapsedTooltipContent item={item} /> : null}
                  placement="right"
                  arrow
                  disableHoverListener={!showTooltip}
                >
                  <ListItemButton
                    {...parentHandlers}
                    sx={{
                      mx: 1,
                      mb: 0.5,
                      borderRadius: "10px",
                      color: "#475569",
                      background: menuOpen
                        ? "linear-gradient(90deg, rgba(30,58,138,0.04), rgba(30,58,138,0.02))"
                        : "transparent",
                      "&:hover": { background: "rgba(30,58,138,0.06)" },
                      cursor: "pointer",
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: menuOpen ? "#1e3a8a" : "#94a3b8" }}>
                      {item.icon}
                    </ListItemIcon>

                    {!collapsed && (
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          sx: { fontSize: 15, fontWeight: menuOpen ? 700 : 500 },
                        }}
                      />
                    )}

                    {!collapsed && (
                      <ChevronRightIcon
                        sx={{
                          transform: menuOpen ? "rotate(90deg)" : "rotate(0deg)",
                          transition: "0.2s",
                          color: "#64748b",
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>

                {/* Submenu — rendered only when parent is open and sidebar not collapsed */}
                {menuOpen && !collapsed && (
                  <List sx={{ pl: 7, transition: "all 0.2s ease" }}>
                    {item.children.map((child, i) => {
                      const childActive =
                        child.path &&
                        (location.pathname === child.path || location.pathname.startsWith(child.path + "/"));

                      return (
                        <ListItemButton
                          key={i}
                          component={Link}
                          to={child.path}
                          onClick={() => {
                            // clicking a child should NOT close the parent menu (per requirement)
                            if (mobileOpen) setMobileOpen(false);
                            // do NOT collapse or close parent; only close when another parent clicked
                          }}
                          sx={{
                            mb: 0.5,
                            py: 1,
                            borderRadius: "10px",
                            color: childActive ? "#1e3a8a" : "#475569",
                            background: childActive ? "rgba(30,58,138,0.12)" : "transparent",
                            "&:hover": { background: "rgba(30,58,138,0.06)" },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36, color: childActive ? "#1e3a8a" : "#94a3b8" }}>
                            {child.icon || <FiberManualRecordIcon sx={{ fontSize: 12 }} />}
                          </ListItemIcon>

                          <ListItemText
                            primary={child.label}
                            primaryTypographyProps={{
                              sx: { fontSize: 14, fontWeight: childActive ? 700 : 500 },
                            }}
                          />
                        </ListItemButton>
                      );
                    })}
                  </List>
                )}

                {/* Collapsed: Popper showing clickable submenu */}
                {collapsed && (
                  <Popper
                    open={popperOpen && popperMenuLabel === item.label}
                    anchorEl={popperAnchor}
                    placement="right-start"
                    disablePortal={false}
                    style={{ zIndex: 1300 }}
                  >
                    <ClickAwayListener onClickAway={closePopperImmediately}>
                      <Paper
                        onMouseEnter={() => {
                          // keep open while hovering popper
                          if (popperTimeoutRef.current) {
                            clearTimeout(popperTimeoutRef.current);
                            popperTimeoutRef.current = null;
                          }
                          setPopperOpen(true);
                        }}
                        onMouseLeave={() => {
                          scheduleClosePopper();
                        }}
                        sx={{ minWidth: 200, boxShadow: "0 6px 18px rgba(15,23,42,0.12)" }}
                      >
                        <List>
                          <Box sx={{ px: 1, py: 0.5 }}>
                            <Typography sx={{ fontWeight: 500, fontSize: 13, color: "#475569", px: 1 }}>
                              {item.label}
                            </Typography>
                          </Box>
                          {item.children.map((child, i) => {
                            const childActive =
                              child.path &&
                              (location.pathname === child.path || location.pathname.startsWith(child.path + "/"));

                            return (
                              <ListItemButton
                                key={i}
                                component={Link}
                                to={child.path}
                                onClick={() => {
                                  // close popper after click
                                  closePopperImmediately();
                                  if (mobileOpen) setMobileOpen(false);
                                }}
                                sx={{
                                  mb: 0.2,
                                  py: 1,
                                  px: 2,
                                  borderRadius: "8px",
                                  color: childActive ? "#1e3a8a" : "#475569",
                                  background: childActive ? "rgba(30,58,138,0.06)" : "transparent",
                                  "&:hover": { background: "rgba(30,58,138,0.06)" },
                                }}
                              >
                                <ListItemIcon sx={{ minWidth: 36, color: childActive ? "#1e3a8a" : "#94a3b8" }}>
                                  {child.icon || <FiberManualRecordIcon sx={{ fontSize: 12 }} />}
                                </ListItemIcon>

                                <ListItemText
                                  primary={child.label}
                                  primaryTypographyProps={{
                                    sx: { fontSize: 14, fontWeight: childActive ? 700 : 500 },
                                  }}
                                />
                              </ListItemButton>
                            );
                          })}
                        </List>
                      </Paper>
                    </ClickAwayListener>
                  </Popper>
                )}
              </Box>
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
          <Typography variant="body2" sx={{ mb: 1, color: "#94a3b8", fontSize: 13 }}>
            © {new Date().getFullYear()} SJD Portal
          </Typography>
        )}
      </Box>
    </Box>
  );

  // Desktop + Mobile drawers
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
