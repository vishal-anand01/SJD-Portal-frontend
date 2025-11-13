    // Path: frontend/src/modules/officer/components/ComplaintForm.jsx
import React from "react";
import { TextField, Box, Button } from "@mui/material";
import MapView from "../../../components/shared/MapView";

const ComplaintForm = ({ onSubmit }) => {
  const [form, setForm] = React.useState({ title: "", description: "", location: "" });
  const [submitted, setSubmitted] = React.useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (onSubmit) onSubmit(form);
  };

  return (
    <Box component="form" onSubmit={submit}>
      <TextField label="Title" name="title" value={form.title} onChange={handleChange} fullWidth size="small" sx={{ mb: 2 }} />
      <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth multiline rows={4} size="small" sx={{ mb: 2 }} />
      <TextField label="Location (optional)" name="location" value={form.location} onChange={handleChange} fullWidth size="small" sx={{ mb: 2 }} />

      <AIComplaintTag text={form.description || form.title} />

      <Box sx={{ mt: 3 }}>
        <Button variant="contained" type="submit">Submit Complaint</Button>
      </Box>

      <Box sx={{ mt: 3 }}>
        <MapView height="240px" />
      </Box>

      {submitted && <div className="alert alert-success mt-2">Complaint submitted (simulated)</div>}
    </Box>
  );
};

export default ComplaintForm;
