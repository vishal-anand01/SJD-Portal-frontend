import React, { useState } from "react";
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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "../../../api/axiosConfig";

export default function ForwardComplaintDialog({
  open,
  complaint,
  onClose,
  refreshComplaints,
}) {
  const [form, setForm] = useState({
    forwardType: "",
    forwardTo: "",
    remarks: "",
    attachment: null,
  });

  const [loading, setLoading] = useState(false);

  // Dummy data (replace later with dynamic API)
  const departments = [
    { _id: "dept1", name: "Electricity Department" },
    { _id: "dept2", name: "Water Department" },
  ];
  const officers = [
    { _id: "off1", name: "Rakesh Kumar" },
    { _id: "off2", name: "Neha Sharma" },
  ];
  const dms = [
    { _id: "dm1", name: "DM Dehradun" },
    { _id: "dm2", name: "DM Nainital" },
  ];

  const handleForward = async () => {
    if (!form.forwardType || !form.forwardTo)
      return alert("Please select forward type and receiver!");

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("forwardTo", `${form.forwardType}:${form.forwardTo}`);
      fd.append("remarks", form.remarks);
      if (form.attachment) fd.append("attachment", form.attachment);

      await axios.put(
        `/department/complaints/${complaint._id}/forward`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Complaint forwarded successfully!");
      refreshComplaints();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Forwarding failed");
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
              setForm({
                ...form,
                forwardType: e.target.value,
                forwardTo: "",
              })
            }
          >
            <MenuItem value="officer">👮 Officer</MenuItem>
            <MenuItem value="department">🏛️ Department</MenuItem>
            <MenuItem value="dm">🏢 DM Office</MenuItem>
          </Select>
        </FormControl>

        {/* Officers list */}
        {form.forwardType === "officer" && (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Officer</InputLabel>
            <Select
              label="Select Officer"
              value={form.forwardTo}
              onChange={(e) =>
                setForm({ ...form, forwardTo: e.target.value })
              }
            >
              {officers.map((o) => (
                <MenuItem key={o._id} value={o._id}>
                  👮 {o.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Departments list */}
        {form.forwardType === "department" && (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Department</InputLabel>
            <Select
              label="Select Department"
              value={form.forwardTo}
              onChange={(e) =>
                setForm({ ...form, forwardTo: e.target.value })
              }
            >
              {departments.map((d) => (
                <MenuItem key={d._id} value={d._id}>
                  🏛️ {d.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* DM list */}
        {form.forwardType === "dm" && (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select DM</InputLabel>
            <Select
              label="Select DM"
              value={form.forwardTo}
              onChange={(e) =>
                setForm({ ...form, forwardTo: e.target.value })
              }
            >
              {dms.map((d) => (
                <MenuItem key={d._id} value={d._id}>
                  🏢 {d.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Remarks */}
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Remarks"
          sx={{ mt: 2 }}
          value={form.remarks}
          onChange={(e) => setForm({ ...form, remarks: e.target.value })}
        />

        {/* Upload */}
        <Button
          variant="outlined"
          component="label"
          sx={{
            mt: 2,
            borderColor: "#1e3a8a",
            color: "#1e3a8a",
            "&:hover": { background: "#eff6ff" },
          }}
          startIcon={<CloudUploadIcon />}
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
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", py: 2 }}>
        <Button
          variant="contained"
          disabled={loading}
          onClick={handleForward}
          sx={{
            px: 4,
            bgcolor: "#1e3a8a",
            "&:hover": { bgcolor: "#1d4ed8" },
          }}
        >
          {loading ? "Forwarding..." : "Forward"}
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
