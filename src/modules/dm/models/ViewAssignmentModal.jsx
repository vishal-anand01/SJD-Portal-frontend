import React from "react";
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
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import NotesIcon from "@mui/icons-material/Notes";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WcIcon from "@mui/icons-material/Wc";
import PinDropIcon from "@mui/icons-material/PinDrop";
import PublicIcon from "@mui/icons-material/Public";
import WorkIcon from "@mui/icons-material/Work";
import { Row, Col } from "react-bootstrap";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";

export default function ViewAssignmentModal({ open, onClose, assignment }) {
  if (!assignment) return null;

  const officer = assignment.officer || {};
  const dm = assignment.dm || {};

  const handleDownloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    // HEADER
    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, 210, 25, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("SJD PORTAL - ASSIGNMENT REPORT", 105, 15, { align: "center" });

    // ASSIGNMENT INFO
    doc.setTextColor(0);
    doc.setFontSize(13);
    doc.text("Assignment Details", 14, 35);
    autoTable(doc, {
      startY: 40,
      theme: "grid",
      headStyles: { fillColor: [30, 58, 138], textColor: 255 },
      styles: { fontSize: 11, cellPadding: 3 },
      body: [
        ["District", assignment.location?.district || "N/A"],
        ["Gram Panchayat", assignment.location?.gramPanchayat || "N/A"],
        ["Village", assignment.location?.village || "N/A"],
        ["Priority", assignment.priority || "N/A"],
        [
          "Visit Date",
          assignment.visitDate
            ? dayjs(assignment.visitDate).format("DD MMM YYYY")
            : "N/A",
        ],
        ["Status", assignment.status || "Assigned"],
      ],
    });

    const nextY = doc.lastAutoTable.finalY + 10;

    // OFFICER INFO
    doc.text("Officer Information", 14, nextY);
    autoTable(doc, {
      startY: nextY + 5,
      theme: "grid",
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      styles: { fontSize: 11, cellPadding: 3 },
      body: [
        ["Name", `${officer.firstName || ""} ${officer.lastName || ""}`],
        ["Email", officer.email || "N/A"],
        ["Phone", officer.phone || "N/A"],
        ["Gender", officer.gender || "N/A"],
        [
          "Date of Birth",
          officer.dob ? dayjs(officer.dob).format("DD MMM YYYY") : "N/A",
        ],
        ["Address", officer.address || "N/A"],
        ["City", officer.city || "N/A"],
        ["State", officer.state || "N/A"],
        ["Country", officer.country || "N/A"],
        ["Pincode", officer.pincode || "N/A"],
        ["Role", officer.role || "Officer"],
        [
          "Joined On",
          officer.createdAt
            ? dayjs(officer.createdAt).format("DD MMM YYYY")
            : "N/A",
        ],
        [
          "Last Active",
          officer.lastActiveAt
            ? dayjs(officer.lastActiveAt).format("DD MMM YYYY HH:mm")
            : "—",
        ],
        ["Officer ID", officer._id || "N/A"],
      ],
    });

    const nextY2 = doc.lastAutoTable.finalY + 10;

    // DM INFO
    doc.text("Assigned By (DM)", 14, nextY2);
    autoTable(doc, {
      startY: nextY2 + 5,
      theme: "grid",
      headStyles: { fillColor: [51, 65, 85], textColor: 255 },
      styles: { fontSize: 11, cellPadding: 3 },
      body: [
        ["Name", `${dm.firstName || ""} ${dm.lastName || ""}`],
        ["Email", dm.email || "N/A"],
        [
          "Assigned At",
          assignment.createdAt
            ? dayjs(assignment.createdAt).format("DD MMM YYYY, hh:mm A")
            : "N/A",
        ],
      ],
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.text("Notes / Instructions", 14, finalY);
    doc.setFont("helvetica", "normal");
    doc.text(
      assignment.notes || "No additional instructions provided.",
      14,
      finalY + 6,
      {
        maxWidth: 180,
      }
    );

    doc.save(`Assignment_${assignment._id}.pdf`);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          background:
            "linear-gradient(90deg,#1e3a8a 0%,#2563eb 50%,#38bdf8 100%)",
          color: "white",
          textAlign: "center",
          fontWeight: 700,
          py: 2,
        }}
      >
        Assignment Details
      </DialogTitle>

      <DialogContent dividers>
        {/* ===== ASSIGNMENT DETAILS ===== */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            background: "linear-gradient(135deg, #eff6ff, #ffffff)",
            border: "1px solid #bfdbfe",
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
            <AssignmentIndIcon sx={{ mr: 1 }} /> Assignment Overview
          </Typography>

          <Row className="gy-2 gx-3">
            <Col md={6}>
              <Typography variant="body2">
                <strong>District:</strong>{" "}
                {assignment.location?.district || "N/A"}
              </Typography>
            </Col>
            <Col md={6}>
              <Typography variant="body2">
                <strong>Gram Panchayat:</strong>{" "}
                {assignment.location?.gramPanchayat || "N/A"}
              </Typography>
            </Col>
            <Col md={6}>
              <Typography variant="body2">
                <strong>Village:</strong>{" "}
                {assignment.location?.village || "N/A"}
              </Typography>
            </Col>
            <Col md={6}>
              <Typography
                variant="body2"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <PriorityHighIcon sx={{ mr: 1, color: "#dc2626" }} />
                <strong>Priority:</strong>&nbsp;
                <Chip
                  label={assignment.priority}
                  sx={{
                    fontWeight: 600,
                    color:
                      assignment.priority === "High"
                        ? "#b91c1c"
                        : assignment.priority === "Medium"
                        ? "#b45309"
                        : "#166534",
                    backgroundColor:
                      assignment.priority === "High"
                        ? "#fee2e2"
                        : assignment.priority === "Medium"
                        ? "#fef3c7"
                        : "#dcfce7",
                  }}
                />
              </Typography>
            </Col>
            <Col md={6}>
              <Typography variant="body2">
                <CalendarMonthIcon sx={{ color: "#2563eb", mr: 1 }} />
                <strong>Visit Date:</strong>{" "}
                {dayjs(assignment.visitDate).format("DD MMM YYYY")}
              </Typography>
            </Col>
            <Col md={6}>
              <Typography variant="body2">
                <AccessTimeIcon sx={{ color: "#2563eb", mr: 1 }} />
                <strong>Assigned At:</strong>{" "}
                {dayjs(assignment.createdAt).format("DD MMM YYYY, hh:mm A")}
              </Typography>
            </Col>
          </Row>
        </Paper>

        {/* ===== OFFICER DETAILS (FULL) ===== */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            border: "1px solid #cbd5e1",
            background: "#f8fafc",
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
            <PersonIcon sx={{ mr: 1 }} /> Officer Information
          </Typography>

          <Row className="gy-1">
            <Col md={6}>
              <Typography variant="body2">
                <strong>SJD ID:</strong> {officer.uniqueId || "—"}
              </Typography>
            </Col>
            <Col md={6}>
              <Typography variant="body2">
                <strong>Name:</strong> {officer.firstName} {officer.lastName}
              </Typography>
            </Col>
            <Col md={6}>
              <Typography variant="body2">
                <strong>Email:</strong> {officer.email || "N/A"}
              </Typography>
            </Col>
            <Col md={6}>
              <Typography variant="body2">
                <strong>Phone:</strong> {officer.phone || "N/A"}
              </Typography>
            </Col>
            <Col md={6}>
              <Typography variant="body2">
                <strong>Designation:</strong> {officer.designation || "—"}
              </Typography>
            </Col>
            <Col md={6}>
              <Typography variant="body2">
                <strong>Gender:</strong> {officer.gender || "N/A"}
              </Typography>
            </Col>
            <Col md={6}>
              <Typography variant="body2">
                <strong>Date of Birth:</strong>{" "}
                {officer.dob ? dayjs(officer.dob).format("DD MMM YYYY") : "N/A"}
              </Typography>
            </Col>
            <Col md={6} >
              <Typography variant="body2">
                <strong>Address:</strong> {officer.address || "N/A"}
              </Typography>
            </Col>
            <Col md={6}>
              <Typography variant="body2">
                <strong>City:</strong> {officer.city || "N/A"}
              </Typography>
            </Col>
            <Col md={6}>
              <Typography variant="body2">
                <strong>District:</strong> {officer.district || "N/A"}
              </Typography>
            </Col>
            <Col md={6}>
              <Typography variant="body2">
                <strong>State:</strong> {officer.state || "N/A"}
              </Typography>
            </Col>
            <Col md={6}>
              <Typography variant="body2">
                <strong>Country:</strong> {officer.country || "N/A"}
              </Typography>
            </Col>
            <Col md={6}>
              <Typography variant="body2">
                <strong>Pincode:</strong> {officer.pincode || "N/A"}
              </Typography>
            </Col>

            <Col md={6}>
              <Typography variant="body2">
                <strong>Register On Portal:</strong>{" "}
                {officer.createdAt
                  ? dayjs(officer.createdAt).format("DD MMM YYYY")
                  : "N/A"}
              </Typography>
            </Col>
            <Col md={6}>
              <Typography variant="body2">
                <strong>Last Active:</strong>{" "}
                {officer.lastActiveAt
                  ? dayjs(officer.lastActiveAt).format("DD MMM YYYY HH:mm")
                  : "—"}
              </Typography>
            </Col>
          </Row>
        </Paper>

        {/* ===== DM DETAILS ===== */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            background: "linear-gradient(135deg, #f0f9ff, #ffffff)",
            border: "1px solid #bae6fd",
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
            <EmailIcon sx={{ mr: 1 }} /> Assigned By (DM)
          </Typography>
          <Typography variant="body2">
            <strong>Name:</strong> {dm.firstName} {dm.lastName}
          </Typography>
          <Typography variant="body2">
            <strong>Email:</strong> {dm.email || "N/A"}
          </Typography>
        </Paper>

        {/* ===== NOTES ===== */}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "#f8fafc",
            borderLeft: "4px solid #2563eb",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            <NotesIcon sx={{ mr: 1, color: "#2563eb" }} /> Notes / Instructions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {assignment.notes || "No additional notes provided."}
          </Typography>
        </Paper>
      </DialogContent>

      {/* ===== FOOTER ===== */}
      <DialogActions sx={{ justifyContent: "center", py: 2, gap: 2 }}>
        <Button
          onClick={handleDownloadPDF}
          variant="outlined"
          sx={{
            borderColor: "#1e3a8a",
            color: "#1e3a8a",
            fontWeight: 600,
            "&:hover": { bgcolor: "#eff6ff" },
          }}
        >
          Download as PDF
        </Button>

        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: "#1e3a8a",
            px: 4,
            borderRadius: 2,
            fontWeight: 600,
            "&:hover": { bgcolor: "#1d4ed8" },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
