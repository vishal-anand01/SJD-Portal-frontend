// frontend/src/modules/superadmin/DMManagement/DMListTable.jsx
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
  Divider,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DownloadIcon from "@mui/icons-material/Download";
import { deepOrange } from "@mui/material/colors";

export default function DMListTable() {
  const navigate = useNavigate();

  const [dms, setDms] = useState([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const backendBase =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/uploads";

  /* -------------------- LOAD DATA -------------------- */
  const loadDMs = async () => {
    try {
      const { data } = await axios.get("/superadmin/dm");
      setDms(data?.dms || []);
    } catch (err) {
      console.error("Failed to load DMs", err);
    }
  };

  useEffect(() => {
    loadDMs();
  }, []);

  /* -------------------- DEBOUNCE SEARCH -------------------- */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  /* -------------------- DISTRICTS -------------------- */
  const districts = useMemo(() => {
    const set = new Set();
    dms.forEach((d) => d.district && set.add(d.district));
    return ["", ...Array.from(set).sort()];
  }, [dms]);

  /* -------------------- FILTER + SORT -------------------- */
  const filtered = useMemo(() => {
    let list = [...dms];

    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      list = list.filter(
        (x) =>
          `${x.firstName} ${x.lastName}`.toLowerCase().includes(q) ||
          (x.email || "").toLowerCase().includes(q) ||
          (x.uniqueId || "").toLowerCase().includes(q)
      );
    }

    if (districtFilter)
      list = list.filter((x) => x.district === districtFilter);

    list.sort((a, b) => {
      const A = `${a.firstName} ${a.lastName}`.toLowerCase();
      const B = `${b.firstName} ${b.lastName}`.toLowerCase();
      return sortOrder === "asc" ? A.localeCompare(B) : B.localeCompare(A);
    });

    return list;
  }, [dms, debouncedQuery, districtFilter, sortOrder]);

  const visible = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const initials = (f = "", l = "") =>
    `${f?.[0] || ""}${l?.[0] || ""}`.toUpperCase();

  /* -------------------- EXPORT CSV -------------------- */
  const exportCSV = () => {
    const headers = ["SJd ID", "Name", "Email", "Phone", "District"];
    const rows = filtered.map((d) => [
      d.uniqueId,
      `${d.firstName} ${d.lastName}`,
      d.email,
      d.phone || "",
      d.district || "",
    ]);

    let csv = headers.join(",") + "\n";
    rows.forEach((r) => (csv += r.join(",") + "\n"));

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "DM_List.csv";
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
              DM Management
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Total DMs: {dms.length}
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }} />

          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh">
              <IconButton onClick={loadDMs} sx={{ color: "white" }}>
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
              onClick={() => navigate("/superadmin/dm/add")}
              sx={{
                textTransform: "none",
                borderRadius: 3,
                background: "#fff",
                color: "#2563eb",
                fontWeight: 700,
              }}
            >
              + New
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
            <TableRow sx={{ background: "#f8fafc" }}>
              <TableCell>#</TableCell>
              <TableCell>Photo</TableCell>
              <TableCell>SJd ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Profile</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visible.map((dm, idx) => (
              <TableRow
                key={dm._id}
                hover
                sx={{
                  transition: "0.2s",
                  "&:hover": { background: "rgba(99,102,241,0.05)" },
                }}
              >
                <TableCell>{page * rowsPerPage + idx + 1}</TableCell>

                <TableCell>
                  <Avatar
                    src={dm.photo ? `${backendBase}/${dm.photo}` : ""}
                    sx={{
                      bgcolor: dm.photo ? "transparent" : deepOrange[500],
                    }}
                  >
                    {!dm.photo && initials(dm.firstName, dm.lastName)}
                  </Avatar>
                </TableCell>

                <TableCell>
                  <strong>{dm.uniqueId}</strong>
                </TableCell>

                <TableCell>
                  <Button
                    onClick={() =>
                      navigate(`/superadmin/dm/view/${dm._id}`)
                    }
                    sx={{
                      textTransform: "none",
                      fontWeight: 700,
                      p: 0,
                    }}
                  >
                    {dm.firstName} {dm.lastName}
                  </Button>
                </TableCell>

                <TableCell>{dm.email}</TableCell>
                <TableCell>{dm.phone || "—"}</TableCell>

                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: "none", borderRadius: 2 }}
                    onClick={() =>
                      navigate(`/superadmin/dm/view/${dm._id}`)
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
                    No DMs found
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
