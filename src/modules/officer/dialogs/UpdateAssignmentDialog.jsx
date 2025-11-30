import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Divider,
  LinearProgress,
  Paper,
  Chip,
  Box,
  Fade,
} from "@mui/material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SendIcon from "@mui/icons-material/Send";
import axios from "../../../api/axiosConfig";

// ------------------- PREMIUM COLORS -------------------
const primaryColor = "#1e3a8a";
const lightBlue = "#eff6ff";
const gold = "#fbbf24";

export default function UpdateVisitDialog({
  open,
  assignment,
  onClose,
  refresh,
}) {
  const [form, setForm] = useState({
    actualVisitDate: "",
    remarks: "",
    proofFile: null,
    stats: {
      total: 0,
      solved: 0,
      pending: 0,
      forwarded: 0,
      rejected: 0,
      inProgress: 0,
    },
  });

  const [visitComplaints, setVisitComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🌟 Load complaints based on visit date
  const fetchComplaintsForDate = async (date) => {
    try {
      if (!date) return;

      setLoading(true);

      const res = await axios.get(
        `/officer/visit-complaints/by-date?date=${date}`
      );

      setVisitComplaints(res.data.complaints || []);

      setForm((prev) => ({
        ...prev,
        stats: res.data.stats,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🌟 Init on open
  useEffect(() => {
    if (assignment) {
      setForm({
        actualVisitDate: assignment.visitReport?.actualVisitDate || "",
        remarks: assignment.visitReport?.remarks || "",
        proofFile: null,
        stats: {
          total: assignment.visitReport?.complaintsFound || 0,
          solved: assignment.visitReport?.complaintsSolved || 0,
          pending: assignment.visitReport?.complaintsPending || 0,
          forwarded: assignment.visitReport?.complaintsForwarded || 0,
          rejected: assignment.visitReport?.complaintsRejected || 0,
          inProgress: assignment.visitReport?.complaintsInProgress || 0,
        },
      });

      if (assignment.visitReport?.actualVisitDate) {
        fetchComplaintsForDate(assignment.visitReport.actualVisitDate);
      }
    }
  }, [assignment]);

  // 🌟 Save Final Report
  const handleSave = async () => {
    try {
      if (!form.actualVisitDate)
        return alert("⚠ Please select visit date first!");

      const formData = new FormData();
      formData.append("visitDate", form.actualVisitDate);
      formData.append("summary", form.remarks);
      formData.append("proofFile", form.proofFile);
      Object.keys(form.stats).forEach((k) => formData.append(k, form.stats[k]));

      setLoading(true);

      await axios.put(
        `/officer/assignments/${assignment._id}/update`,
        formData
      );

      alert("Visit Report Submitted Successfully!");

      if (typeof refresh === "function") {
        refresh();
      }

      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to submit report!");
    } finally {
      setLoading(false);
    }
  };

  // ------------------- PREMIUM UI -------------------
  const StatCard = ({ label, value, color }) => (
    <Paper
      elevation={3}
      className="p-3 text-center"
      style={{
        borderRadius: 12,
        background: "white",
        borderBottom: `4px solid ${color}`,
        minHeight: 110,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 700, color: primaryColor }}>
        {value}
      </Typography>
      <Typography variant="subtitle2" sx={{ color: "#6b7280" }}>
        {label}
      </Typography>
    </Paper>
  );

  return (
    <Dialog open={open} fullWidth maxWidth="lg" onClose={onClose}>
      {/* HEADER */}
      <DialogTitle
        sx={{
          background: `linear-gradient(90deg, ${primaryColor}, #2563eb, #1e40af)`,
          color: "white",
          fontWeight: 700,
          textAlign: "center",
          py: 2,
        }}
      >
        Field Visit Report – Premium
      </DialogTitle>

      <DialogContent dividers sx={{ background: "#f1f5f9" }}>
        {loading && <LinearProgress sx={{ mb: 2 }} />}

        {/* ASSIGNMENT DETAILS */}
        <Paper elevation={2} className="p-3 mb-4" style={{ borderRadius: 14 }}>
          <Typography variant="h6" fontWeight={700} color={primaryColor}>
            Assignment Information
          </Typography>
          <Divider sx={{ my: 1 }} />

          <div className="row">
            <div className="col-md-6 mt-2">
              <b>Assigned By DM:</b> {assignment?.dm?.firstName}{" "}
              {assignment?.dm?.lastName}
            </div>
            <div className="col-md-3 mt-2">
              <b>Priority:</b>{" "}
              <Chip
                label={assignment?.priority}
                color="primary"
                size="small"
                sx={{ fontWeight: 700 }}
              />
            </div>
            <div className="col-md-3 mt-2">
              <b>District:</b> {assignment?.location?.district}
            </div>
            <div className="col-md-6 mt-2">
              <b>Village:</b> {assignment?.location?.village}
            </div>
          </div>
        </Paper>

        {/* VISIT DETAILS */}
        <Paper elevation={2} className="p-4 mb-4" style={{ borderRadius: 14 }}>
          <Typography variant="h6" fontWeight={700} color={primaryColor}>
            Visit Details
          </Typography>
          <Divider sx={{ my: 1 }} />

          <div className="row">
            <div className="col-md-4 mb-3">
              <TextField
                label="Actual Visit Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={form.actualVisitDate}
                onChange={(e) => {
                  setForm({ ...form, actualVisitDate: e.target.value });
                  fetchComplaintsForDate(e.target.value);
                }}
              />
            </div>

            {/* STATS CARDS */}
            <div className="row px-3 mt-2 g-3">
              <div className="col-md-2">
                <StatCard
                  label="Total Complaints"
                  value={form.stats.total}
                  color="#2563eb"
                />
              </div>
              <div className="col-md-2">
                <StatCard
                  label="Solved"
                  value={form.stats.solved}
                  color="#16a34a"
                />
              </div>
              <div className="col-md-2">
                <StatCard
                  label="Pending"
                  value={form.stats.pending}
                  color="#f97316"
                />
              </div>
              <div className="col-md-2">
                <StatCard
                  label="Forwarded"
                  value={form.stats.forwarded}
                  color="#0ea5e9"
                />
              </div>
              <div className="col-md-2">
                <StatCard
                  label="Rejected"
                  value={form.stats.rejected}
                  color="#dc2626"
                />
              </div>
              <div className="col-md-2">
                <StatCard
                  label="In Progress"
                  value={form.stats.inProgress}
                  color="#f59e0b"
                />
              </div>
            </div>

            <div className="col-md-12 mt-3">
              <TextField
                label="Summary / Remarks"
                multiline
                rows={3}
                fullWidth
                value={form.remarks}
                onChange={(e) => setForm({ ...form, remarks: e.target.value })}
              />
            </div>
          </div>
        </Paper>

        {/* COMPLAINT TABLE */}
        {visitComplaints.length > 0 && (
          <Fade in={true}>
            <Paper
              elevation={2}
              className="p-4 mb-4"
              style={{ borderRadius: 14 }}
            >
              <Typography variant="h6" fontWeight={700} color={primaryColor}>
                Complaints Registered on Selected Date
              </Typography>
              <Divider sx={{ my: 1 }} />

              <div className="table-responsive">
                <table className="table table-striped table-bordered">
                  <thead
                    style={{
                      background: `linear-gradient(90deg, ${primaryColor}, #2563eb)`,
                      color: "white",
                    }}
                  >
                    <tr>
                      <th>#</th>
                      <th>Tracking ID</th>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Filed At</th>
                    </tr>
                  </thead>

                  <tbody>
                    {visitComplaints.map((c, i) => (
                      <tr key={c._id}>
                        <td>{i + 1}</td>
                        <td>{c.trackingId}</td>
                        <td>{c.title}</td>
                        <td>{c.status}</td>
                        <td>{new Date(c.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Paper>
          </Fade>
        )}

        {/* FILE UPLOAD */}
        <Paper elevation={2} className="p-4" style={{ borderRadius: 14 }}>
          <Typography variant="h6" fontWeight={700} color={primaryColor}>
            Upload Visit Proof (Images / PDF)
          </Typography>
          <Divider sx={{ my: 1 }} />

          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            component="label"
            sx={{
              borderColor: primaryColor,
              color: primaryColor,
              "&:hover": { background: lightBlue },
            }}
          >
            Upload File
            <input
              hidden
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) =>
                setForm({ ...form, proofFile: e.target.files[0] })
              }
            />
          </Button>

          {form.proofFile && (
            <Typography mt={1} sx={{ color: "#475569" }}>
              Selected: {form.proofFile.name}
            </Typography>
          )}
        </Paper>
      </DialogContent>

      {/* FOOTER */}
      <DialogActions sx={{ justifyContent: "center", py: 2 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            bgcolor: primaryColor,
            px: 4,
            borderRadius: 2,
            fontWeight: "bold",
            "&:hover": { bgcolor: "#1d4ed8" },
          }}
          endIcon={<SendIcon />}
        >
          Submit Report
        </Button>

        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderColor: primaryColor,
            color: primaryColor,
            px: 4,
            fontWeight: "bold",
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
