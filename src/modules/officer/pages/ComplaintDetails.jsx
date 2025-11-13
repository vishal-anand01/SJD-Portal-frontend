import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Chip,
  LinearProgress,
  Button,
  CircularProgress,
  TextField,
  MenuItem,
  Alert,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import axios from "../../../api/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";

export default function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [remark, setRemark] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const backendBase = "http://localhost:5000/uploads";

  // 🧠 Fetch complaint + departments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/officer/complaints`);
        const single = data.complaints.find((c) => c._id === id);
        setComplaint(single);
        setStatus(single?.status || "");

        const deptRes = await axios.get("/departments");
        setDepartments(deptRes.data?.departments || []);
      } catch (err) {
        console.error("❌ Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // 🧩 Status Color
  const statusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "success";
      case "In Progress":
        return "info";
      case "Forwarded":
        return "secondary";
      case "Pending":
        return "warning";
      default:
        return "default";
    }
  };

  // 🟢 Update Status
  const handleUpdateStatus = async () => {
    try {
      setMessage("");
      await axios.put(`/officer/complaints/${id}/status`, { status, remark });
      setMessage("✅ Complaint status updated successfully!");
    } catch (err) {
      setMessage("❌ Failed to update status.");
    }
  };

  // 🟣 Forward to Department
  const handleForward = async () => {
    try {
      setMessage("");
      await axios.put(`/officer/complaints/${id}/forward`, {
        departmentId,
        remark,
      });
      setMessage("📤 Complaint forwarded successfully!");
    } catch (err) {
      setMessage("❌ Failed to forward complaint.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress sx={{ color: "#1e3a8a" }} />
      </Box>
    );
  }

  if (!complaint) {
    return (
      <Container sx={{ py: 5 }}>
        <Alert severity="error">Complaint not found.</Alert>
      </Container>
    );
  }

  const isImage = (f) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f || "");
  const isPDF = (f) => /\.pdf$/i.test(f || "");

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Card sx={{ borderRadius: 3, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, color: "#1e3a8a", mb: 1 }}
          >
            {complaint.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
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
          {complaint.attachments ? (
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
                <AttachFileIcon sx={{ color: "#2563eb", mr: 1 }} /> Attachment
              </Typography>
              {isImage(complaint.attachments) ? (
                <img
                  src={`${backendBase}/${complaint.attachments}`}
                  alt="Attachment"
                  style={{
                    maxWidth: "100%",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
              ) : isPDF(complaint.attachments) ? (
                <iframe
                  src={`${backendBase}/${complaint.attachments}`}
                  width="100%"
                  height="400px"
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                  }}
                ></iframe>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Unsupported file type.
                </Typography>
              )}
            </Box>
          ) : (
            <Alert severity="info" sx={{ mt: 3 }}>
              ℹ️ No attachment uploaded for this complaint.
            </Alert>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Info */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
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

            <Chip
              label={complaint.status}
              color={statusColor(complaint.status)}
              sx={{ fontWeight: 600 }}
            />
          </Box>

          {/* Progress Bar */}
          <Box sx={{ mt: 3 }}>
            <Typography sx={{ fontWeight: 600, mb: 1 }}>
              Progress
            </Typography>
            <LinearProgress
              variant="determinate"
              value={
                complaint.status === "Resolved"
                  ? 100
                  : complaint.status === "In Progress"
                  ? 60
                  : complaint.status === "Forwarded"
                  ? 40
                  : 20
              }
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: "#e2e8f0",
                "& .MuiLinearProgress-bar": {
                  bgcolor:
                    complaint.status === "Resolved"
                      ? "#22c55e"
                      : "#1e3a8a",
                },
              }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Actions */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              select
              label="Update Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {["Pending", "In Progress", "Resolved"].map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Remarks"
              multiline
              rows={3}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Add your remarks here..."
            />

            <Button
              variant="contained"
              onClick={handleUpdateStatus}
              sx={{
                bgcolor: "#1e3a8a",
                "&:hover": { bgcolor: "#1d4ed8" },
              }}
            >
              Update Status
            </Button>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Forward to Department
            </Typography>
            <TextField
              select
              label="Select Department"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
            >
              {departments.map((d) => (
                <MenuItem key={d._id} value={d._id}>
                  {d.name}
                </MenuItem>
              ))}
            </TextField>

            <Button
              variant="outlined"
              onClick={handleForward}
              sx={{
                borderColor: "#8b5cf6",
                color: "#8b5cf6",
                "&:hover": { bgcolor: "#f5f3ff" },
              }}
            >
              Forward Complaint
            </Button>

            {message && (
              <Alert
                severity={message.includes("✅") ? "success" : "error"}
                sx={{ mt: 2 }}
              >
                {message}
              </Alert>
            )}

            <Button
              variant="outlined"
              sx={{ mt: 2, borderColor: "#1e3a8a", color: "#1e3a8a" }}
              onClick={() => navigate(-1)}
            >
              ← Back
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
