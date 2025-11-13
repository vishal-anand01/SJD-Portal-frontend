import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
  LinearProgress,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "../../../api/axiosConfig";

export default function UpdateComplaintDialog({ open, complaint, onClose, refreshComplaints }) {
  const [form, setForm] = useState({
    status: "",
    remarks: "",
    attachment: null,
  });
  const [loading, setLoading] = useState(false);

  // 🟩 Initialize form when dialog opens
  useEffect(() => {
    if (complaint) {
      setForm({
        status: complaint.status || "",
        remarks: complaint.remarks || "",
        attachment: null,
      });
    }
  }, [complaint]);

  // 🧾 Save / Update Complaint API
  const handleSave = async () => {
    try {
      if (!form.status) return alert("Please select a status.");
      setLoading(true);

      const formData = new FormData();
      formData.append("status", form.status);
      formData.append("remarks", form.remarks);
      if (form.attachment) formData.append("attachment", form.attachment);

      // ✅ PUT request
      await axios.put(`/officer/complaints/${complaint._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Complaint updated successfully!");
      refreshComplaints();
      onClose();
    } catch (error) {
      console.error("Error updating complaint:", error);
      alert(error.response?.data?.message || "Failed to update complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} fullWidth maxWidth="sm" onClose={onClose}>
      <DialogTitle
        sx={{
          background: "linear-gradient(90deg,#1e3a8a 0%,#2563eb 50%,#38bdf8 100%)",
          color: "white",
          textAlign: "center",
          fontWeight: 700,
          py: 1.5,
        }}
      >
        Update Complaint
      </DialogTitle>

      <DialogContent dividers>
        {loading && <LinearProgress color="primary" sx={{ mb: 2 }} />}

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            {["Pending", "In Progress", "Resolved", "Rejected"].map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Remarks"
          multiline
          rows={3}
          sx={{ mt: 2 }}
          value={form.remarks}
          onChange={(e) => setForm({ ...form, remarks: e.target.value })}
          placeholder="Enter remarks for this complaint..."
        />

        <Box mt={3}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
            sx={{
              borderColor: "#1e3a8a",
              color: "#1e3a8a",
              fontWeight: 600,
              "&:hover": { bgcolor: "#eff6ff" },
            }}
          >
            {form.attachment ? "Change Attachment" : "Upload Attachment"}
            <input
              hidden
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setForm({ ...form, attachment: e.target.files[0] })}
            />
          </Button>

          {form.attachment && (
            <Typography variant="body2" color="text.secondary" mt={1}>
              Selected: {form.attachment.name}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", py: 2, gap: 2 }}>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading}
          sx={{
            bgcolor: "#1e3a8a",
            px: 4,
            borderRadius: 2,
            fontWeight: 600,
            "&:hover": { bgcolor: "#1d4ed8" },
          }}
        >
          {loading ? "Saving..." : "Save"}
        </Button>

        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "#1e3a8a",
            color: "#1e3a8a",
            fontWeight: 600,
            "&:hover": { bgcolor: "#eff6ff" },
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
