import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Box,
  CircularProgress,
  TextField,
  Alert,
  Divider,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import EventIcon from "@mui/icons-material/Event";
import DescriptionIcon from "@mui/icons-material/Description";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import axios from "../../../api/axiosConfig";

export default function MyVisits() {
  const [visits, setVisits] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [file, setFile] = useState(null);
  const [remark, setRemark] = useState("");
  const [message, setMessage] = useState("");

  const backendBase = "http://localhost:5000/uploads";

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const { data } = await axios.get("/officer/visits");
        setVisits(data.visits || []);
        setFiltered(data.visits || []);
      } catch (err) {
        console.error("❌ Failed to fetch visits:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVisits();
  }, []);

  const handleMarkComplete = async (visitId) => {
    if (!remark.trim()) {
      return setMessage("⚠️ Please add a remark before completing the visit.");
    }

    const formData = new FormData();
    formData.append("remark", remark);
    if (file) formData.append("proof", file);

    try {
      setMessage("");
      await axios.put(`/officer/visits/${visitId}/complete`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ Visit marked as completed successfully!");
      setVisits((prev) =>
        prev.map((v) =>
          v._id === visitId ? { ...v, status: "Completed" } : v
        )
      );
      setRemark("");
      setFile(null);
      setSelectedVisit(null);
    } catch (err) {
      console.error("❌ Visit completion failed:", err);
      setMessage("❌ Failed to mark visit complete. Try again.");
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Scheduled":
        return "info";
      default:
        return "default";
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress sx={{ color: "#1e3a8a" }} />
      </Box>
    );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          color: "#1e3a8a",
          mb: 3,
          textAlign: "center",
          textTransform: "uppercase",
        }}
      >
        My Field Visits
      </Typography>

      {message && (
        <Alert
          severity={message.includes("✅") ? "success" : "warning"}
          sx={{ mb: 3 }}
        >
          {message}
        </Alert>
      )}

      {filtered.length === 0 ? (
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            color: "#64748b",
            mt: 4,
          }}
        >
          No visits scheduled yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filtered.map((v) => (
            <Grid item xs={12} md={6} lg={4} key={v._id}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-6px)" },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#1e3a8a", mb: 1 }}
                  >
                    {v.title || "Village Visit"}
                  </Typography>
                  <Chip
                    label={v.status}
                    color={statusColor(v.status)}
                    sx={{ fontWeight: 600, mb: 2 }}
                  />

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <PlaceIcon sx={{ color: "#2563eb", mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Location:</strong> {v.location || "N/A"}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <EventIcon sx={{ color: "#2563eb", mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Date:</strong>{" "}
                      {new Date(v.visitDate).toLocaleString()}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <DescriptionIcon sx={{ color: "#2563eb", mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Purpose:</strong> {v.purpose || "—"}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {v.status === "Scheduled" ? (
                    selectedVisit === v._id ? (
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                          label="Remarks"
                          multiline
                          rows={3}
                          value={remark}
                          onChange={(e) => setRemark(e.target.value)}
                          placeholder="Add your remark about the visit..."
                        />

                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<AttachFileIcon />}
                        >
                          Upload Proof
                          <input
                            type="file"
                            hidden
                            accept="image/*,.pdf"
                            onChange={(e) => setFile(e.target.files[0])}
                          />
                        </Button>

                        {file && (
                          <Typography variant="body2" color="text.secondary">
                            Selected: {file.name}
                          </Typography>
                        )}

                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Button
                            variant="contained"
                            startIcon={<DoneAllIcon />}
                            sx={{
                              bgcolor: "#22c55e",
                              "&:hover": { bgcolor: "#16a34a" },
                            }}
                            onClick={() => handleMarkComplete(v._id)}
                          >
                            Mark Complete
                          </Button>

                          <Button
                            variant="outlined"
                            onClick={() => setSelectedVisit(null)}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Button
                        variant="contained"
                        startIcon={<DoneAllIcon />}
                        sx={{
                          bgcolor: "#1e3a8a",
                          "&:hover": { bgcolor: "#1d4ed8" },
                        }}
                        onClick={() => setSelectedVisit(v._id)}
                      >
                        Mark as Completed
                      </Button>
                    )
                  ) : (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" sx={{ color: "#22c55e" }}>
                        ✅ Completed on:{" "}
                        {new Date(v.completedAt).toLocaleString()}
                      </Typography>
                      {v.proof && (
                        <Box sx={{ mt: 2 }}>
                          {/\.(jpg|jpeg|png)$/i.test(v.proof) ? (
                            <img
                              src={`${backendBase}/${v.proof}`}
                              alt="proof"
                              style={{
                                width: "100%",
                                borderRadius: 10,
                                border: "1px solid #e2e8f0",
                              }}
                            />
                          ) : (
                            <iframe
                              src={`${backendBase}/${v.proof}`}
                              width="100%"
                              height="250px"
                              title="proof"
                              style={{
                                borderRadius: 10,
                                border: "1px solid #e2e8f0",
                              }}
                            ></iframe>
                          )}
                        </Box>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
