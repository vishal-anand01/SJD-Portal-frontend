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

export default function UpdateComplaintDialog({
  open,
  complaint,
  onClose,
  refreshComplaints,
}) {
  const [form, setForm] = useState({
    status: "",
    remarks: "",
    attachment: null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (complaint) {
      setForm({
        status: complaint.status || "",
        remarks: "",
        attachment: null,
      });
    }
  }, [complaint]);

  const handleSave = async () => {
    if (!form.status) return alert("Please select a status");

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("status", form.status);
      fd.append("remarks", form.remarks);
      if (form.attachment) fd.append("attachment", form.attachment);

      await axios.put(`/department/complaints/${complaint._id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Complaint updated successfully!");
      refreshComplaints();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} fullWidth maxWidth="sm" onClose={onClose}>
      <DialogTitle
        sx={{
          background:
            "linear-gradient(90deg,#1e3a8a 0%,#2563eb 50%,#38bdf8 100%)",
          color: "white",
          textAlign: "center",
          fontWeight: 700,
        }}
      >
        Update Complaint
      </DialogTitle>

      <DialogContent dividers>
        {loading && <LinearProgress sx={{ mb: 2 }} />}

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
          multiline
          rows={3}
          label="Remarks"
          sx={{ mt: 2 }}
          value={form.remarks}
          onChange={(e) => setForm({ ...form, remarks: e.target.value })}
        />

        <Box mt={3}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
            sx={{
              borderColor: "#1e3a8a",
              color: "#1e3a8a",
              "&:hover": { background: "#eff6ff" },
            }}
          >
            {form.attachment ? "Change Attachment" : "Upload Attachment"}
            <input
              hidden
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) =>
                setForm({ ...form, attachment: e.target.files[0] })
              }
            />
          </Button>

          {form.attachment && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected: {form.attachment.name}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", py: 2 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          sx={{
            px: 4,
            bgcolor: "#1e3a8a",
            "&:hover": { bgcolor: "#1d4ed8" },
          }}
        >
          {loading ? "Saving..." : "Save"}
        </Button>

        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderColor: "#1e3a8a",
            color: "#1e3a8a",
            "&:hover": { background: "#eff6ff" },
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
