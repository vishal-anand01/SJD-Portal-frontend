import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import CategoryIcon from "@mui/icons-material/Category";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import useAuth from "../../../hooks/useAuth";
import axios from "../../../api/axiosConfig";
import jsPDF from "jspdf";

export default function MyComplaints() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [open, setOpen] = useState(false);
  const [fileError, setFileError] = useState("");

  const backendBase = "http://localhost:5000/uploads";

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
      default:
        return "default";
    }
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        if (user) {
          // 1️⃣ Pehle logged-in wale complaints
          const { data } = await axios.get("/complaints");
          let list = data?.complaints || [];

          // 2️⃣ Agar list khali ho, to mobile se bhi try karo
          if (!list.length) {
            let mobile = (
              user.phone ||
              localStorage.getItem("publicMobile") ||
              ""
            ).trim();

            if (!mobile) {
              const inputMobile = prompt(
                "Enter your registered mobile number to view complaints:"
              );
              if (inputMobile) {
                mobile = inputMobile.trim();
                localStorage.setItem("publicMobile", mobile);
              }
            }

            if (mobile) {
              const { data: data2 } = await axios.get(
                `/public/complaints/${mobile}`
              );
              list = data2?.complaints || [];
            }
          }

          setComplaints(list);
        } else {
          // 🔹 Pure public user (not logged in)
          let mobile = (localStorage.getItem("publicMobile") || "").trim();

          if (!mobile) {
            const inputMobile = prompt(
              "Enter your registered mobile number to view complaints:"
            );
            if (inputMobile) {
              mobile = inputMobile.trim();
              localStorage.setItem("publicMobile", mobile);
            }
          }

          if (mobile) {
            const { data } = await axios.get(`/public/complaints/${mobile}`);
            setComplaints(data?.complaints || []);
          } else {
            setComplaints([]);
          }
        }
      } catch (err) {
        console.error("❌ Error fetching complaints:", err);
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [user]);

  const handleViewDetails = (complaint) => {
    setFileError("");
    setSelectedComplaint(complaint);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedComplaint(null);
    setFileError("");
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

  // 🧾 Generate Complaint PDF
  const handleDownloadPDF = async (complaint) => {
    try {
      const pdf = new jsPDF("p", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 40;
      let y = 60;

      // Title
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(22);
      pdf.text("Complaint Report", pageWidth / 2, y, { align: "center" });
      y += 40;

      // Complaint Details
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);

      const addLine = (label, value) => {
        pdf.text(`${label}: ${value || "N/A"}`, margin, y);
        y += 20;
      };

      addLine("Tracking ID", `#${complaint.trackingId}`);
      addLine("Title", complaint.title);
      addLine("Description", complaint.description);
      addLine("Category", complaint.category);
      addLine("Location", complaint.location);
      addLine("Status", complaint.status);
      addLine("Date", new Date(complaint.createdAt).toLocaleString());
      y += 10;

      // 📎 Attachment Image (if available)
      const attachments = getAttachments(complaint.attachments);
      const firstImage = attachments.find((f) => isImage(f));

      if (firstImage) {
        const imgUrl = `${backendBase}/${firstImage}`;
        const imgData = await fetch(imgUrl)
          .then((res) => res.blob())
          .then(
            (blob) =>
              new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
              })
          );

        y += 20;
        const imgHeight = 180;
        pdf.addImage(
          imgData,
          "JPEG",
          margin,
          y,
          pageWidth - margin * 2,
          imgHeight
        );
        y += imgHeight + 20;
      }

      // Footer
      pdf.setFontSize(10);
      pdf.setTextColor("#555");
      pdf.text(
        "Generated from SJD Portal © " + new Date().getFullYear(),
        pageWidth / 2,
        pdf.internal.pageSize.getHeight() - 30,
        { align: "center" }
      );

      pdf.save(`Complaint_${complaint.trackingId}.pdf`);
    } catch (error) {
      console.error("❌ PDF Generation Error:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 800,
          color: "#1e3a8a",
          textAlign: "center",
          textTransform: "uppercase",
        }}
      >
        My Complaints
      </Typography>

      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
            <CircularProgress sx={{ color: "#1e3a8a" }} />
          </Box>
        ) : complaints.length === 0 ? (
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              p: 4,
              color: "#64748b",
            }}
          >
            You haven’t submitted any complaints yet.
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead
                sx={{
                  background:
                    "linear-gradient(90deg, #1e3a8a 0%, #2563eb 50%, #38bdf8 100%)",
                }}
              >
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: 700 }}>
                    #
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700 }}>
                    Tracking ID
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700 }}>
                    Title
                  </TableCell>
                 
                  <TableCell sx={{ color: "white", fontWeight: 700 }}>
                    Location
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700 }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700 }}>
                    Date
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "white", fontWeight: 700 }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {complaints.map((c, index) => (
                  <TableRow key={c._id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      #{c.trackingId}
                    </TableCell>
                    <TableCell>{c.title}</TableCell>
                    
                    <TableCell>{c.location || "N/A"}</TableCell>
                    <TableCell>
                      <Chip
                        label={c.status}
                        color={statusColor(c.status)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewDetails(c)}
                        sx={{
                          bgcolor: "#1e3a8a",
                          fontWeight: 600,
                          borderRadius: 2,
                          "&:hover": { bgcolor: "#1d4ed8" },
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* 🔷 Complaint Details Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            fontWeight: 800,
            textAlign: "center",
            py: 2,
            background:
              "linear-gradient(90deg, #1e3a8a 0%, #2563eb 50%, #38bdf8 100%)",
            color: "white",
          }}
        >
          Complaint Details
        </DialogTitle>

        {selectedComplaint && (
          <DialogContent sx={{ py: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {selectedComplaint.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Tracking ID: #{selectedComplaint.trackingId}
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
              {selectedComplaint.description}
            </Typography>

            {/* 🧷 Attachments Section */}
            {(() => {
              const files = getAttachments(selectedComplaint.attachments);

              if (files.length === 0) {
                return (
                  <Alert severity="info" sx={{ mt: 3 }}>
                    ℹ️ No attachment uploaded for this complaint.
                  </Alert>
                );
              }

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
                            onError={() =>
                              setFileError("⚠️ Unable to load image file.")
                            }
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
                            onError={() =>
                              setFileError("⚠️ Unable to load PDF file.")
                            }
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

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CategoryIcon sx={{ color: "#2563eb", mr: 1 }} />
                <Typography variant="body1">
                  <strong>Category:</strong> {selectedComplaint.category}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PlaceIcon sx={{ color: "#2563eb", mr: 1 }} />
                <Typography variant="body1">
                  <strong>Location:</strong>{" "}
                  {selectedComplaint.location || "N/A"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AccessTimeIcon sx={{ color: "#2563eb", mr: 1 }} />
                <Typography variant="body1">
                  <strong>Date:</strong>{" "}
                  {new Date(selectedComplaint.createdAt).toLocaleString()}
                </Typography>
              </Box>

              <Chip
                label={selectedComplaint.status}
                color={statusColor(selectedComplaint.status)}
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </DialogContent>
        )}

        <DialogActions sx={{ justifyContent: "center", py: 2, gap: 2 }}>
          {selectedComplaint && (
            <Button
              onClick={() => handleDownloadPDF(selectedComplaint)}
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
          )}

          <Button
            onClick={handleClose}
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
    </Container>
  );
}
