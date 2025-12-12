// src/modules/superadmin/pages/OfficerManagement/OfficerList.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../../api/axiosConfig";
import {
  Box,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  Stack,
  TableFooter,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectMenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

import ViewOfficerDialog from "./dialogs/ViewOfficerDialog";
import ConfirmDialog from "./dialogs/ConfirmDialog";

export default function OfficerList() {
  const navigate = useNavigate();
  const [officers, setOfficers] = useState([]);
  const [query, setQuery] = useState("");

  const [viewOfficer, setViewOfficer] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOfficer, setSelectedOfficer] = useState(null);

  // Pagination & filtering
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [districtFilter, setDistrictFilter] = useState("");
  const [sortField, setSortField] = useState("name"); // name will map to firstName+lastName
  const [sortOrder, setSortOrder] = useState("asc");

  const backendBase = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/uploads";

  const loadOfficers = async () => {
    try {
      const { data } = await axios.get("/superadmin/officers");
      // backend returns { success: true, officers }
      const arr = data?.officers ?? data ?? [];
      setOfficers(Array.isArray(arr) ? arr : []);
    } catch (e) {
      console.error("Failed to load officers:", e);
      setOfficers([]);
    }
  };

  useEffect(() => {
    loadOfficers();
  }, []);

  // unique district options
  const districts = useMemo(() => {
    const s = new Set();
    if (Array.isArray(officers)) {
      officers.forEach((o) => {
        if (o?.district) s.add(o.district);
      });
    }
    return ["", ...Array.from(s).sort()];
  }, [officers]);

  // search, filter, sort (immutable)
  const filtered = useMemo(() => {
    const q = (query || "").toLowerCase().trim();
    let list = Array.isArray(officers) ? officers : [];

    if (q) {
      list = list.filter((x) => {
        const fullName = `${x?.firstName || ""} ${x?.lastName || ""}`.toLowerCase();
        return (
          fullName.includes(q) ||
          (`${x?.email || ""}`.toLowerCase().includes(q)) ||
          (`${x?.uniqueId || ""}`.toLowerCase().includes(q)) ||
          (`${x?.phone || ""}`.toLowerCase().includes(q))
        );
      });
    }

    if (districtFilter) {
      list = list.filter((x) => x?.district === districtFilter);
    }

    list = [...list].sort((a, b) => {
      const getVal = (obj) => {
        if (sortField === "name") return `${obj?.firstName || ""} ${obj?.lastName || ""}`.toLowerCase();
        return (obj?.[sortField] || "").toString().toLowerCase();
      };
      const A = getVal(a);
      const B = getVal(b);
      if (A < B) return sortOrder === "asc" ? -1 : 1;
      if (A > B) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [query, officers, districtFilter, sortField, sortOrder]);

  const visible = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const openActionMenu = (e, officer) => {
    setAnchorEl(e.currentTarget);
    setSelectedOfficer(officer);
  };

  const closeActionMenu = () => {
    setAnchorEl(null);
    setSelectedOfficer(null);
  };

  const handleDelete = () => {
    if (!selectedOfficer) return;
    setConfirm({ open: true, id: selectedOfficer._id });
    closeActionMenu();
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/superadmin/officers/${confirm.id}`);
      setOfficers((prev) => (Array.isArray(prev) ? prev.filter((o) => o._id !== confirm.id) : []));
      setConfirm({ open: false, id: null });
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  const initials = (first = "", last = "") => `${(first || "").charAt(0)}${(last || "").charAt(0)}`.toUpperCase();

  // pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const toggleSort = (field = "name") => {
    if (sortField === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setPage(0);
  };

  return (
    <Box className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-3">
        <div className="col-12">
          <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, background: "linear-gradient(90deg,#0ea5e9 0%, #6366f1 100%)", color: "white" }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Officer Management</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Manage Officers — view, edit, or remove</Typography>
              </Box>

              <Box sx={{ flex: 1 }} />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Button variant="contained" onClick={() => navigate("/superadmin/officers/add")} startIcon={<AddIcon />} sx={{ textTransform: "none", borderRadius: 3 }}>
                  New
                </Button>
              </Stack>
            </Box>
          </Paper>
        </div>
      </div>

      {/* Controls */}
      <div className="row mb-3">
        <div className="col-12">
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
              <TextField
                fullWidth
                size="small"
                placeholder="Search by name, SJd ID, email or phone"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(0); }}
                InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: "action.disabled" }} /> }}
              />

              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>District</InputLabel>
                <Select label="District" value={districtFilter} onChange={(e) => { setDistrictFilter(e.target.value); setPage(0); }}>
                  <SelectMenuItem value="">All</SelectMenuItem>
                  {districts.map((d, i) => (d ? <SelectMenuItem key={i} value={d}>{d}</SelectMenuItem> : null))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Rows</InputLabel>
                <Select label="Rows" value={rowsPerPage} onChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}>
                  {[5, 10, 25, 50].map((v) => <SelectMenuItem key={v} value={v}>{v}</SelectMenuItem>)}
                </Select>
              </FormControl>

              <Button variant="outlined" onClick={() => toggleSort("name")} sx={{ textTransform: "none", minWidth: 140 }}>
                SORT: {sortOrder === "asc" ? "A→Z" : "Z→A"}
              </Button>
            </Stack>
          </Paper>
        </div>
      </div>

      {/* Table */}
      <div className="row">
        <div className="col-12">
          <TableContainer component={Paper} sx={{ borderRadius: 3, overflowX: "auto" }}>
            <Table sx={{ minWidth: 800 }} aria-label="officer-table">
              <TableHead>
                <TableRow sx={{ background: "linear-gradient(90deg, #f0f9ff, #eef2ff)" }}>
                  <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Photo</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>SJd ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 700, textAlign: "center" }}>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {visible.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: "center", py: 6 }}>
                      <Typography variant="h6" sx={{ opacity: 0.7 }}>No officers found.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  visible.map((officer, idx) => (
                    <TableRow key={officer._id} hover sx={{ "&:hover": { bgcolor: "#fbfbff" } }}>
                      <TableCell>{page * rowsPerPage + idx + 1}</TableCell>

                      <TableCell>
                        <Avatar
                          src={officer.photo ? `${backendBase}/${officer.photo}` : ""}
                          alt={`${officer.firstName || ""} ${officer.lastName || ""}`}
                          sx={{ width: 56, height: 56, bgcolor: !officer.photo ? "#7c3aed" : "transparent", fontSize: 18, fontWeight: 700 }}
                        >
                          {!officer.photo && initials(officer.firstName, officer.lastName)}
                        </Avatar>
                      </TableCell>

                      <TableCell>
                        <Typography sx={{ fontWeight: 700 }}>{officer.uniqueId || "—"}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography sx={{ fontWeight: 700 }}>{officer.firstName} {officer.lastName}</Typography>
                        <Typography variant="caption" sx={{ color: "gray" }}>{officer.district || "—"}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography sx={{ fontWeight: 600 }}>{officer.email || "—"}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography sx={{ fontWeight: 600 }}>{officer.phone || "—"}</Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Tooltip title="Actions">
                          <IconButton onClick={(e) => openActionMenu(e, officer)}>
                            <MoreVertIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TableCell colSpan={7}>
                    <TablePagination
                      component="div"
                      count={filtered.length}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      rowsPerPageOptions={[5, 10, 25, 50]}
                      labelRowsPerPage="Rows"
                      showFirstButton
                      showLastButton
                    />
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </div>
      </div>

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeActionMenu}>
        <MenuItem onClick={() => { setViewOfficer(selectedOfficer); closeActionMenu(); }}>View</MenuItem>
        <MenuItem onClick={() => { closeActionMenu(); window.location.href = `/superadmin/officers/edit/${selectedOfficer?._id}`; }}>Edit</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "red" }}>Delete</MenuItem>
      </Menu>

      {/* Dialogs */}
      <ViewOfficerDialog open={!!viewOfficer} officer={viewOfficer} onClose={() => setViewOfficer(null)} />

      <ConfirmDialog
        open={confirm.open}
        title="Confirm Delete?"
        message="This action cannot be undone."
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={confirmDelete}
      />
    </Box>
  );
}
