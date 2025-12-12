import React, { useEffect, useState } from "react";
import { TextField, Button, Paper } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../../api/axiosConfig";
import Swal from "sweetalert2";

export default function EditPublic() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  const loadUser = async () => {
    const { data } = await axios.get(`/superadmin/public/${id}`);
    setForm(data.user);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/superadmin/public/${id}`, form);
      Swal.fire("Updated!", "Public user updated", "success");
      navigate("/superadmin/public");
    } catch (err) {
      Swal.fire("Error", "Failed to update", "error");
    }
  };

  if (!form) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container py-4">
      <div
        className="rounded-3 p-4 mb-4 text-white shadow"
        style={{
          background:
            "linear-gradient(90deg,#1e3a8a,#2563eb,#60a5fa,#93c5fd)",
        }}
      >
        <h4 className="fw-bold">✏️ Edit Public User</h4>
      </div>

      <Paper className="p-4 shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <TextField
                label="First Name"
                name="firstName"
                fullWidth
                value={form.firstName}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <TextField
                label="Last Name"
                name="lastName"
                fullWidth
                value={form.lastName}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <TextField
                label="Email"
                name="email"
                fullFullWidth
                required
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <TextField
                label="Phone"
                name="phone"
                fullWidth
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <TextField
                label="Pincode"
                name="pincode"
                fullWidth
                value={form.pincode}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 text-end mt-3">
              <Button variant="contained" type="submit" sx={{ bgcolor: "#1e3a8a" }}>
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </Paper>
    </div>
  );
}
