// src/modules/superadmin/pages/PublicManagement/PublicList.jsx
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

import ViewPublicDialog from "./dialogs/ViewPublicDialog";
import ConfirmDialog from "./dialogs/ConfirmDialog";

export default function PublicList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");

  const [viewUser, setViewUser] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // Pagination & filtering
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [districtFilter, setDistrictFilter] = useState("");
  const [sortField, setSortField] = useState("name"); // uses firstName+lastName
  const [sortOrder, setSortOrder] = useState("asc");

  const backendBase = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/uploads";

  const loadUsers = async () => {
    try {
      const { data } = await axios.get("/superadmin/public");
      // backend returns { success: true, users }
      const arr = data?.users ?? data ?? [];
      setUsers(Array.isArray(arr) ? arr : []);
    } catch (e) {
      console.error("Failed to load public users:", e);
      setUsers([]);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // unique district list for filter
  const districts = useMemo(() => {
    const s = new Set();
    if (Array.isArray(users)) {
      users.forEach((u) => {
        if (u?.district) s.add(u.district);
      });
    }
    return ["", ...Array.from(s).sort()];
  }, [users]);

  // filter + search + sort (immutable)
  const filtered = useMemo(() => {
    const q = (query || "").toLowerCase().trim();
    let list = Array.isArray(users) ? users : [];

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
      const getVal = (obj) =>
        sortField === "name"
          ? `${obj?.firstName || ""} ${obj?.lastName || ""}`.toLowerCase()
          : (obj?.[sortField] || "").toString().toLowerCase();
      const A = getVal(a);
      const B = getVal(b);
      if (A < B) return sortOrder === "asc" ? -1 : 1;
      if (A > B) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [query, users, districtFilter, sortField, sortOrder]);

  const visible = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const openActionMenu = (e, u) => {
    setAnchorEl(e.currentTarget);
    setSelectedUser(u);
  };

  const closeActionMenu = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleDelete = () => {
    if (!selectedUser) return;
    setConfirm({ open: true, id: selectedUser._id });
    closeActionMenu();
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/superadmin/public/${confirm.id}`);
      setUsers((prev) => (Array.isArray(prev) ? prev.filter((x) => x._id !== confirm.id) : []));
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
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Public Users</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Manage public users — view or remove</Typography>
              </Box>

              <Box sx={{ flex: 1 }} />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Button variant="contained" onClick={() => navigate("/superadmin/public/add")} startIcon={<AddIcon />} sx={{ textTransform: "none", borderRadius: 3 }}>
                   New
                </Button>
              </Stack>
            </Box>
          </Paper>
        </div>
      </div>

      {/* Controls Row */}
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
            <Table sx={{ minWidth: 800 }} aria-label="public-users-table">
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
                      <Typography variant="h6" sx={{ opacity: 0.7 }}>No public users found.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  visible.map((u, idx) => (
                    <TableRow key={u._id} hover sx={{ "&:hover": { bgcolor: "#fbfbff" } }}>
                      <TableCell>{page * rowsPerPage + idx + 1}</TableCell>

                      <TableCell>
                        <Avatar
                          src={u.photo ? `${backendBase}/${u.photo}` : ""}
                          alt={`${u.firstName || ""} ${u.lastName || ""}`}
                          sx={{ width: 56, height: 56, bgcolor: !u.photo ? "#7c3aed" : "transparent", fontSize: 18, fontWeight: 700 }}
                        >
                          {!u.photo && initials(u.firstName, u.lastName)}
                        </Avatar>
                      </TableCell>

                      <TableCell>
                        <Typography sx={{ fontWeight: 700 }}>{u.uniqueId || "—"}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography sx={{ fontWeight: 700 }}>{u.firstName} {u.lastName}</Typography>
                        <Typography variant="caption" sx={{ color: "gray" }}>{u.district || "—"}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography sx={{ fontWeight: 600 }}>{u.email || "—"}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography sx={{ fontWeight: 600 }}>{u.phone || "—"}</Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Tooltip title="Actions">
                          <IconButton onClick={(e) => openActionMenu(e, u)}>
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
        <MenuItem onClick={() => { setViewUser(selectedUser); closeActionMenu(); }}>View</MenuItem>
        <MenuItem onClick={() => { closeActionMenu(); window.location.href = `/superadmin/public/edit/${selectedUser?._id}`; }}>Edit</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "red" }}>Delete</MenuItem>
      </Menu>

      {/* Dialogs */}
      <ViewPublicDialog open={!!viewUser} user={viewUser} onClose={() => setViewUser(null)} />

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
