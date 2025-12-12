import React, { useEffect, useState } from "react";
import axios from "../../../api/axiosConfig";
import {
  Box,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
  TablePagination,
  Chip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ViewComplaintDialog from "../../officer/dialogs/ViewComplaintDialog";
import TrackComplaintDialog from "../models/TrackComplaintDialog";

export default function DMComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/dm/complaints");
      if (data.success) {
        setComplaints(data.complaints || []);
        setFiltered(data.complaints || []);
      } else {
        setComplaints([]);
      }
    } catch (error) {
      console.error("❌ Failed to fetch DM complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    let result = complaints;
    if (statusFilter !== "All") {
      result = complaints.filter((c) => c.status === statusFilter);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.title?.toLowerCase().includes(term) ||
          c.trackingId?.toLowerCase().includes(term) ||
          c.category?.toLowerCase().includes(term)
      );
    }
    setFiltered(result);
  }, [statusFilter, searchTerm, complaints]);

  const handleMenuOpen = (event, complaint) => {
    setAnchorEl(event.currentTarget);
    setSelectedComplaint(complaint);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleView = () => {
    setDialogOpen("view");
    handleMenuClose();
  };

  const handleCloseDialog = () => setDialogOpen(false);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const statusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "success";
      case "In Progress":
        return "info";
      case "Pending":
        return "warning";
      case "Rejected":
        return "error";
      case "Forwarded":
        return "secondary";
      default:
        return "default";
    }
  };

  const paginatedComplaints = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box p={3}>
      <Typography
        variant="h5"
        textAlign="center"
        fontWeight={700}
        color="primary"
        mb={3}
      >
        District Magistrate Complaint List
      </Typography>

      {/* Filter Bar */}
      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        justifyContent="space-between"
        mb={2}
      >
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {[
              "All",
              "Pending",
              "In Progress",
              "Resolved",
              "Forwarded",
              "Rejected",
            ].map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Search complaints..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 260 }}
        />
      </Box>

      {loading ? (
        <Box textAlign="center" py={6}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 3, boxShadow: "0 6px 20px rgba(0,0,0,0.1)" }}
          >
            <Table>
              <TableHead sx={{ bgcolor: "primary.main" }}>
                <TableRow>
                  {[
                    "#",
                    "Tracking ID",
                    "Citizen",
                    "Filed By",
                    "Title",
                    "Category",
                    "Location",
                    "Status",
                    "Date",
                    "Action",
                  ].map((head) => (
                    <TableCell
                      key={head}
                      sx={{ color: "white", fontWeight: 600 }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedComplaints.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      No complaints found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedComplaints.map((c, index) => (
                    <TableRow key={c._id} hover>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#1e40af",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setSelectedComplaint(c);
                          setDialogOpen("track");
                        }}
                      >
                        {c.trackingId}
                      </TableCell>

                      <TableCell>
                        {c.citizenName && c.citizenName.trim() !== ""
                          ? c.citizenName
                          : c.citizen
                          ? `${c.citizen.firstName || ""} ${
                              c.citizen.lastName || ""
                            }`.trim()
                          : "N/A"}
                      </TableCell>

                      <TableCell>
                        {c.filedBy
                          ? `${c.filedBy.firstName || ""} ${
                              c.filedBy.lastName || ""
                            }`.trim()
                          : c.sourceType === "Public"
                          ? "Self (Public)"
                          : "—"}
                      </TableCell>

                      <TableCell>{c.title}</TableCell>
                      <TableCell>{c.category}</TableCell>
                      <TableCell>{c.location || "N/A"}</TableCell>

                      <TableCell>
                        <Chip
                          label={c.status}
                          color={statusColor(c.status)}
                          variant="filled"
                          sx={{
                            fontWeight: 600,
                            textTransform: "capitalize",
                            minWidth: 110,
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        {new Date(c.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>

                      <TableCell>
                        <IconButton onClick={(e) => handleMenuOpen(e, c)}>
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[15, 20, 30, 40, 50]}
          />
        </>
      )}

      {/* Menu + Dialog */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleView}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} /> View Details
        </MenuItem>
      </Menu>

      {dialogOpen === "view" && selectedComplaint && (
        <ViewComplaintDialog
          open={true}
          complaint={selectedComplaint}
          onClose={handleCloseDialog}
          baseURL={baseURL}
        />
      )}

      {dialogOpen === "track" && selectedComplaint && (
        <TrackComplaintDialog
          open={true}
          onClose={handleCloseDialog}
          trackingId={selectedComplaint?.trackingId}
        />
      )}
    </Box>
  );
}
