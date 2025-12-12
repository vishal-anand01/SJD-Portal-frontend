import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  MenuItem,
  CircularProgress,
  Menu,
  MenuItem as MUIMenuItem,
  Avatar,
  Stack,
  Tooltip,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import axios from "../../../api/axiosConfig";

// Dialog components (should live in ../components/ folder)
import ViewComplaintDialog from "../components/ViewComplaintDialog";
import UpdateComplaintDialog from "../components/UpdateComplaintDialog";
import ForwardComplaintDialog from "../components/ForwardComplaintDialog";

export default function AssignedComplaints() {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));

  const [complaints, setComplaints] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Dialog controls
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openForward, setOpenForward] = useState(false);

  // Menu controls
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuComplaint, setMenuComplaint] = useState(null);
  const openMenu = Boolean(anchorEl);

  const baseURL = import.meta.env.VITE_API_URL || "";

  // Load complaints
  const loadComplaints = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/department/assigned");
      if (res?.data?.complaints) {
        setComplaints(res.data.complaints);
        setFiltered(res.data.complaints);
      } else {
        setComplaints([]);
        setFiltered([]);
      }
    } catch (err) {
      console.error("Error loading assigned complaints:", err);
      setError(
        err?.response?.data?.message ||
          "Failed to load complaints — check server"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  // Filters
  useEffect(() => {
    let list = complaints || [];

    if (search.trim() !== "") {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          (c.title || "").toLowerCase().includes(q) ||
          (c.trackingId || "").toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "") {
      list = list.filter((c) => c.status === statusFilter);
    }

    setFiltered(list);
  }, [search, statusFilter, complaints]);

  const statusColor = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "In Progress":
        return "info";
      case "Resolved":
        return "success";
      case "Rejected":
        return "error";
      case "Forwarded":
        return "secondary";
      default:
        return "default";
    }
  };

  const handleMenuClick = (event, complaint) => {
    setAnchorEl(event.currentTarget);
    setMenuComplaint(complaint);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuComplaint(null);
  };

  // Helper to render citizen name
  const renderCitizen = (c) => {
    // Officer or Public -> BOTH use citizenName first
    if (c.citizenName && c.citizenName.trim() !== "") {
      return c.citizenName;
    }

    // If somehow officer/public took from user profile
    if (c.citizen) {
      const fn = c.citizen.firstName || "";
      const ln = c.citizen.lastName || "";
      const full = `${fn} ${ln}`.trim();
      if (full) return full;
    }

    return "Unknown Citizen";
  };

  // Helper to render last forward info
  const renderLastForwardBy = (c) => {
    const last = c.forwards?.length ? c.forwards[c.forwards.length - 1] : null;
    if (!last) return "—";
    // If populated forwardedBy
    if (last.forwardedBy) {
      const fn = last.forwardedBy.firstName || "";
      const ln = last.forwardedBy.lastName || "";
      return `${fn} ${ln}`.trim() || "System";
    }
    return "System";
  };

  // Empty / error state UI
  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <div className="row align-items-center g-3">
          {/* LEFT SIDE TEXT */}
          <div className="col-12 col-md-6">
            <Typography
              variant={mdUp ? "h4" : "h5"}
              sx={{ fontWeight: 800, color: "#0f172a" }}
            >
              Assigned Complaints
            </Typography>

            <Typography variant="body2" sx={{ color: "#475569" }}>
              View and manage complaints forwarded to your department
            </Typography>
          </div>

          {/* RIGHT SIDE FILTERS */}
          <div className="col-12 col-md-6 d-flex justify-content-md-end align-items-center gap-2 flex-wrap">
            <TextField
              size="small"
              placeholder="Search title or tracking id"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <TextField
              size="small"
              select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Resolved">Resolved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
              <MenuItem value="Forwarded">Forwarded</MenuItem>
            </TextField>

            <Button size="small" variant="outlined" onClick={loadComplaints}>
              Refresh
            </Button>
          </div>
        </div>
      </Box>

      {/* Error or empty */}
      {error && (
        <Paper sx={{ p: 2, mb: 2, background: "#fff4f4" }} elevation={0}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      {!error && filtered.length === 0 && (
        <Paper sx={{ p: 6, textAlign: "center" }} elevation={0}>
          <Typography variant="h6" sx={{ color: "#94a3b8" }}>
            No complaints found for your department.
          </Typography>
          <Typography variant="body2" sx={{ color: "#94a3b8", mt: 1 }}>
            Try changing filters or press Refresh.
          </Typography>
        </Paper>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <Paper elevation={3} sx={{ overflow: "hidden", borderRadius: 2 }}>
          <TableContainer
            sx={{ background: "linear-gradient(90deg,#eef2ff,#f0f9ff)" }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    background: "linear-gradient(90deg,#1e3a8a,#2563eb)",
                    color: "white",
                  }}
                >
                  <TableCell sx={{ color: "white", fontWeight: 700 }}>
                    #
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700 }}>
                    Tracking ID
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700 }}>
                    Title
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700 }}>
                    Citizen
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700 }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700 }}>
                    Forwarded By
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700 }}>
                    Date
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 700 }}
                    align="center"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filtered.map((c, i) => {
                  const lastForward = c.forwards?.length
                    ? c.forwards[c.forwards.length - 1]
                    : null;

                  return (
                    <TableRow
                      key={c._id}
                      hover
                      sx={{ td: { verticalAlign: "middle" } }}
                    >
                      <TableCell>{i + 1}</TableCell>

                      <TableCell
                        sx={{
                          maxWidth: { xs: 120, md: 300 },
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c.trackingId}
                      </TableCell>

                      <TableCell
                        sx={{
                          maxWidth: { xs: 120, md: 300 },
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Tooltip title={c.title}>{c.title}</Tooltip>
                      </TableCell>

                      <TableCell
                        sx={{
                          maxWidth: { xs: 120, md: 300 },
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Tooltip>{renderCitizen(c)}</Tooltip>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={c.status}
                          size="small"
                          color={statusColor(c.status)}
                        />
                      </TableCell>

                      <TableCell sx={{
                          maxWidth: { xs: 120, md: 300 },
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}>
                        {renderLastForwardBy(c)}
                      </TableCell>

                      <TableCell sx={{
                          maxWidth: { xs: 120, md: 300 },
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}>
                        
                          {new Date(c.createdAt).toLocaleString()}
                       
                      </TableCell>

                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuClick(e, c)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Menu */}
      <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
        <MUIMenuItem
          onClick={() => {
            setSelectedComplaint(menuComplaint);
            setOpenView(true);
            handleMenuClose();
          }}
        >
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} /> View
        </MUIMenuItem>

        <MUIMenuItem
          onClick={() => {
            setSelectedComplaint(menuComplaint);
            setOpenUpdate(true);
            handleMenuClose();
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Update
        </MUIMenuItem>

        <MUIMenuItem
          onClick={() => {
            setSelectedComplaint(menuComplaint);
            setOpenForward(true);
            handleMenuClose();
          }}
        >
          <ForwardToInboxIcon fontSize="small" sx={{ mr: 1 }} /> Forward
        </MUIMenuItem>
      </Menu>

      {/* Dialogs (lazy-opened) */}
      {openView && (
        <ViewComplaintDialog
          open={openView}
          complaint={selectedComplaint}
          baseURL={baseURL}
          onClose={() => setOpenView(false)}
        />
      )}

      {openUpdate && (
        <UpdateComplaintDialog
          open={openUpdate}
          complaint={selectedComplaint}
          onClose={() => setOpenUpdate(false)}
          refreshComplaints={loadComplaints}
        />
      )}

      {openForward && (
        <ForwardComplaintDialog
          open={openForward}
          complaint={selectedComplaint}
          onClose={() => setOpenForward(false)}
          refreshComplaints={loadComplaints}
        />
      )}
    </Box>
  );
}
