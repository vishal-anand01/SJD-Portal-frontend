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
  Typography,
  Box,
} from "@mui/material";
import axios from "../../../api/axiosConfig";

export default function ForwardComplaintDialog({
  open,
  complaint,
  onClose,
  refreshComplaints,
}) {
  const [departments, setDepartments] = useState([]);
  const [officers, setOfficers] = useState([]);

  const [form, setForm] = useState({
    forwardType: "",
    forwardTo: "",
    remarks: "",
  });

  const [attachment, setAttachment] = useState(null);
  const [fileError, setFileError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load data
  useEffect(() => {
    if (open) {
      loadDepartments();
      loadOfficers();
      setForm({ forwardType: "", forwardTo: "", remarks: "" });
      setAttachment(null);
      setFileError("");
    }
  }, [open]);

  const loadDepartments = async () => {
    try {
      const { data } = await axios.get("/officer/departments");
      setDepartments(data.departments);
    } catch (err) {
      console.error("Failed to load departments:", err);
    }
  };

  const loadOfficers = async () => {
    try {
      const { data } = await axios.get("/officer/officers");
      setOfficers(data.officers);
    } catch (err) {
      console.error("Failed to load officers:", err);
    }
  };

  // FILE SELECT HANDLER
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setAttachment(null);
    setFileError("");

    if (!file) return;

    // Only image or PDF allowed
    if (!file.type.includes("image") && !file.type.includes("pdf")) {
      setFileError("Only images or PDF files allowed!");
      return;
    }

    setAttachment(file);
  };

  // SUBMIT
  const handleForward = async () => {
    if (!form.forwardType || !form.forwardTo) {
      alert("Please select forward type & receiver!");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("forwardTo", `${form.forwardType}:${form.forwardTo}`);
      fd.append("remarks", form.remarks);
      if (attachment) fd.append("attachment", attachment);

      await axios.put(`/officer/complaints/${complaint._id}/forward`, fd);

      refreshComplaints();
      onClose();
    } catch (error) {
      console.error("Error forwarding complaint:", error);
      alert("Forwarding failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} fullWidth maxWidth="sm" onClose={onClose}>
      <DialogTitle
        sx={{
          background: "linear-gradient(90deg,#1e3a8a,#2563eb,#38bdf8)",
          color: "white",
          textAlign: "center",
          fontWeight: 700,
        }}
      >
        Forward Complaint
      </DialogTitle>

      <DialogContent dividers>
        {/* Forward Type */}
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Forward Type</InputLabel>
          <Select
            label="Forward Type"
            value={form.forwardType}
            onChange={(e) =>
              setForm({ ...form, forwardType: e.target.value, forwardTo: "" })
            }
          >
            <MenuItem value="officer">👮 Officer</MenuItem>
            <MenuItem value="department">🏛️ Department</MenuItem>
          </Select>
        </FormControl>

        {/* Officer List */}
        {form.forwardType === "officer" && (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Officer</InputLabel>
            <Select
              label="Select Officer"
              value={form.forwardTo}
              onChange={(e) => setForm({ ...form, forwardTo: e.target.value })}
            >
              {officers.map((o) => (
                <MenuItem key={o._id} value={o._id}>
                  👮 {o.firstName} {o.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Department List */}
        {form.forwardType === "department" && (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Department</InputLabel>
            <Select
              label="Select Department"
              value={form.forwardTo}
              onChange={(e) => setForm({ ...form, forwardTo: e.target.value })}
            >
              {departments.map((d) => (
                <MenuItem key={d._id} value={d._id}>
                  🏛️ {d.departmentName || `${d.firstName} ${d.lastName}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Remarks */}
        <TextField
          fullWidth
          label="Remarks"
          multiline
          rows={3}
          sx={{ mt: 2 }}
          value={form.remarks}
          onChange={(e) => setForm({ ...form, remarks: e.target.value })}
        />

        {/* FILE UPLOAD */}
        <Button variant="outlined" component="label" sx={{ mt: 2 }}>
          Upload Attachment
          <input
            hidden
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileSelect}
          />
        </Button>

        {/* SHOW FILE NAME OR ERROR */}
        {attachment && (
          <Typography sx={{ mt: 1, color: "green", fontSize: "14px" }}>
            ✔ Attached: {attachment.name}
          </Typography>
        )}

        {fileError && (
          <Typography sx={{ mt: 1, color: "red", fontSize: "14px" }}>
            ❌ {fileError}
          </Typography>
        )}

        {/* Remove File Button */}
        {attachment && (
          <Box sx={{ mt: 1 }}>
            <Button
              color="error"
              size="small"
              onClick={() => setAttachment(null)}
            >
              Remove File
            </Button>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center" }}>
        <Button variant="contained" onClick={handleForward} disabled={loading}>
          {loading ? "Forwarding..." : "Forward"}
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
