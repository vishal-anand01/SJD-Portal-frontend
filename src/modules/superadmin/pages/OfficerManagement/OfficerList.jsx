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

export default function OfficerList() {
  const navigate = useNavigate();

  const [officers, setOfficers] = useState([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const backendBase =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/uploads";

  /* ================= LOAD DATA ================= */
  const loadOfficers = async () => {
    try {
      const { data } = await axios.get("/superadmin/officers");
      setOfficers(data?.officers || []);
    } catch (err) {
      console.error("Failed to load officers", err);
    }
  };

  useEffect(() => {
    loadOfficers();
  }, []);

  /* ================= DEBOUNCE SEARCH ================= */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  /* ================= DISTRICTS ================= */
  const districts = useMemo(() => {
    const set = new Set();
    officers.forEach((o) => o.district && set.add(o.district));
    return ["", ...Array.from(set).sort()];
  }, [officers]);

  /* ================= FILTER + SORT ================= */
  const filtered = useMemo(() => {
    let list = [...officers];

    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      list = list.filter(
        (x) =>
          `${x.firstName} ${x.lastName}`.toLowerCase().includes(q) ||
          (x.email || "").toLowerCase().includes(q) ||
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
  }, [officers, debouncedQuery, districtFilter, sortOrder]);

  const visible = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const initials = (f = "", l = "") =>
    `${f?.[0] || ""}${l?.[0] || ""}`.toUpperCase();

  /* ================= EXPORT CSV ================= */
  const exportCSV = () => {
    const headers = ["SJD ID", "Name", "Email", "Phone", "District"];
    const rows = filtered.map((o) => [
      o.uniqueId || "",
      `${o.firstName} ${o.lastName}`,
      o.email,
      o.phone || "",
      o.district || "",
    ]);

    let csv = headers.join(",") + "\n";
    rows.forEach((r) => (csv += r.join(",") + "\n"));

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Officer_List.csv";
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
            background: "linear-gradient(90deg,#10b981,#3b82f6)",
            color: "white",
            borderRadius: 3,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={800}>
              Officer Management
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Total Officers: {officers.length}
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }} />

          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh">
              <IconButton onClick={loadOfficers} sx={{ color: "white" }}>
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
              onClick={() => navigate("/superadmin/officers/add")}
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
            placeholder="Search by name, email or SJD ID"
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
            {visible.map((o, idx) => (
              <TableRow
                key={o._id}
                hover
                sx={{
                  "&:hover": { background: "rgba(59,130,246,0.05)" },
                }}
              >
                <TableCell>{page * rowsPerPage + idx + 1}</TableCell>

                <TableCell>
                  <Avatar
                    src={o.photo ? `${backendBase}/${o.photo}` : ""}
                    sx={{
                      bgcolor: o.photo ? "transparent" : deepOrange[500],
                    }}
                  >
                    {!o.photo && initials(o.firstName, o.lastName)}
                  </Avatar>
                </TableCell>

                <TableCell>
                  <strong>{o.uniqueId || "—"}</strong>
                </TableCell>

                <TableCell>
                  <Button
                    sx={{ p: 0, fontWeight: 700, textTransform: "none" }}
                    onClick={() =>
                      navigate(`/superadmin/officers/view/${o._id}`)
                    }
                  >
                    {o.firstName} {o.lastName}
                  </Button>
                </TableCell>

                <TableCell>{o.email}</TableCell>
                <TableCell>{o.phone || "—"}</TableCell>

                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: "none", borderRadius: 2 }}
                    onClick={() =>
                      navigate(`/superadmin/officers/view/${o._id}`)
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
                    No officers found
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
