import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import axios from "../../../../api/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";

export default function EditOfficer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  const loadOfficer = async () => {
    const { data } = await axios.get(`/superadmin/officers/${id}`);
    setForm(data.officer);
  };

  useEffect(() => {
    loadOfficer();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`/superadmin/officers/${id}`, form);
    navigate("/superadmin/officers");
  };

  if (!form) return null;

  return (
    <div className="container-fluid py-4">

      {/* 🔷 PAGE HEADER (Premium Gradient) */}
      <div
        className="rounded-4 p-4 text-white shadow mb-4"
        style={{
          background:
            "linear-gradient(90deg, #1e3a8a 0%, #2563eb 40%, #38bdf8 100%)",
          boxShadow: "0 6px 25px rgba(30,58,138,0.4)",
        }}
      >
        <Typography variant="h5" className="fw-bold">
          ✏️ Edit Officer
        </Typography>
        <Typography variant="body2" className="opacity-75">
          Modify officer details and update their information
        </Typography>
      </div>

      {/* 🔶 FORM CARD */}
      <Card className="shadow-sm border-0">
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">

              <div className="col-md-6">
                <TextField
                  label="First Name"
                  fullWidth
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                />
              </div>

              <div className="col-md-6">
                <TextField
                  label="Last Name"
                  fullWidth
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                />
              </div>

              <div className="col-md-6">
                <TextField
                  label="Email"
                  fullWidth
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>

              <div className="col-md-6">
                <TextField
                  label="District"
                  fullWidth
                  value={form.district}
                  onChange={(e) =>
                    setForm({ ...form, district: e.target.value })
                  }
                />
              </div>

              <div className="col-md-6">
                <TextField
                  label="Phone"
                  fullWidth
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                />
              </div>

              {/* SUBMIT BUTTON */}
              <div className="col-12 text-end pt-3">
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    bgcolor: "#1e3a8a",
                    px: 4,
                    py: 1,
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                >
                  Update Officer
                </Button>
              </div>

            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
