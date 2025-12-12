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
  Alert,
  Paper,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import WcIcon from "@mui/icons-material/Wc";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { Row, Col } from "react-bootstrap";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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
      case "In Progress":
        return "info";
      case "Pending":
        return "warning";
      case "Rejected":
        return "error";
      case "Forwarded":
        return "secondary";
      default:
        return "default";
    }
  };

  const isImage = (file) => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file || "");
  const isPDF = (file) => /\.pdf$/i.test(file || "");

  // 🧾 Generate Complaint PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    // === HEADER ===
    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, 210, 25, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text("SJD PORTAL - COMPLAINT REPORT", 105, 15, { align: "center" });

    // === CITIZEN INFO (for Public or Officer created) ===
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("Citizen Information", 14, 35);
    doc.setLineWidth(0.5);
    doc.line(14, 37, 196, 37);

    const citizenData = complaint.citizen
      ? [
          [
            "Name",
            `${complaint.citizen.firstName || ""} ${
              complaint.citizen.lastName || ""
            }`,
          ],
          ["Email", complaint.citizen.email || "N/A"],
          ["Phone", complaint.citizen.phone || "N/A"],
          ["Gender", complaint.citizen.gender || "N/A"],
          [
            "Date of Birth",
            complaint.citizen.dob
              ? new Date(complaint.citizen.dob).toLocaleDateString()
              : "N/A",
          ],
          [
            "Address",
            `${complaint.citizen.address || ""}, ${
              complaint.citizen.city || ""
            }, ${complaint.citizen.state || ""}, ${
              complaint.citizen.country || ""
            } ${complaint.citizen.pincode || ""}`,
          ],
        ]
      : [
          ["Name", complaint.citizenName || "N/A"],
          ["Mobile", complaint.citizenMobile || "N/A"],
          [
            "Date of Birth",
            complaint.citizenDob
              ? new Date(complaint.citizenDob).toLocaleDateString()
              : "N/A",
          ],
          ["Village", complaint.village || "N/A"],
          ["Block", complaint.block || "N/A"],
          ["Tehsil", complaint.tehsil || "N/A"],
          ["District", complaint.district || "N/A"],
          ["State", complaint.state || "N/A"],
          ["Pincode", complaint.pincode || "N/A"],
          ["Landmark", complaint.landmark || "N/A"],
        ];

    autoTable(doc, {
      startY: 42,
      theme: "grid",
      styles: { fontSize: 11, cellPadding: 3 },
      headStyles: { fillColor: [30, 58, 138], textColor: 255 },
      body: citizenData,
    });

    let nextY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 45;

    // === FILED BY (if Officer created) ===
    if (complaint.sourceType === "Officer" && complaint.filedBy) {
      doc.setFont("helvetica", "bold");
      doc.text("Filed By (Officer Details)", 14, nextY);
      autoTable(doc, {
        startY: nextY + 4,
        theme: "grid",
        styles: { fontSize: 11, cellPadding: 3 },
        headStyles: { fillColor: [37, 99, 235], textColor: 255 },
        body: [
          [
            "Officer Name",
            `${complaint.filedBy.firstName || ""} ${
              complaint.filedBy.lastName || ""
            }`,
          ],
          ["Email", complaint.filedBy.email || "N/A"],
          ["Role", complaint.filedBy.role || "Officer"],
        ],
      });
      nextY = doc.lastAutoTable.finalY + 10;
    }

    // === COMPLAINT INFO ===
    doc.setFont("helvetica", "bold");
    doc.text("Complaint Information", 14, nextY);
    autoTable(doc, {
      startY: nextY + 6,
      theme: "grid",
      styles: { fontSize: 11, cellPadding: 3 },
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      body: [
        ["Tracking ID", complaint.trackingId],
        ["Title", complaint.title],
        ["Location", complaint.location || "N/A"],
        ["Status", complaint.status],
        ["Date", new Date(complaint.createdAt).toLocaleString()],
      ],
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.text("Description", 14, finalY);
    doc.setFont("helvetica", "normal");
    doc.text(
      complaint.description || "No description provided.",
      14,
      finalY + 7,
      {
        maxWidth: 180,
      }
    );

    doc.save(`${complaint.trackingId}_ComplaintReport.pdf`);
  };

  const attachmentFile = complaint.attachments
    ? `${baseURL}/uploads/${complaint.attachments}`
    : null;

  const isOfficerComplaint = complaint.sourceType === "Officer";

  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      {/* === HEADER === */}
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
        Complaint Details
      </DialogTitle>

      <DialogContent dividers>
        {/* === CITIZEN DETAILS === */}
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
            <PersonIcon sx={{ mr: 1 }} /> Citizen Information
          </Typography>

          <Row className="gy-2 gx-3">
            {/* ⭐ Officer Filed Complaint */}
            {isOfficerComplaint && (
              <>
                <Col md={6}>
                  <Typography variant="body2">
                    <strong>Name:</strong> {complaint?.citizenName || "N/A"}
                  </Typography>
                </Col>

                <Col md={6}>
                  <Typography variant="body2">
                    <strong>Mobile:</strong> {complaint?.citizenMobile || "N/A"}
                  </Typography>
                </Col>

                <Col md={6}>
                  <Typography variant="body2">
                    <strong>Date of Birth:</strong>{" "}
                    {complaint?.citizenDob
                      ? new Date(complaint.citizenDob).toLocaleDateString()
                      : "N/A"}
                  </Typography>
                </Col>

                <Col md={6}>
                  <Typography variant="body2">
                    <strong>Village:</strong> {complaint?.village || "N/A"}
                  </Typography>
                </Col>

                <Col md={6}>
                  <Typography variant="body2">
                    <strong>Block:</strong> {complaint?.block || "N/A"}
                  </Typography>
                </Col>

                <Col md={6}>
                  <Typography variant="body2">
                    <strong>Tehsil:</strong> {complaint?.tehsil || "N/A"}
                  </Typography>
                </Col>

                <Col md={6}>
                  <Typography variant="body2">
                    <strong>District:</strong> {complaint?.district || "N/A"}
                  </Typography>
                </Col>

                <Col md={6}>
                  <Typography variant="body2">
                    <strong>State:</strong> {complaint?.state || "N/A"}
                  </Typography>
                </Col>

                <Col md={6}>
                  <Typography variant="body2">
                    <strong>Pincode:</strong> {complaint?.pincode || "N/A"}
                  </Typography>
                </Col>

                <Col md={12}>
                  <Typography variant="body2">
                    <strong>Landmark:</strong> {complaint?.landmark || "N/A"}
                  </Typography>
                </Col>
              </>
            )}

            {/* ⭐ Public Complaint (WITHOUT login) */}
            {!isOfficerComplaint && !complaint?.citizen && (
              <>
                <Col md={6}>
                  <Typography variant="body2">
                    <strong>Name:</strong> {complaint?.citizenName || "N/A"}
                  </Typography>
                </Col>

                <Col md={6}>
                  <Typography variant="body2">
                    <strong>Mobile:</strong> {complaint?.citizenMobile || "N/A"}
                  </Typography>
                </Col>

                <Col md={6}>
                  <Typography variant="body2">
                    <strong>Date of Birth:</strong>{" "}
                    {complaint?.citizenDob
                      ? new Date(complaint.citizenDob).toLocaleDateString()
                      : "N/A"}
                  </Typography>
                </Col>
              </>
            )}

            {/* ⭐ Public Complaint logged-in CITIZEN (through User object) */}
            {!isOfficerComplaint && complaint?.citizen && (
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
                    <strong>Email:</strong> {complaint.citizen.email || "N/A"}
                  </Typography>
                </Col>

                <Col md={6}>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {complaint.citizen.phone || "N/A"}
                  </Typography>
                </Col>

                <Col md={6}>
                  <Typography variant="body2">
                    <strong>Gender:</strong> {complaint.citizen.gender || "N/A"}
                  </Typography>
                </Col>
              </>
            )}
          </Row>
        </Paper>

        {/* === FILED BY (only for officer complaint) === */}
        {isOfficerComplaint && complaint.filedBy && (
          <Paper
            elevation={3}
            sx={{
              p: 2,
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
                mb: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <AccountBoxIcon sx={{ mr: 1 }} /> Filed By (Officer)
            </Typography>

            {/* Row Start */}
            {/* Row Start */}
            <div className="row gy-2">
              {/* SJD ID */}
              <div className="col-md-6">
                <Typography variant="body2">
                  <strong>SJD ID:</strong> {complaint.filedBy.uniqueId}
                </Typography>
              </div>

              {/* Name */}
              <div className="col-md-6">
                <Typography variant="body2">
                  <strong>Name:</strong>{" "}
                  {`${complaint.filedBy.firstName} ${complaint.filedBy.lastName}`}
                </Typography>
              </div>

              {/* Email */}
              <div className="col-md-6">
                <Typography variant="body2">
                  <strong>Email:</strong> {complaint.filedBy.email}
                </Typography>
              </div>

              {/* Phone */}
              <div className="col-md-6">
                <Typography variant="body2">
                  <strong>Phone Number:</strong> {complaint.filedBy.phone}
                </Typography>
              </div>

              {/* ⭐ Designation (New) */}
              <div className="col-md-6">
                <Typography variant="body2">
                  <strong>Designation:</strong>{" "}
                  {complaint.filedBy.designation || "—"}
                </Typography>
              </div>
            </div>
          </Paper>
        )}

        {/* === COMPLAINT DETAILS === */}
        <Typography variant="h6" fontWeight={700}>
          {complaint.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tracking ID: #{complaint.trackingId}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="body1"
          sx={{
            p: 2,
            bgcolor: "#f8fafc",
            borderRadius: 2,
            borderLeft: "4px solid #2563eb",
          }}
        >
          {complaint.description}
        </Typography>

        {/* ===  LOCATION / DATE === */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mt: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PlaceIcon sx={{ color: "#2563eb", mr: 1 }} />
            <Typography>
              <strong>Location:</strong> {complaint.location || ""}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AccessTimeIcon sx={{ color: "#2563eb", mr: 1 }} />
            <Typography>
              <strong>Date:</strong>{" "}
              {new Date(complaint.createdAt).toLocaleString()}
            </Typography>
          </Box>

          <Chip
            label={complaint.status}
            color={statusColor(complaint.status)}
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {/* === ATTACHMENTS === */}
        {complaint.attachments ? (
          <Box mt={3}>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              sx={{ display: "flex", alignItems: "center", mb: 1 }}
            >
              <AttachFileIcon sx={{ mr: 1, color: "#2563eb" }} /> Attachment:
            </Typography>

            {isImage(complaint.attachments) && (
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <img
                  src={attachmentFile}
                  alt="Attachment Preview"
                  style={{
                    maxWidth: "100%",
                    borderRadius: 10,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  onError={() => setFileError("⚠️ Unable to load image.")}
                />
              </Box>
            )}

            {isPDF(complaint.attachments) && (
              <Box sx={{ mt: 2 }}>
                <iframe
                  src={attachmentFile}
                  title="PDF Preview"
                  width="100%"
                  height="400px"
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 10,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                  onError={() => setFileError("⚠️ Unable to load PDF file.")}
                ></iframe>
              </Box>
            )}

            {fileError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {fileError}
              </Alert>
            )}

            <Button
              href={attachmentFile}
              target="_blank"
              variant="outlined"
              startIcon={<AttachFileIcon />}
              sx={{
                mt: 2,
                borderColor: "#1e3a8a",
                color: "#1e3a8a",
                fontWeight: 600,
                "&:hover": { bgcolor: "#eff6ff" },
              }}
            >
              Download Attachment
            </Button>
          </Box>
        ) : (
          <Alert severity="info" sx={{ mt: 3 }}>
            ℹ️ No attachment uploaded for this complaint.
          </Alert>
        )}
      </DialogContent>

      {/* === FOOTER === */}
      <DialogActions sx={{ justifyContent: "center", py: 2, gap: 2 }}>
        <Button
          onClick={handleDownloadPDF}
          variant="outlined"
          startIcon={<AttachFileIcon />}
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
