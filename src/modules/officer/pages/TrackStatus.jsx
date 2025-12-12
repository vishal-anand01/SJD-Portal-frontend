import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  Alert,
  Divider,
  Paper,
  Tooltip,
  Zoom,
  CircularProgress,
} from "@mui/material";
import { Row, Col } from "react-bootstrap";

import SearchIcon from "@mui/icons-material/Search";
import CategoryIcon from "@mui/icons-material/Category";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PersonIcon from "@mui/icons-material/Person";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import DownloadIcon from "@mui/icons-material/Download";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "../../../api/axiosConfig";

/* -------------------------------------------------------------------------- */
/* 🧭 Complaint Tracking Component                                            */
/* -------------------------------------------------------------------------- */
export default function TrackStatus({
  externalComplaint,
  externalTrackingId,
  mode,
}) {
  const [trackingId, setTrackingId] = useState(externalTrackingId || "");

  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState("");
  const [downloading, setDownloading] = useState(false);

  const printRef = useRef();
  const backendBase = "http://localhost:5000/uploads";

  /* ---------------------------------------------------------------------- */
  /* 🔍 Track Complaint API Call                                            */
  /* ---------------------------------------------------------------------- */
  const handleTrack = async () => {
    setError("");
    setComplaint(null);

    if (!trackingId.trim()) {
      setError("Please enter a valid Tracking ID.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(
        `/complaints/track/${encodeURIComponent(trackingId)}`
      );
      setComplaint(data.complaint);
    } catch (err) {
      setError(err.response?.data?.message || "Complaint not found.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------------------------------- */
  /* 📘 Helpers                                                             */
  /* ---------------------------------------------------------------------- */
  const getProgressValue = (status) => {
    switch (status) {
      case "Resolved":
      case "Rejected":
        return 100;
      case "In Progress":
        return 60;
      case "Forwarded":
        return 80;
      default:
        return 25;
    }
  };

  const getProgressColor = (status) => {
    switch (status) {
      case "Resolved":
        return "#22c55e";
      case "In Progress":
        return "#3b82f6";
      case "Rejected":
        return "#ef4444";
      case "Forwarded":
        return "#7e22ce";
      default:
        return "#facc15";
    }
  };

  const isImage = (filename) =>
    /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(filename || "");
  const isPDF = (filename) => /\.(pdf)$/i.test(filename || "");

  const getAttachments = (attachments) => {
    if (!attachments) return [];
    if (Array.isArray(attachments)) return attachments;
    if (typeof attachments === "string" && attachments.trim() !== "")
      return [attachments.trim()];
    return [];
  };

  const isOfficerComplaint = complaint?.sourceType === "Officer";

  /* ---------------------------------------------------------------------- */
  /* 📄 PDF Export Function                                                 */
  /* ---------------------------------------------------------------------- */
  const handleDownloadPDF = async () => {
    if (!complaint) return;
    setDownloading(true);
    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${complaint.trackingId}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
    }
    setDownloading(false);
  };

  /* ---------------------------------------------------------------------- */
  /* 🖼️ Main JSX                                                           */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    // If trackingId came from parent component (modal)
    if (externalTrackingId) {
      setTrackingId(externalTrackingId); // Auto fill search box
      handleTrack(); // Auto search
    }

    // If complaint object already provided (modal loaded earlier)
    if (externalComplaint) {
      setComplaint(externalComplaint);
    }
  }, [externalTrackingId, externalComplaint]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #dbeafe 0%, #eef2ff 100%)",
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Card
          sx={{
            borderRadius: 4,
            p: { xs: 3, md: 5 },
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            background: "white",
          }}
        >
          <CardContent>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h4"
                sx={{
                  textAlign: "center",
                  mb: 4,
                  fontWeight: 800,
                  color: "#1e3a8a",
                  textTransform: "uppercase",
                }}
              >
                Track Your Complaint
              </Typography>

              {/* Search Bar */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  mb: 3,
                }}
              >
                <TextField
                  label="Enter Tracking ID"
                  fullWidth
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="e.g. SJD/2025/CMP000014"
                  sx={{ backgroundColor: "#f8fafc", borderRadius: 2 }}
                />
                <Button
                  variant="contained"
                  onClick={handleTrack}
                  disabled={loading}
                  startIcon={<SearchIcon />}
                  sx={{
                    bgcolor: "#1e3a8a",
                    px: 4,
                    borderRadius: 3,
                    fontWeight: 700,
                    "&:hover": { bgcolor: "#1d4ed8" },
                  }}
                >
                  {loading ? "Checking..." : "Track"}
                </Button>
              </Box>

              {error && <Alert severity="error">{error}</Alert>}
            </motion.div>

            {/* Complaint Details */}
            {complaint && (
              <motion.div
                ref={printRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
              >
                <Box
                  sx={{
                    mt: 5,
                    p: 3,
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #eff6ff, #ffffff)",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  }}
                >
                  {/* Basic Info */}
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: "#1e3a8a",
                      mb: 1,
                    }}
                  >
                    {complaint.title}
                  </Typography>

                  <Typography sx={{ color: "#64748b" }}>
                    Tracking ID: <strong>{complaint.trackingId}</strong>
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography
                    variant="body1"
                    sx={{
                      mt: 1,
                      backgroundColor: "#f8fafc",
                      p: 2,
                      borderRadius: 2,
                      borderLeft: "4px solid #2563eb",
                    }}
                  >
                    {complaint.description}
                  </Typography>

                  {/* Attachments */}
                  {(() => {
                    const files = getAttachments(complaint.attachments);
                    if (files.length === 0)
                      return (
                        <Alert severity="info" sx={{ mt: 3 }}>
                          ℹ️ No attachment uploaded for this complaint.
                        </Alert>
                      );

                    return (
                      <Box sx={{ mt: 3 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 700,
                            mb: 1,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <AttachFileIcon sx={{ color: "#2563eb", mr: 1 }} />{" "}
                          Attachment
                        </Typography>
                        {files.map((file, i) => {
                          const fileUrl = `${backendBase}/${file}`;
                          if (isImage(file)) {
                            return (
                              <Box key={i} sx={{ textAlign: "center", mb: 3 }}>
                                <img
                                  src={fileUrl}
                                  alt="Attachment"
                                  style={{
                                    maxWidth: "100%",
                                    borderRadius: "10px",
                                    border: "1px solid #e2e8f0",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                  }}
                                />
                              </Box>
                            );
                          } else if (isPDF(file)) {
                            return (
                              <Box key={i} sx={{ mt: 2 }}>
                                <iframe
                                  src={fileUrl}
                                  title={`PDF-${i}`}
                                  width="100%"
                                  height="400px"
                                  style={{
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "10px",
                                  }}
                                ></iframe>
                              </Box>
                            );
                          } else {
                            return (
                              <Button
                                key={i}
                                href={fileUrl}
                                target="_blank"
                                startIcon={<AttachFileIcon />}
                                variant="outlined"
                                sx={{
                                  mt: 2,
                                  borderColor: "#1e3a8a",
                                  color: "#1e3a8a",
                                  "&:hover": { bgcolor: "#f1f5f9" },
                                }}
                              >
                                Download File
                              </Button>
                            );
                          }
                        })}
                        {fileError && (
                          <Alert severity="error" sx={{ mt: 2 }}>
                            {fileError}
                          </Alert>
                        )}
                      </Box>
                    );
                  })()}

                  {/* Citizen Information */}

                  <Paper
                    elevation={3}
                    sx={{
                      mt: 3,
                      p: 2.5,
                      borderRadius: 2,
                      border: "1px solid #bfdbfe",
                      background: "linear-gradient(135deg,#f8fafc,#ffffff)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: "#1e3a8a",
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <PersonIcon sx={{ mr: 1 }} /> Citizen Information
                    </Typography>

                    <Row className="gy-2 gx-3">
                      {/* 1️⃣ Public Logged-in User (citizen object exists) */}
                      {complaint?.citizen ? (
                        <>
                          <Col md={6}>
                            <Typography variant="body2">
                              <strong>Name:</strong>{" "}
                              {`${complaint.citizen.firstName || ""} ${
                                complaint.citizen.lastName || ""
                              }`}
                            </Typography>
                          </Col>

                          <Col md={6}>
                            <Typography variant="body2">
                              <strong>Email:</strong>{" "}
                              {complaint.citizen.email || "N/A"}
                            </Typography>
                          </Col>

                          <Col md={6}>
                            <Typography variant="body2">
                              <strong>Phone:</strong>{" "}
                              {complaint.citizen.phone || "N/A"}
                            </Typography>
                          </Col>

                          <Col md={6}>
                            <Typography variant="body2">
                              <strong>Gender:</strong>{" "}
                              {complaint.citizen.gender || "N/A"}
                            </Typography>
                          </Col>

                          <Col md={12}>
                            <Typography variant="body2">
                              <strong>Address:</strong>{" "}
                              {`${complaint.citizen.address || ""}, ${
                                complaint.citizen.city || ""
                              }, ${complaint.citizen.state || ""}, ${
                                complaint.citizen.country || ""
                              } ${complaint.citizen.pincode || ""}`}
                            </Typography>
                          </Col>
                        </>
                      ) : (
                        <>
                          {/* 2️⃣ Officer Filed Complaint OR Public (No Login) */}
                          <Col md={6}>
                            <Typography variant="body2">
                              <strong>Name:</strong>{" "}
                              {complaint.citizenName || "N/A"}
                            </Typography>
                          </Col>

                          <Col md={6}>
                            <Typography variant="body2">
                              <strong>Mobile:</strong>{" "}
                              {complaint.citizenMobile || "N/A"}
                            </Typography>
                          </Col>

                          <Col md={6}>
                            <Typography variant="body2">
                              <strong>Date of Birth:</strong>{" "}
                              {complaint.citizenDob
                                ? new Date(
                                    complaint.citizenDob
                                  ).toLocaleDateString()
                                : "N/A"}
                            </Typography>
                          </Col>

                          <Col md={6}>
                            <Typography variant="body2">
                              <strong>Village:</strong>{" "}
                              {complaint.village || "N/A"}
                            </Typography>
                          </Col>

                          <Col md={6}>
                            <Typography variant="body2">
                              <strong>Block:</strong> {complaint.block || "N/A"}
                            </Typography>
                          </Col>

                          <Col md={6}>
                            <Typography variant="body2">
                              <strong>Tehsil:</strong>{" "}
                              {complaint.tehsil || "N/A"}
                            </Typography>
                          </Col>

                          <Col md={6}>
                            <Typography variant="body2">
                              <strong>District:</strong>{" "}
                              {complaint.district || "N/A"}
                            </Typography>
                          </Col>

                          <Col md={6}>
                            <Typography variant="body2">
                              <strong>State:</strong> {complaint.state || "N/A"}
                            </Typography>
                          </Col>

                          <Col md={6}>
                            <Typography variant="body2">
                              <strong>Pincode:</strong>{" "}
                              {complaint.pincode || "N/A"}
                            </Typography>
                          </Col>

                          <Col md={12}>
                            <Typography variant="body2">
                              <strong>Landmark:</strong>{" "}
                              {complaint.landmark || "N/A"}
                            </Typography>
                          </Col>
                        </>
                      )}
                    </Row>
                  </Paper>

                  {/* Filed By (Officer) Section */}
                  {isOfficerComplaint && complaint.filedBy && (
                    <Paper
                      elevation={3}
                      sx={{
                        mt: 3,
                        p: 2.5,
                        borderRadius: 2,
                        background: "#f1f5f9",
                        border: "1px solid #cbd5e1",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "#1e3a8a",
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <AccountBoxIcon sx={{ mr: 1 }} /> Filed By (Officer)
                      </Typography>

                      {complaint.filedBy ? (
                        <>
                          <Typography variant="body2">
                            <strong>Name:</strong>{" "}
                            {`${complaint.filedBy.firstName || ""} ${
                              complaint.filedBy.lastName || ""
                            }`}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Email:</strong>{" "}
                            {complaint.filedBy.email || "Not Available"}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Role:</strong>{" "}
                            {complaint.filedBy.role
                              ? complaint.filedBy.role.charAt(0).toUpperCase() +
                                complaint.filedBy.role.slice(1)
                              : "Officer"}
                          </Typography>
                        </>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ color: "#6b7280", fontStyle: "italic" }}
                        >
                          Officer details not available.
                        </Typography>
                      )}
                    </Paper>
                  )}

                  <Divider sx={{ my: 3 }} />

                  {/* Meta Info */}
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CategoryIcon sx={{ color: "#2563eb", mr: 1 }} />
                      <Typography variant="body1">
                        <strong>Category:</strong> {complaint.category}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <PlaceIcon sx={{ color: "#2563eb", mr: 1 }} />
                      <Typography variant="body1">
                        <strong>Location:</strong> {complaint.location || "N/A"}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <AccessTimeIcon sx={{ color: "#2563eb", mr: 1 }} />
                      <Typography variant="body1">
                        <strong>Date:</strong>{" "}
                        {new Date(complaint.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Progress Bar */}
                  <Box sx={{ mt: 4 }}>
                    <Typography sx={{ fontWeight: 600, mb: 1 }}>
                      Status: {complaint.status}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={getProgressValue(complaint.status)}
                      sx={{
                        height: 12,
                        borderRadius: 6,
                        bgcolor: "#e2e8f0",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: getProgressColor(complaint.status),
                        },
                      }}
                    />
                  </Box>

                  {/* Timeline Section */}
                  {complaint.officerUpdates &&
                    complaint.officerUpdates.length > 0 && (
                      <Box sx={{ mt: 5 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            mb: 2,
                            fontWeight: 700,
                            color: "#1e3a8a",
                            textAlign: "center",
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                          }}
                        >
                          Complaint Action History
                        </Typography>

                        <Timeline position="alternate">
                          {complaint.officerUpdates.map((h, i) => {
                            const isLast =
                              i === complaint.officerUpdates.length - 1;

                            const colorMap = {
                              Resolved: "#16a34a",
                              "In Progress": "#2563eb",
                              Rejected: "#dc2626",
                              Forwarded: "#7e22ce",
                              Pending: "#ca8a04",
                            };

                            return (
                              <TimelineItem key={i}>
                                <TimelineSeparator>
                                  <TimelineDot
                                    sx={{
                                      background:
                                        colorMap[h.status] || "#ca8a04",
                                      boxShadow: isLast
                                        ? `0 0 18px ${
                                            colorMap[h.status] ||
                                            "rgba(234,179,8,0.8)"
                                          }`
                                        : "none",
                                      "@keyframes pulse": {
                                        "0%": {
                                          boxShadow: "0 0 0 0 rgba(0,0,0,0.3)",
                                        },
                                        "70%": {
                                          boxShadow: `0 0 0 10px ${
                                            colorMap[h.status] ||
                                            "rgba(0,0,0,0)"
                                          }`,
                                        },
                                        "100%": {
                                          boxShadow: "0 0 0 0 rgba(0,0,0,0)",
                                        },
                                      },
                                      animation: isLast
                                        ? "pulse 1.8s infinite"
                                        : "none",
                                    }}
                                  />
                                  {i < complaint.officerUpdates.length - 1 && (
                                    <TimelineConnector
                                      sx={{
                                        bgcolor:
                                          colorMap[h.status] || "#eab308",
                                        opacity: 0.8,
                                        height: 50,
                                      }}
                                    />
                                  )}
                                </TimelineSeparator>

                                <TimelineContent>
                                  <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                      duration: 0.4,
                                      delay: i * 0.1,
                                    }}
                                  >
                                    <Paper
                                      elevation={4}
                                      sx={{
                                        p: 2.5,
                                        borderRadius: 3,
                                        background:
                                          h.status === "Resolved"
                                            ? "linear-gradient(135deg,#dcfce7,#bbf7d0)"
                                            : h.status === "In Progress"
                                            ? "linear-gradient(135deg,#dbeafe,#bfdbfe)"
                                            : h.status === "Rejected"
                                            ? "linear-gradient(135deg,#fee2e2,#fecaca)"
                                            : h.status === "Forwarded"
                                            ? "linear-gradient(135deg,#ede9fe,#ddd6fe)"
                                            : "linear-gradient(135deg,#fef9c3,#fde68a)",
                                        borderLeft: `6px solid ${
                                          colorMap[h.status] || "#ca8a04"
                                        }`,
                                        color: "#111827",
                                        boxShadow: isLast
                                          ? "0 8px 20px rgba(0,0,0,0.15)"
                                          : "0 4px 10px rgba(0,0,0,0.08)",
                                        transform: isLast
                                          ? "scale(1.02)"
                                          : "scale(1)",
                                        transition: "all 0.3s ease",
                                      }}
                                    >
                                      <Typography
                                        variant="subtitle1"
                                        fontWeight={700}
                                      >
                                        <PersonIcon
                                          fontSize="small"
                                          sx={{
                                            mr: 1,
                                            verticalAlign: "middle",
                                          }}
                                        />
                                        {h.updatedBy?.firstName
                                          ? `${h.updatedBy.firstName} ${h.updatedBy.lastName}`
                                          : "Officer"}{" "}
                                        — <strong>{h.status}</strong>
                                      </Typography>

                                      <Typography
                                        variant="body2"
                                        sx={{
                                          mt: 0.5,
                                          color: "#374151",
                                        }}
                                      >
                                        Remark:{" "}
                                        {h.remarks || "No remark provided"}
                                      </Typography>

                                      <Typography
                                        variant="caption"
                                        sx={{
                                          display: "block",
                                          mt: 0.5,
                                          color: "#6b7280",
                                        }}
                                      >
                                        {new Date(h.date).toLocaleString()}
                                      </Typography>

                                      {h.attachment && (
                                        <Box sx={{ mt: 1 }}>
                                          <Button
                                            href={`${backendBase}/${h.attachment}`}
                                            target="_blank"
                                            startIcon={<AttachFileIcon />}
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                              mt: 1,
                                              borderColor: "#1e3a8a",
                                              color: "#1e3a8a",
                                              fontWeight: 600,
                                              "&:hover": {
                                                bgcolor: "#eff6ff",
                                                borderColor: "#1d4ed8",
                                              },
                                            }}
                                          >
                                            View Attachment
                                          </Button>
                                        </Box>
                                      )}
                                    </Paper>
                                  </motion.div>
                                </TimelineContent>
                              </TimelineItem>
                            );
                          })}
                        </Timeline>
                      </Box>
                    )}
                </Box>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Footer Info */}
        <Typography
          variant="body2"
          align="center"
          sx={{
            mt: 4,
            color: "#475569",
            fontStyle: "italic",
            fontSize: "0.85rem",
          }}
        >
          District e-Governance System – SJD Portal © {new Date().getFullYear()}{" "}
          | Complaint Tracking Interface
        </Typography>
      </Container>
    </Box>
  );
}
