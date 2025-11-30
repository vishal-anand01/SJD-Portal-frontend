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
import dayjs from "dayjs";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import CircularProgress from "@mui/material/CircularProgress";

export default function AssignOfficer() {
  const [loading, setLoading] = useState(false);
  const [officers, setOfficers] = useState([]);
  const { user } = useAuth();

  const [panchayats, setPanchayats] = useState([]);
  const [villages, setVillages] = useState([]);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // FORM STATE — district auto-filled from DM user
  const [form, setForm] = useState({
    visitDate: dayjs(),
    district: user?.district || "", // ⭐ Auto-fill DM district
    gramPanchayat: "",
    village: "",
    officerId: "",
    priority: "Medium",
    notes: "",
  });

  const locationState = useLocation()?.state || {};

  // Toast helper
  const showToast = (message, severity = "info") =>
    setToast({ open: true, message, severity });

  // Always ensure district stays DM's district
  useEffect(() => {
    if (user?.district) {
      setForm((f) => ({ ...f, district: user.district }));
    }
  }, [user]);

  // Load Officers
  useEffect(() => {
    if (locationState?.officerId) {
      setForm((f) => ({ ...f, officerId: locationState.officerId }));
    }
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

  // Load Panchayats for DM district
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

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.officerId || !form.visitDate) {
      Swal.fire({
        icon: "error",
        title: "Incomplete Form",
        text: "Please fill all required fields before submitting!",
        confirmButtonColor: "#1e3a8a",
      });
      return;
    }

    try {
      setLoading(true); // 🔥 Loader ON

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

      // 🔥 Loader को visibly दिखाने के लिए छोटा सा delay
      await new Promise((resolve) => setTimeout(resolve, 400));

      // SUCCESS POPUP
      Swal.fire({
        icon: "success",
        title: "Officer Assigned Successfully 🎉",
        text: "The officer has been successfully assigned for the field visit.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      // RESET form but district ko DM district hi रखना है
      setForm({
        visitDate: dayjs(),
        district: user?.district || "",
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
      setLoading(false); // 🔥 Loader OFF
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
      <Card sx={{ borderRadius: 3, p: 2, background: "#f9fafb" }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Visit Date */}
              <div className="col-md-6">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Visit Date"
                    value={form.visitDate}
                    onChange={(newVal) =>
                      setForm({ ...form, visitDate: newVal })
                    }
                    slotProps={{
                      textField: { fullWidth: true, required: true },
                    }}
                  />
                </LocalizationProvider>
              </div>

              {/* Officer */}
              <div className="col-md-6">
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

              {/* District (READ ONLY) */}
              <div className="col-md-6">
                <TextField
                  label="District"
                  fullWidth
                  value={form.district}
                  InputProps={{ readOnly: true }}
                  sx={{ background: "#f1f5f9", cursor: "not-allowed" }}
                />
              </div>

              {/* Gram Panchayat */}
              <div className="col-md-6">
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
              <div className="col-md-6">
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
              <div className="col-md-6">
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
                  disabled={loading} // 🔥 Disable while loading
                  sx={{
                    bgcolor: loading ? "#1e3a8aaa" : "#1e3a8a",
                    fontWeight: 600,
                    minWidth: 180,
                    height: 45,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {loading ? (
                    <>
                      <CircularProgress
                        size={22}
                        sx={{ color: "white", mr: 1 }}
                      />
                      Assigning...
                    </>
                  ) : (
                    "🚀 Assign Officer"
                  )}
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
    </Box>
  );
}
