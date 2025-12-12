import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Divider,
  Box,
  Button,
  Chip,
  Paper,
  Alert,
} from "@mui/material";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import PersonIcon from "@mui/icons-material/Person";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import CategoryIcon from "@mui/icons-material/Category";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Row, Col } from "react-bootstrap";

export default function ViewComplaintDialog({
  open,
  complaint,
  onClose,
  baseURL,
}) {
  const [fileError, setFileError] = useState("");

  if (!complaint) return null;

  const statusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "success";
      case "Pending":
        return "warning";
      case "In Progress":
        return "info";
      case "Rejected":
        return "error";
      case "Forwarded":
        return "secondary";
      default:
        return "default";
    }
  };

  const isImage = (file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file);
  const isPDF = (file) => /\.pdf$/i.test(file);

  const attachmentUrl = complaint.attachments
    ? `${baseURL}/uploads/${complaint.attachments}`
    : null;

  const isOfficerComplaint = complaint.sourceType === "Officer";

  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      {/* HEADER */}
      <DialogTitle
        sx={{
          background:
            "linear-gradient(90deg,#1e3a8a 0%,#2563eb 50%,#38bdf8 100%)",
          color: "white",
          fontWeight: 700,
          textAlign: "center",
          py: 2,
        }}
      >
        Complaint Details
      </DialogTitle>

      <DialogContent dividers>
        {/* ==========================
            CITIZEN INFORMATION
        =========================== */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            background: "linear-gradient(135deg,#f0f7ff,#ffffff)",
            border: "1px solid #bfdbfe",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#1e3a8a",
              fontWeight: 700,
              mb: 2,
              display: "flex",
              alignItems: "center",
            }}
          >
            <PersonIcon sx={{ mr: 1 }} /> Citizen Information
          </Typography>

          <Row className="gy-2">
            {isOfficerComplaint ? (
              <>
                <Col md={6}>
                  <b>Name:</b> {complaint.citizenName}
                </Col>
                <Col md={6}>
                  <b>Mobile:</b> {complaint.citizenMobile}
                </Col>
                <Col md={6}>
                  <b>Date of Birth:</b>{" "}
                  {complaint.citizenDob
                    ? new Date(complaint.citizenDob).toLocaleDateString()
                    : "N/A"}
                </Col>
                <Col md={6}>
                  <b>Village:</b> {complaint.village}
                </Col>
                <Col md={6}>
                  <b>District:</b> {complaint.district}
                </Col>
                <Col md={6}>
                  <b>State:</b> {complaint.state}
                </Col>
              </>
            ) : (
              <>
                <Col md={6}>
                  <b>Name:</b>{" "}
                  {`${complaint?.citizen?.firstName || ""} ${
                    complaint?.citizen?.lastName || ""
                  }`}
                </Col>
                <Col md={6}>
                  <b>Email:</b> {complaint?.citizen?.email}
                </Col>
                <Col md={6}>
                  <b>Phone:</b> {complaint?.citizen?.phone}
                </Col>
                <Col md={6}>
                  <b>Gender:</b> {complaint?.citizen?.gender}
                </Col>
              </>
            )}
          </Row>
        </Paper>

        {/* ==========================
            FILED BY (Officer)
        =========================== */}
        {isOfficerComplaint && complaint.filedBy && (
          <Paper
            elevation={2}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
              background: "#f8fafc",
              border: "1px solid #d1d5db",
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
              <AccountBoxIcon sx={{ mr: 1 }} /> Filed By Officer
            </Typography>

            <Row className="gy-2">
              <Col md={6}>
                <b>Name:</b> {complaint.filedBy.firstName}{" "}
                {complaint.filedBy.lastName}
              </Col>
              <Col md={6}>
                <b>Email:</b> {complaint.filedBy.email}
              </Col>
              <Col md={6}>
                <b>Phone:</b> {complaint.filedBy.phone}
              </Col>
              <Col md={6}>
                <b>Designation:</b>{" "}
                {complaint.filedBy.designation || "N/A"}
              </Col>
            </Row>
          </Paper>
        )}

        {/* ==========================
            COMPLAINT DETAILS
        =========================== */}
        <Typography variant="h6" fontWeight={700}>
          {complaint.title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Tracking ID: {complaint.trackingId}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography
          sx={{
            p: 2,
            background: "#f8fafc",
            borderLeft: "4px solid #2563eb",
            borderRadius: 2,
          }}
        >
          {complaint.description}
        </Typography>

        {/* Category - Location - Date - Status */}
        <Box
          sx={{
            mt: 3,
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CategoryIcon sx={{ color: "#1e3a8a", mr: 1 }} />
            <b>Category:</b> {complaint.category}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PlaceIcon sx={{ color: "#1e3a8a", mr: 1 }} />
            <b>Location:</b> {complaint.location}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AccessTimeIcon sx={{ color: "#1e3a8a", mr: 1 }} />
            <b>Date:</b>{" "}
            {new Date(complaint.createdAt).toLocaleString()}
          </Box>

          <Chip
            label={complaint.status}
            color={statusColor(complaint.status)}
            sx={{ fontWeight: 700 }}
          />
        </Box>

        {/* ==========================
            ATTACHMENT PREVIEW
        =========================== */}
        {complaint.attachments ? (
          <Box mt={3}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                mb: 1,
              }}
            >
              <AttachFileIcon sx={{ mr: 1, color: "#2563eb" }} />
              Attachment
            </Typography>

            {/* Image */}
            {isImage(complaint.attachments) && (
              <img
                src={attachmentUrl}
                alt="Attachment"
                style={{
                  maxWidth: "100%",
                  borderRadius: 10,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
                onError={() =>
                  setFileError("Error loading attachment image")
                }
              />
            )}

            {/* PDF */}
            {isPDF(complaint.attachments) && (
              <iframe
                src={attachmentUrl}
                title="PDF"
                height="400"
                width="100%"
                style={{
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                }}
              />
            )}

            {fileError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {fileError}
              </Alert>
            )}

            <Button
              href={attachmentUrl}
              target="_blank"
              variant="outlined"
              startIcon={<AttachFileIcon />}
              sx={{
                mt: 2,
                borderColor: "#1e3a8a",
                color: "#1e3a8a",
                "&:hover": { background: "#eff6ff" },
              }}
            >
              Download
            </Button>
          </Box>
        ) : (
          <Alert severity="info" sx={{ mt: 3 }}>
            No attachment uploaded.
          </Alert>
        )}
      </DialogContent>

      {/* FOOTER */}
      <DialogActions sx={{ justifyContent: "center", py: 2 }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            bgcolor: "#1e3a8a",
            px: 4,
            fontWeight: 700,
            borderRadius: 2,
            "&:hover": { bgcolor: "#1d4ed8" },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
