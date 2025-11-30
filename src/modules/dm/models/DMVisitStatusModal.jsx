import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Paper,
  Chip,
  LinearProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Alert,
} from "@mui/material";
import axios from "../../../api/axiosConfig";

export default function DMVisitStatusModal({
  open,
  onClose,
  assignment,
  baseURL,
}) {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);

  const isImage = (file) => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file || "");
  const isPDF = (file) => /\.pdf$/i.test(file || "");

  const visitReport = assignment?.visitReport || {};

  // ✅ Yaha fallback base URL fix
  const API_BASE =
    baseURL ||
    (import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")
      : window.location.origin.includes("5173")
      ? window.location.origin.replace("5173", "5000")
      : window.location.origin);

  const proofFileUrl = visitReport.proofFile
    ? `${API_BASE}/uploads/${visitReport.proofFile}`
    : null;

  console.log("🧪 DMVisitStatusModal proofFile:", {
    proofFile: visitReport.proofFile,
    proofFileUrl,
    API_BASE,
  });

  // Load Visit Date Complaints
  useEffect(() => {
    if (assignment?.visitDate && assignment?.officer?._id) {
      fetchVisitStats(assignment.visitDate, assignment.officer._id);
    }
  }, [assignment]);

  const fetchVisitStats = async (date, officerId) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/officer/visit-complaints/by-date?date=${encodeURIComponent(
          date
        )}&officerId=${officerId}`
      );
      setStats(data?.stats || {});
      setComplaints(data?.complaints || []);
    } catch (e) {
      console.error(e);
      setStats({});
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const statusChip = (s) => {
    const color = {
      Pending: "warning",
      "In Progress": "info",
      Resolved: "success",
      Forwarded: "primary",
      Rejected: "error",
    }[s];
    return <Chip size="small" label={s} color={color || "default"} />;
  };

  return (
    <Dialog open={open} fullWidth maxWidth="lg" onClose={onClose}>
      {/* HEADER */}
      <DialogTitle
        sx={{
          background: "linear-gradient(90deg,#1e3a8a,#2563eb,#38bdf8)",
          color: "white",
          py: 2,
          textAlign: "center",
          fontWeight: 800,
          fontSize: "1.5rem",
        }}
      >
        Field Visit Status Overview
      </DialogTitle>

      <DialogContent dividers sx={{ background: "#f3f6ff", p: 3 }}>
        {loading && <LinearProgress sx={{ mb: 2 }} />}

        {/* ========================================================= */}
        {/* 1) ASSIGNMENT DETAILS */}
        {/* ========================================================= */}
        <Paper
          elevation={5}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 4,
            background: "linear-gradient(135deg,#eef2ff,#ffffff)",
            border: "1px solid #dbeafe",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e3a8a" }}>
            Assignment Details
          </Typography>
          <Divider sx={{ my: 2 }} />

          <div className="row">
            <div className="col-md-4">
              <b>Officer:</b> {assignment?.officer?.firstName}{" "}
              {assignment?.officer?.lastName}
            </div>
            <div className="col-md-4">
              <b>Visit Date:</b>{" "}
              {assignment?.visitDate
                ? new Date(assignment.visitDate).toLocaleDateString()
                : "Not Assigned"}
            </div>
            <div className="col-md-4">
              <b>Priority:</b>{" "}
              <Chip size="small" label={assignment?.priority} />
            </div>

            <div className="col-md-4 mt-2">
              <b>Village:</b> {assignment?.location?.village}
            </div>
            <div className="col-md-4 mt-2">
              <b>Gram Panchayat:</b> {assignment?.location?.gramPanchayat}
            </div>
            <div className="col-md-4 mt-2">
              <b>District:</b> {assignment?.location?.district}
            </div>
          </div>
        </Paper>

        {/* ========================================================= */}
        {/* 2) COMPLAINT SUMMARY */}
        {/* ========================================================= */}
        {stats && (
          <Paper
            elevation={5}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 4,
              background: "linear-gradient(135deg,#f0f9ff,#ffffff)",
              border: "1px solid #bae6fd",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#0369a1" }}>
              Complaints Summary (Filed on Visit Day)
            </Typography>
            <Divider sx={{ my: 2 }} />

            <div className="row text-center">
              {[
                ["Total", stats.total],
                ["Resolved", stats.solved],
                ["Pending", stats.pending],
                ["Forwarded", stats.forwarded],
                ["Rejected", stats.rejected],
                ["In Progress", stats.inProgress],
              ].map(([label, value], idx) => (
                <div key={idx} className="col-md-2 mb-3">
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: "white",
                      border: "1px solid #dbeafe",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 800, color: "#1e40af" }}
                    >
                      {value ?? 0}
                    </Typography>
                    <Typography sx={{ color: "text.secondary" }}>
                      {label}
                    </Typography>
                  </Paper>
                </div>
              ))}
            </div>
          </Paper>
        )}

        {/* ========================================================= */}
        {/* 3) COMPLAINTS FILED */}
        {/* ========================================================= */}
        <Paper
          elevation={5}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 4,
            background: "linear-gradient(135deg,#fafafa,#ffffff)",
            border: "1px solid #e5e7eb",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Complaints Filed on Visit Date
          </Typography>
          <Divider sx={{ my: 2 }} />

          {complaints.length === 0 ? (
            <Alert severity="info" sx={{ py: 2, textAlign: "center" }}>
              No complaints filed by officer on this date.
            </Alert>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ background: "#f1f5f9" }}>
                  <TableCell>
                    <b>Tracking ID</b>
                  </TableCell>
                  <TableCell>
                    <b>Title</b>
                  </TableCell>
                  <TableCell>
                    <b>Status</b>
                  </TableCell>
                  <TableCell>
                    <b>Date</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {complaints.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell>{c.trackingId}</TableCell>
                    <TableCell>{c.title}</TableCell>
                    <TableCell>{statusChip(c.status)}</TableCell>
                    <TableCell>
                      {new Date(c.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>

        {/* ========================================================= */}
        {/* 4) OFFICER VISIT REPORT — PREMIUM FINAL FIXED */}
        {/* ========================================================= */}
        {assignment?.visitReport ? (
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 4,
              background: "linear-gradient(135deg,#eef7ff,#ffffff)",
              border: "1px solid #c7d2fe",
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: 900, color: "#1e3a8a", mb: 2 }}
            >
              Officer Visit Report (Submitted)
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Typography>
              <b>Actual Visit Date:</b>{" "}
              {assignment.visitReport.actualVisitDate
                ? new Date(
                    assignment.visitReport.actualVisitDate
                  ).toLocaleDateString()
                : "N/A"}
            </Typography>

            <Typography sx={{ mt: 2 }}>
              <b>Summary / Remarks:</b>{" "}
              {assignment.visitReport.remarks || "N/A"}
            </Typography>

            {/* ---------------- Visit Proof Attachment (FINAL CLEAN OUTPUT) ---------------- */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                📎 Visit Proof Attachment:
              </Typography>

              {/* No File */}
              {!visitReport.proofFile && (
                <Alert severity="info">No visit proof uploaded.</Alert>
              )}

              {/* Image Preview */}
              {visitReport.proofFile &&
                isImage(visitReport.proofFile) &&
                proofFileUrl && (
                  <Box sx={{ mb: 2 }}>
                    <img
                      src={proofFileUrl}
                      alt="Visit Proof"
                      style={{
                        width: "100%",
                        maxHeight: 420,
                        objectFit: "contain",
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                      }}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  </Box>
                )}

              {/* ✅ PDF Inline Viewer (ye naya hai) */}
              {visitReport.proofFile &&
                isPDF(visitReport.proofFile) &&
                proofFileUrl && (
                  <Box sx={{ mb: 2 }}>
                    <iframe
                      src={proofFileUrl}
                      title="Visit Proof PDF"
                      style={{
                        width: "100%",
                        height: 500,
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        background: "#ffffff",
                      }}
                    />
                  </Box>
                )}

              {/* Unknown file type */}
              {visitReport.proofFile &&
                !isImage(visitReport.proofFile) &&
                !isPDF(visitReport.proofFile) && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    Unknown file type. Only image and PDF previews are
                    supported.
                  </Alert>
                )}

              {/* Download Button — COMMON */}
              {visitReport.proofFile && proofFileUrl && (
                <Button
                  href={proofFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  sx={{
                    mt: 1,
                    bgcolor: "#1e3a8a",
                    color: "#fff",
                    fontWeight: 700,
                    "&:hover": { bgcolor: "#1e40af" },
                  }}
                >
                  ⬇ Download Attachment
                </Button>
              )}
            </Box>
          </Paper>
        ) : (
          <Alert severity="warning" sx={{ mt: 3 }}>
            Officer has not submitted any visit report yet.
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", py: 2 }}>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#1e3a8a",
            px: 5,
            py: 1,
            fontSize: "1rem",
            borderRadius: 3,
            fontWeight: 800,
            "&:hover": { bgcolor: "#1e40af" },
          }}
          onClick={onClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
