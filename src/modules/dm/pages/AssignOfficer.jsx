import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "../../../api/axiosConfig";
import ToastAlert from "../../../components/notifications/ToastAlert";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import dayjs from "dayjs";
import Swal from "sweetalert2"; // 👈 add this import

export default function AssignOfficer() {
  const [loading, setLoading] = useState(false);
  const [officers, setOfficers] = useState([]);
  const [districts] = useState([
    "Almora",
    "Bageshwar",
    "Chamoli",
    "Champawat",
    "Dehradun",
    "Haridwar",
    "Nainital",
    "Pauri Garhwal",
    "Pithoragarh",
    "Rudraprayag",
    "Tehri Garhwal",
    "Udham Singh Nagar",
    "Uttarkashi",
  ]);
  const [panchayats, setPanchayats] = useState([]);
  const [villages, setVillages] = useState([]);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [form, setForm] = useState({
    visitDate: dayjs(),
    district: "",
    gramPanchayat: "",
    village: "",
    officerId: "",
    priority: "Medium",
    notes: "",
  });

  const navigate = useNavigate();
  const locationState = useLocation()?.state || {};

  // Local toast helper
  const showToast = (message, severity = "info") =>
    setToast({ open: true, message, severity });

  // Load Officers
  useEffect(() => {
    if (locationState?.officerId)
      setForm((f) => ({ ...f, officerId: locationState.officerId }));
    loadOfficers();
  }, []);

  const loadOfficers = async () => {
    try {
      const { data } = await axios.get("/dm/officers");
      setOfficers(data.officers || []);
    } catch (err) {
      showToast("Failed to load officers", "error");
    }
  };

  // Load Panchayats when District selected
  useEffect(() => {
    if (form.district) {
      axios
        .get(`/lgd/${form.district}/gram-panchayats`)
        .then((res) => {
          setPanchayats(res.data.panchayats || []);
          setVillages([]);
          setForm((prev) => ({ ...prev, gramPanchayat: "", village: "" }));
        })
        .catch(() => showToast("Failed to load Gram Panchayats", "error"));
    }
  }, [form.district]);

  // Load Villages when Panchayat selected
  useEffect(() => {
    if (form.gramPanchayat && form.district) {
      axios
        .get(
          `/lgd/${encodeURIComponent(form.district)}/${encodeURIComponent(
            form.gramPanchayat
          )}/villages`
        )
        .then((res) => {
          setVillages(res.data.villages || []);
          setForm((prev) => ({ ...prev, village: "" }));
        })
        .catch(() => showToast("Failed to load Villages", "error"));
    }
  }, [form.gramPanchayat]);

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.officerId || !form.visitDate || !form.district) {
      Swal.fire({
        icon: "error",
        title: "Incomplete Form",
        text: "Please fill all required fields before submitting!",
        confirmButtonColor: "#1e3a8a",
      });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        officerId: form.officerId,
        visitDate: form.visitDate,
        location: { 
          district: form.district,
          gramPanchayat: form.gramPanchayat,
          village: form.village,
        },
        priority: form.priority,
        notes: form.notes,
      };

      await axios.post("/dm/assign", payload);

      // ✅ Sweet success popup
      Swal.fire({
        icon: "success",
        title: "Officer Assigned Successfully 🎉",
        text: "The officer has been successfully assigned for the field visit.",
        showConfirmButton: false,
        timer: 3000, // auto close after 3 sec
        timerProgressBar: true,
      });

      // ✅ reset form but no redirect
      setForm({
        visitDate: dayjs(),
        district: "",
        gramPanchayat: "",
        village: "",
        officerId: "",
        priority: "Medium",
        notes: "",
      });
      setPanchayats([]);
      setVillages([]);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          err.response?.data?.message ||
          "Something went wrong, please try again.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box className="container-fluid py-4">
      {/* HEADER */}
      <Box
        sx={{
          background: "linear-gradient(to right, #1e3a8a, #3b82f6)",
          color: "#fff",
          borderRadius: 3,
          p: 2.5,
          mb: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          🧭 Assign Officer for Field Visit
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Plan & delegate inspections to available officers efficiently
        </Typography>
      </Box>

      {/* FORM */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
          p: 2,
          background: "#f9fafb",
        }}
      >
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Date Picker */}
              <div className="col-md-6 col-sm-12">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Visit Date"
                    value={form.visitDate}
                    onChange={(newVal) =>
                      setForm({ ...form, visitDate: newVal })
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        variant: "outlined",
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>

              {/* Officer */}
              <div className="col-md-6 col-sm-12">
                <TextField
                  select
                  label="Select Officer"
                  fullWidth
                  required
                  value={form.officerId}
                  onChange={(e) =>
                    setForm({ ...form, officerId: e.target.value })
                  }
                >
                  <MenuItem value="">-- Choose Officer --</MenuItem>
                  {officers.map((o) => (
                    <MenuItem key={o._id} value={o._id}>
                      {o.firstName} {o.lastName} — {o.email}
                    </MenuItem>
                  ))}
                </TextField>
              </div>

              {/* District */}
              <div className="col-md-6 col-sm-12">
                <TextField
                  select
                  label="District"
                  fullWidth
                  required
                  value={form.district}
                  onChange={(e) =>
                    setForm({ ...form, district: e.target.value })
                  }
                >
                  <MenuItem value="">-- Choose District --</MenuItem>
                  {districts.map((d) => (
                    <MenuItem key={d} value={d}>
                      {d}
                    </MenuItem>
                  ))}
                </TextField>
              </div>

              {/* Gram Panchayat */}
              <div className="col-md-6 col-sm-12">
                <TextField
                  select
                  label="Gram Panchayat"
                  fullWidth
                  value={form.gramPanchayat}
                  onChange={(e) =>
                    setForm({ ...form, gramPanchayat: e.target.value })
                  }
                  disabled={!panchayats.length}
                >
                  <MenuItem value="">-- Choose Gram Panchayat --</MenuItem>
                  {panchayats.map((p, i) => (
                    <MenuItem key={i} value={p}>
                      {p}
                    </MenuItem>
                  ))}
                </TextField>
              </div>

              {/* Village */}
              <div className="col-md-6 col-sm-12">
                <TextField
                  select
                  label="Village"
                  fullWidth
                  value={form.village}
                  onChange={(e) =>
                    setForm({ ...form, village: e.target.value })
                  }
                  disabled={!villages.length}
                >
                  <MenuItem value="">-- Choose Village --</MenuItem>
                  {villages.map((v, i) => (
                    <MenuItem key={i} value={v}>
                      {v}
                    </MenuItem>
                  ))}
                </TextField>
              </div>

              {/* Priority */}
              <div className="col-md-6 col-sm-12">
                <TextField
                  select
                  label="Priority"
                  fullWidth
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value })
                  }
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </TextField>
              </div>

              {/* Notes */}
              <div className="col-12">
                <TextField
                  label="Notes / Instructions"
                  fullWidth
                  multiline
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              {/* Submit */}
              <div className="col-12 text-end mt-3">
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    bgcolor: "#1e3a8a",
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
                    "&:hover": { bgcolor: "#1d4ed8" },
                  }}
                >
                  🚀 Assign Officer
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Toast */}
      <ToastAlert
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />

      {/* Footer */}
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} SJD Portal — District Magistrate Panel
        </Typography>
      </Box>
    </Box>
  );
}
