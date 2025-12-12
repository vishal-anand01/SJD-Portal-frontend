// src/modules/superadmin/pages/DepartmentManagement/DepartmentList.jsx
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
  MenuItem, // used for action menu
  Tooltip,
  Typography,
  Stack,
  TableFooter,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectMenuItem, // used for Select options
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

import ViewDepartmentDialog from "./dialogs/ViewDepartmentDialog";
import ConfirmDialog from "./dialogs/ConfirmDialog";

export default function DepartmentList() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [query, setQuery] = useState("");

  const [viewDept, setViewDept] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);

  // Pagination & filtering
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [districtFilter, setDistrictFilter] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const backendBase = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/uploads";

  const loadDepartments = async () => {
    try {
      const { data } = await axios.get("/superadmin/departments/users");
      // backend returns: { success: true, departmentUsers }
      const arr = data?.departmentUsers ?? data?.departments ?? data ?? [];
      setDepartments(Array.isArray(arr) ? arr : []);
    } catch (e) {
      console.error("Failed to load departments:", e);
      setDepartments([]);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  // unique district list for filter
  const districts = useMemo(() => {
    const s = new Set();
    if (Array.isArray(departments)) {
      departments.forEach((d) => {
        if (d?.district) s.add(d.district);
      });
    }
    return ["", ...Array.from(s).sort()];
  }, [departments]);

  // filter + search + sort (immutable)
  const filtered = useMemo(() => {
    const q = (query || "").toLowerCase().trim();
    let list = Array.isArray(departments) ? departments : [];

    if (q) {
      list = list.filter(
        (x) =>
          (`${x?.name || ""}`.toLowerCase().includes(q)) ||
          (`${x?.uniqueId || x?.code || ""}`.toLowerCase().includes(q)) || // check uniqueId or code
          (`${x?.email || ""}`.toLowerCase().includes(q)) ||
          (`${x?.phone || ""}`.toLowerCase().includes(q))
      );
    }

    if (districtFilter) {
      list = list.filter((x) => x?.district === districtFilter);
    }

    list = [...list].sort((a, b) => {
      const getVal = (obj) => {
        if (sortField === "name") return (obj?.name || "").toString().toLowerCase();
        return (obj?.[sortField] || "").toString().toLowerCase();
      };
      const A = getVal(a);
      const B = getVal(b);
      if (A < B) return sortOrder === "asc" ? -1 : 1;
      if (A > B) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [query, departments, districtFilter, sortField, sortOrder]);

  const visible = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const openActionMenu = (e, dept) => {
    setAnchorEl(e.currentTarget);
    setSelectedDept(dept);
  };

  const closeActionMenu = () => {
    setAnchorEl(null);
    setSelectedDept(null);
  };

  const handleDelete = () => {
    if (!selectedDept) return;
    setConfirm({ open: true, id: selectedDept._id });
    closeActionMenu();
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/superadmin/departments/users/${confirm.id}`);
      setDepartments((prev) => (Array.isArray(prev) ? prev.filter((d) => d._id !== confirm.id) : []));
      setConfirm({ open: false, id: null });
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  const initials = (name = "") => `${(name || "").charAt(0) || ""}`.toUpperCase();

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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                background: "linear-gradient(90deg,#0ea5e9 0%, #6366f1 100%)",
                color: "white",
              }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Department Management
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Manage Departments — view, edit, or remove
                </Typography>
              </Box>

              <Box sx={{ flex: 1 }} />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Button
                  type="button"
                  variant="contained"
                  onClick={() => navigate("/superadmin/departments/add")}
                  startIcon={<AddIcon />}
                  sx={{ textTransform: "none", borderRadius: 3 }}
                >
                  + New
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
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(0);
                }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: "action.disabled" }} />,
                }}
              />

              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>District</InputLabel>
                <Select
                  label="District"
                  value={districtFilter}
                  onChange={(e) => {
                    setDistrictFilter(e.target.value);
                    setPage(0);
                  }}
                >
                  <SelectMenuItem value="">All</SelectMenuItem>
                  {districts.map((d, i) => (d ? <SelectMenuItem key={i} value={d}>{d}</SelectMenuItem> : null))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Rows</InputLabel>
                <Select
                  label="Rows"
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                >
                  {[5, 10, 25, 50].map((v) => (
                    <SelectMenuItem key={v} value={v}>{v}</SelectMenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                onClick={() => toggleSort("name")}
                sx={{ textTransform: "none", minWidth: 140 }}
              >
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
            <Table sx={{ minWidth: 800 }} aria-label="department-table">
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
                      <Typography variant="h6" sx={{ opacity: 0.7 }}>No departments found.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  visible.map((dept, index) => (
                    <TableRow key={dept._id} hover sx={{ "&:hover": { bgcolor: "#fbfbff" } }}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>

                      <TableCell>
                        <Avatar
                          src={dept.photo ? `${backendBase}/${dept.photo}` : dept.logo ? `${backendBase}/${dept.logo}` : ""}
                          alt={dept.name || "Dept"}
                          sx={{ width: 56, height: 56, bgcolor: !dept.photo && !dept.logo ? "#7c3aed" : "transparent", fontSize: 18, fontWeight: 700 }}
                        >
                          {!dept.photo && !dept.logo && initials(dept.name)}
                        </Avatar>
                      </TableCell>

                      <TableCell>
                        <Typography sx={{ fontWeight: 700 }}>{dept.uniqueId || dept.code || "—"}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography sx={{ fontWeight: 700 }}>{dept.name}</Typography>
                        <Typography variant="caption" sx={{ color: "gray" }}>{dept.district || "—"}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography sx={{ fontWeight: 600 }}>{dept.email || "—"}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography sx={{ fontWeight: 600 }}>{dept.phone || "—"}</Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Tooltip title="Actions">
                          <IconButton onClick={(e) => openActionMenu(e, dept)}>
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
                  {/* IMPORTANT: Put TablePagination inside a TableCell so it renders inside a <td> */}
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
        <MenuItem onClick={() => { setViewDept(selectedDept); closeActionMenu(); }}>View</MenuItem>
        <MenuItem onClick={() => { closeActionMenu(); window.location.href = `/superadmin/departments/edit/${selectedDept?._id}`; }}>Edit</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "red" }}>Delete</MenuItem>
      </Menu>

      {/* Dialogs */}
      <ViewDepartmentDialog open={!!viewDept} department={viewDept} onClose={() => setViewDept(null)} />

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
