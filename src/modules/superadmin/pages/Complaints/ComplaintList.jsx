import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../../api/axiosConfig";
import {
  Box,
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

import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DownloadIcon from "@mui/icons-material/Download";

export default function ComplaintList() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  /* ================= LOAD DATA ================= */
  const loadComplaints = async () => {
    try {
      const { data } = await axios.get("/superadmin/complaints");
      setComplaints(data?.complaints || []);
    } catch (err) {
      console.error("Failed to load complaints", err);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  /* ================= DEBOUNCE SEARCH ================= */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  /* ================= DISTRICT LIST ================= */
  const districts = useMemo(() => {
    const set = new Set();
    complaints.forEach((c) => c.district && set.add(c.district));
    return ["", ...Array.from(set).sort()];
  }, [complaints]);

  /* ================= FILTER + SORT ================= */
  const filtered = useMemo(() => {
    let list = [...complaints];

    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      list = list.filter(
        (x) =>
          (x.title || "").toLowerCase().includes(q) ||
          (x.complaintId || "").toLowerCase().includes(q) ||
          (x.status || "").toLowerCase().includes(q)
      );
    }

    if (districtFilter) {
      list = list.filter((x) => x.district === districtFilter);
    }

    list.sort((a, b) => {
      const A = (a.title || "").toLowerCase();
      const B = (b.title || "").toLowerCase();
      return sortOrder === "asc"
        ? A.localeCompare(B)
        : B.localeCompare(A);
    });

    return list;
  }, [complaints, debouncedQuery, districtFilter, sortOrder]);

  const visible = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  /* ================= EXPORT CSV ================= */
  const exportCSV = () => {
    const headers = ["Complaint ID", "Title", "Status", "Priority", "District"];
    const rows = filtered.map((c) => [
      c.complaintId || "",
      c.title || "",
      c.status || "",
      c.priority || "",
      c.district || "",
    ]);

    let csv = headers.join(",") + "\n";
    rows.forEach((r) => (csv += r.join(",") + "\n"));

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Complaints_List.csv";
    a.click();
  };

  const statusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "success";
      case "Pending":
        return "warning";
      case "Rejected":
        return "error";
      default:
        return "default";
    }
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
            background: "linear-gradient(90deg,#ef4444,#f97316)",
            color: "white",
            borderRadius: 3,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={800}>
              Complaint Management
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Total Complaints: {complaints.length}
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }} />

          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh">
              <IconButton onClick={loadComplaints} sx={{ color: "white" }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Export CSV">
              <IconButton onClick={exportCSV} sx={{ color: "white" }}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </Paper>

      {/* ================= FILTER BAR ================= */}
      <Paper sx={{ p: 2, borderRadius: 3, mb: 3 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by title, complaint ID or status"
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
              <TableCell>Complaint ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>District</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visible.map((c, idx) => (
              <TableRow key={c._id} hover>
                <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                <TableCell>
                  <strong>{c.complaintId || "—"}</strong>
                </TableCell>
                <TableCell>{c.title}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={c.status}
                    color={statusColor(c.status)}
                  />
                </TableCell>
                <TableCell>{c.priority || "—"}</TableCell>
                <TableCell>{c.district || "—"}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: "none", borderRadius: 2 }}
                    onClick={() =>
                      navigate(`/superadmin/complaints/view/${c._id}`)
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
                    No complaints found
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
