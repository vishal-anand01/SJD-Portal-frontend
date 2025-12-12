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
  MenuItem as MuiMenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ViewUserDialog from "./dialogs/ViewUserDialog";
import ConfirmDialog from "./dialogs/ConfirmDialog";
import RoleDialog from "./dialogs/RoleDialog";
import { deepOrange } from "@mui/material/colors";


export default function DMListTable() {
  const navigate = useNavigate();
  const [dms, setDms] = useState([]);
  const [query, setQuery] = useState("");

  const [viewUser, setViewUser] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [roleDialog, setRoleDialog] = useState({ open: false, id: null });

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDM, setSelectedDM] = useState(null);

  // Pagination & filtering
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [districtFilter, setDistrictFilter] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const backendBase =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/uploads";

  const loadDMs = async () => {
    try {
      const { data } = await axios.get("/superadmin/dm");
      setDms(data.dms || []);
    } catch (e) {
      console.error("Failed to load DMs:", e);
    }
  };

  useEffect(() => {
    loadDMs();
  }, []);

  // unique district list for filter
  const districts = useMemo(() => {
    const set = new Set();
    dms.forEach((d) => {
      if (d.district) set.add(d.district);
    });
    return ["", ...Array.from(set).sort()];
  }, [dms]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    let list = !q
      ? dms
      : dms.filter(
          (x) =>
            `${x.firstName} ${x.lastName}`.toLowerCase().includes(q) ||
            (x.email || "").toLowerCase().includes(q) ||
            (x.uniqueId || "").toLowerCase().includes(q) ||
            (x.phone || "").toLowerCase().includes(q)
        );

    if (districtFilter) {
      list = list.filter((x) => x.district === districtFilter);
    }

    // IMPORTANT: don't mutate original array -> create a shallow copy and then sort
    list = [...list].sort((a, b) => {
      let A = "";
      let B = "";
      if (sortField === "name") {
        A = `${a.firstName || ""} ${a.lastName || ""}`.toLowerCase();
        B = `${b.firstName || ""} ${b.lastName || ""}`.toLowerCase();
      } else {
        A = (a[sortField] || "").toString().toLowerCase();
        B = (b[sortField] || "").toString().toLowerCase();
      }
      if (A < B) return sortOrder === "asc" ? -1 : 1;
      if (A > B) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [query, dms, districtFilter, sortField, sortOrder]);

  // pagination slice
  const visible = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const openActionMenu = (e, dm) => {
    setAnchorEl(e.currentTarget);
    setSelectedDM(dm);
  };

  const closeActionMenu = () => {
    setAnchorEl(null);
    setSelectedDM(null);
  };

  const handleDelete = () => {
    setConfirm({ open: true, id: selectedDM._id });
    closeActionMenu();
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/superadmin/dm/${confirm.id}`);
      setDms((prev) => prev.filter((dm) => dm._id !== confirm.id));
      setConfirm({ open: false, id: null });
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  const handleRole = () => {
    setRoleDialog({ open: true, id: selectedDM._id });
    closeActionMenu();
  };

  // Utility: initials for avatar
  const initials = (first = "", last = "") =>
    `${(first || "").charAt(0) || ""}${
      (last || "").charAt(0) || ""
    }`.toUpperCase();

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
                  DM Management
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Manage District Managers — view, edit, or remove
                </Typography>
              </Box>

              <Box sx={{ flex: 1 }} />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Button
                  type="button"
                  variant="contained"
                  onClick={() => navigate("/superadmin/dm/add")}
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

      {/* Controls Row (MUI full-width compact) */}
      <div className="row mb-3">
        <div className="col-12">
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems="center"
            >
              {/* Search */}
              <TextField
                fullWidth
                size="small"
                placeholder="Search by name, email, SJd ID or phone"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(0);
                }}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ mr: 1, color: "action.disabled" }} />
                  ),
                }}
              />

              {/* District filter */}
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
                  <MuiMenuItem value="">All</MuiMenuItem>
                  {districts.map((d, i) =>
                    d ? (
                      <MuiMenuItem key={i} value={d}>
                        {d}
                      </MuiMenuItem>
                    ) : null
                  )}
                </Select>
              </FormControl>

              {/* Rows per page */}
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
                    <MuiMenuItem key={v} value={v}>
                      {v}
                    </MuiMenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Sort toggle */}
              <Button
                variant="outlined"
                onClick={() => toggleSort("name")}
                sx={{ textTransform: "none", minWidth: 140 }}
              >
                SORT: {sortOrder === "asc" ? "A→Z" : "Z→A"}
              </Button>

              {/* note: refresh removed as requested */}
            </Stack>
          </Paper>
        </div>
      </div>

      {/* Table */}
      <div className="row">
        <div className="col-12">
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 3, overflowX: "auto" }}
          >
            <Table sx={{ minWidth: 800 }} aria-label="dm-table">
              <TableHead>
                <TableRow
                  sx={{
                    background: "linear-gradient(90deg, #f0f9ff, #eef2ff)",
                  }}
                >
                  <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Photo</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>SJd ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 700, textAlign: "center" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {visible.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: "center", py: 6 }}>
                      <Typography variant="h6" sx={{ opacity: 0.7 }}>
                        No DMs found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  visible.map((dm, index) => (
                    <TableRow
                      key={dm._id}
                      hover
                      sx={{ "&:hover": { bgcolor: "#fbfbff" } }}
                    >
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>

                      <TableCell>
                        <Avatar
                          src={dm.photo ? `${backendBase}/${dm.photo}` : ""}
                          alt={dm.firstName}
                          sx={{
                            width: 50,
                            height: 50,
                            bgcolor: !dm.photo
                              ? deepOrange[500]
                              : "transparent",
                          }}
                        >
                          {!dm.photo && initials(dm.firstName, dm.lastName)}
                        </Avatar>
                      </TableCell>

                      <TableCell>
                        <Typography sx={{ fontWeight: 700 }}>
                          {dm.uniqueId || "—"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography sx={{ fontWeight: 700 }}>
                          {dm.firstName} {dm.lastName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "gray" }}>
                          {dm.district || "—"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography sx={{ fontWeight: 600 }}>
                          {dm.email}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography sx={{ fontWeight: 600 }}>
                          {dm.phone || "—"}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Tooltip title="Actions">
                          <IconButton onClick={(e) => openActionMenu(e, dm)}>
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
                  <TablePagination
                    count={filtered.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    labelRowsPerPage="Rows"
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </div>
      </div>

      {/* Action Menu (shared) */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeActionMenu}
      >
        <MenuItem
          onClick={() => {
            setViewUser(selectedDM);
            closeActionMenu();
          }}
        >
          View
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeActionMenu();
            window.location.href = `/superadmin/dm/edit/${selectedDM?._id}`;
          }}
        >
          Edit
        </MenuItem>
        <MenuItem onClick={handleRole}>Change Role</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "red" }}>
          Delete
        </MenuItem>
      </Menu>

      {/* Dialogs */}
      <ViewUserDialog
        open={!!viewUser}
        user={viewUser}
        onClose={() => setViewUser(null)}
      />

      <ConfirmDialog
        open={confirm.open}
        title="Confirm Delete?"
        message="This action cannot be undone."
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={confirmDelete}
      />

      <RoleDialog
        open={roleDialog.open}
        id={roleDialog.id}
        onClose={() => setRoleDialog({ open: false, id: null })}
        reload={loadDMs}
      />
    </Box>
  );
}
