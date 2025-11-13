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
} from "@mui/material";
import axios from "../../../api/axiosConfig";

export default function ForwardComplaintDialog({
  open,
  complaint,
  onClose,
  refreshComplaints,
}) {
  const departments = [
    { _id: "dept1", name: "Public Works Department" },
    { _id: "dept2", name: "Water Supply Department" },
  ];
  const officers = [
    { _id: "off1", name: "Rakesh Kumar" },
    { _id: "off2", name: "Anita Sharma" },
  ];

  const [form, setForm] = useState({
    forwardType: "",
    forwardTo: "",
    remarks: "",
    attachment: null,
  });
  const [loading, setLoading] = useState(false);

  const handleForward = async () => {
    try {
      if (!form.forwardType || !form.forwardTo)
        return alert("Please select forward type and receiver");

      setLoading(true);
      const formData = new FormData();
      formData.append("forwardTo", `${form.forwardType}:${form.forwardTo}`);
      formData.append("remarks", form.remarks);
      if (form.attachment) formData.append("attachment", form.attachment);

      await axios.put(
        `/officer/complaints/${complaint._id}/forward`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      refreshComplaints();
      onClose();
    } catch (error) {
      console.error("Error forwarding complaint:", error);
      alert("Forwarding failed.");
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
        }}
      >
        Forward Complaint
      </DialogTitle>

      <DialogContent dividers>
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

        <TextField
          fullWidth
          label="Remarks"
          multiline
          rows={3}
          sx={{ mt: 2 }}
          value={form.remarks}
          onChange={(e) => setForm({ ...form, remarks: e.target.value })}
        />

        <Button variant="outlined" component="label" sx={{ mt: 2 }}>
          Upload Attachment
          <input
            hidden
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) =>
              setForm({ ...form, attachment: e.target.files[0] })
            }
          />
        </Button>
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
