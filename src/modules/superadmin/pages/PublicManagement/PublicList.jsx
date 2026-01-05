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
  Typography,
  Stack,
  TableFooter,
  TablePagination,
  Chip,
  Tooltip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DownloadIcon from "@mui/icons-material/Download";
import { deepOrange } from "@mui/material/colors";

export default function PublicList() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const backendBase =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/uploads";

  /* ================= LOAD DATA ================= */
  const loadUsers = async () => {
    try {
      const { data } = await axios.get("/superadmin/public");
      setUsers(data?.users || []);
    } catch (err) {
      console.error("Failed to load public users", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* ================= DEBOUNCE SEARCH ================= */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  /* ================= DISTRICT LIST ================= */
  const districts = useMemo(() => {
    const set = new Set();
    users.forEach((u) => u.district && set.add(u.district));
    return ["", ...Array.from(set).sort()];
  }, [users]);

  /* ================= FILTER + SORT ================= */
  const filtered = useMemo(() => {
    let list = [...users];

    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      list = list.filter(
        (x) =>
          `${x.firstName} ${x.lastName}`.toLowerCase().includes(q) ||
          (x.email || "").toLowerCase().includes(q) ||
          (x.phone || "").includes(q) ||
          (x.uniqueId || "").toLowerCase().includes(q)
      );
    }

    if (districtFilter) {
      list = list.filter((x) => x.district === districtFilter);
    }

    list.sort((a, b) => {
      const A = `${a.firstName} ${a.lastName}`.toLowerCase();
      const B = `${b.firstName} ${b.lastName}`.toLowerCase();
      return sortOrder === "asc" ? A.localeCompare(B) : B.localeCompare(A);
    });

    return list;
  }, [users, debouncedQuery, districtFilter, sortOrder]);

  const visible = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const initials = (f = "", l = "") =>
    `${f?.[0] || ""}${l?.[0] || ""}`.toUpperCase();

  /* ================= EXPORT CSV ================= */
  const exportCSV = () => {
    const headers = ["SJD ID", "Name", "Email", "Phone", "District"];
    const rows = filtered.map((u) => [
      u.uniqueId || "",
      `${u.firstName} ${u.lastName}`,
      u.email,
      u.phone || "",
      u.district || "",
    ]);

    let csv = headers.join(",") + "\n";
    rows.forEach((r) => (csv += r.join(",") + "\n"));

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Public_Users_List.csv";
    a.click();
  };

  return (
    <Box className="container-fluid py-4">
      {/* ================= HEADER ================= */}
      <Paper elevation={6} sx={{ borderRadius: 3, mb: 3 }}>
        <Box
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            background: "linear-gradient(90deg,#f97316,#ec4899)",
            color: "white",
            borderRadius: 3,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={800}>
              Public Users
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Total Users: {users.length}
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }} />

          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh">
              <IconButton onClick={loadUsers} sx={{ color: "white" }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Export CSV">
              <IconButton onClick={exportCSV} sx={{ color: "white" }}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/superadmin/public/add")}
              sx={{
                textTransform: "none",
                borderRadius: 3,
                background: "#fff",
                color: "#db2777",
                fontWeight: 700,
              }}
            >
              New
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* ================= FILTER BAR ================= */}
      <Paper sx={{ p: 2, borderRadius: 3, mb: 3 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by name, email, phone or SJD ID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1 }} />,
            }}
          />

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>District</InputLabel>
            <Select
              label="District"
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {districts.map(
                (d, i) =>
                  d && (
                    <MenuItem key={i} value={d}>
                      {d}
                    </MenuItem>
                  )
              )}
            </Select>
          </FormControl>

          <Chip
            icon={
              sortOrder === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />
            }
            label={sortOrder === "asc" ? "A–Z" : "Z–A"}
            clickable
            color="primary"
            onClick={() => setSortOrder((p) => (p === "asc" ? "desc" : "asc"))}
          />
        </Stack>
      </Paper>

      {/* ================= TABLE ================= */}
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Photo</TableCell>
              <TableCell>SJD ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Profile</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visible.map((u, idx) => (
              <TableRow key={u._id} hover>
                <TableCell>{page * rowsPerPage + idx + 1}</TableCell>

                <TableCell>
                  <Avatar
                    src={u.photo ? `${backendBase}/${u.photo}` : ""}
                    sx={{
                      bgcolor: u.photo ? "transparent" : deepOrange[500],
                    }}
                  >
                    {!u.photo && initials(u.firstName, u.lastName)}
                  </Avatar>
                </TableCell>

                <TableCell>
                  <strong>{u.uniqueId || "—"}</strong>
                </TableCell>

                <TableCell>
                  <Button
                    sx={{ p: 0, fontWeight: 700, textTransform: "none" }}
                    onClick={() => navigate(`/superadmin/public/view/${u._id}`)}
                  >
                    {u.firstName} {u.lastName}
                  </Button>
                </TableCell>

                <TableCell>{u.email}</TableCell>
                <TableCell>{u.phone || "—"}</TableCell>

                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: "none", borderRadius: 2 }}
                    onClick={() => navigate(`/superadmin/public/view/${u._id}`)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {visible.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    No public users found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                count={filtered.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(e, p) => setPage(p)}
                onRowsPerPageChange={(e) =>
                  setRowsPerPage(parseInt(e.target.value, 10))
                }
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
}
