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
  Typography,
  Stack,
  TableFooter,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip,
  IconButton,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DownloadIcon from "@mui/icons-material/Download";
import { deepOrange } from "@mui/material/colors";

export default function DepartmentList() {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const backendBase =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/uploads";

  /* ================= LOAD DATA ================= */
  const loadDepartments = async () => {
    try {
      const { data } = await axios.get("/superadmin/departments/users");
      const list = data?.departmentUsers || data?.departments || [];
      setDepartments(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error("Failed to load departments", e);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  /* ================= DEBOUNCE SEARCH ================= */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  /* ================= DISTRICT LIST ================= */
  const districts = useMemo(() => {
    const set = new Set();
    departments.forEach((d) => d?.district && set.add(d.district));
    return ["", ...Array.from(set).sort()];
  }, [departments]);

  /* ================= FILTER + SORT ================= */
  const filtered = useMemo(() => {
    let list = [...departments];

    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      list = list.filter(
        (x) =>
          (x?.name || "").toLowerCase().includes(q) ||
          (x?.email || "").toLowerCase().includes(q) ||
          (x?.uniqueId || x?.code || "").toLowerCase().includes(q)
      );
    }

    if (districtFilter)
      list = list.filter((x) => x?.district === districtFilter);

    list.sort((a, b) => {
      const A = (a?.name || "").toLowerCase();
      const B = (b?.name || "").toLowerCase();
      return sortOrder === "asc" ? A.localeCompare(B) : B.localeCompare(A);
    });

    return list;
  }, [departments, debouncedQuery, districtFilter, sortOrder]);

  const visible = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const initials = (name = "") =>
    `${name?.[0] || ""}`.toUpperCase();

  /* ================= EXPORT CSV ================= */
  const exportCSV = () => {
    const headers = ["SJd ID", "Department", "Email", "Phone", "District"];
    const rows = filtered.map((d) => [
      d.uniqueId || d.code || "",
      d.name,
      d.email || "",
      d.phone || "",
      d.district || "",
    ]);

    let csv = headers.join(",") + "\n";
    rows.forEach((r) => (csv += r.join(",") + "\n"));

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Department_List.csv";
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
            background: "linear-gradient(90deg,#0ea5e9,#6366f1)",
            color: "white",
            borderRadius: 3,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={800}>
              Department Management
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Total Departments: {departments.length}
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }} />

          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh">
              <IconButton onClick={loadDepartments} sx={{ color: "white" }}>
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
              onClick={() => navigate("/superadmin/departments/add")}
              sx={{
                textTransform: "none",
                borderRadius: 3,
                background: "#fff",
                color: "#2563eb",
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
            placeholder="Search by name, email or SJd ID"
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
              sortOrder === "asc" ? (
                <ArrowUpwardIcon />
              ) : (
                <ArrowDownwardIcon />
              )
            }
            label={sortOrder === "asc" ? "A–Z" : "Z–A"}
            clickable
            color="primary"
            onClick={() =>
              setSortOrder((p) => (p === "asc" ? "desc" : "asc"))
            }
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
              <TableCell>SJd ID</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Profile</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visible.map((dept, idx) => (
              <TableRow key={dept._id} hover>
                <TableCell>{page * rowsPerPage + idx + 1}</TableCell>

                <TableCell>
                  <Avatar
                    src={dept.photo ? `${backendBase}/${dept.photo}` : ""}
                    sx={{
                      bgcolor: dept.photo ? "transparent" : deepOrange[500],
                    }}
                  >
                    {!dept.photo && initials(dept.name)}
                  </Avatar>
                </TableCell>

                <TableCell>
                  <strong>{dept.uniqueId || dept.code}</strong>
                </TableCell>

                <TableCell>
                  <Button
                    onClick={() =>
                      navigate(`/superadmin/departments/view/${dept._id}`)
                    }
                    sx={{ textTransform: "none", fontWeight: 700, p: 0 }}
                  >
                    {dept.name}
                  </Button>
                </TableCell>

                <TableCell>{dept.email || "—"}</TableCell>
                <TableCell>{dept.phone || "—"}</TableCell>

                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: "none", borderRadius: 2 }}
                    onClick={() =>
                      navigate(`/superadmin/departments/view/${dept._id}`)
                    }
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
                    No Departments found
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
