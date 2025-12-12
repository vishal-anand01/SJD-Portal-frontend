import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Box,
  Divider,
} from "@mui/material";
import axios from "../../../../api/axiosConfig";
import { useParams } from "react-router-dom";

export default function ViewOfficer() {
  const { id } = useParams();
  const [officer, setOfficer] = useState(null);

  const loadData = async () => {
    const { data } = await axios.get(`/superadmin/officers/${id}`);
    setOfficer(data.officer);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!officer) return null;

  return (
    <div className="container-fluid py-3">

      {/* 🔷 Internal Premium Gradient Header */}
      <Box
        sx={{
          background:
            "linear-gradient(90deg, #1e3a8a 0%, #2563eb 45%, #60a5fa 100%)",
          borderRadius: 3,
          color: "white",
          p: 3,
          textAlign: "center",
          boxShadow: "0 6px 25px rgba(30,58,138,0.4)",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          🧑‍✈️ Officer Profile
        </Typography>
        <Typography sx={{ opacity: 0.85, mt: 0.5 }}>
          View detailed officer information
        </Typography>
      </Box>

      {/* MAIN CARD */}
      <Card className="shadow-sm border-0 mt-4">
        <CardContent>
          {/* PROFILE HEADER */}
          <div className="text-center mb-4">
            <Avatar
              src={officer.photo ? `http://localhost:5000/uploads/${officer.photo}` : ""}
              sx={{
                width: 130,
                height: 130,
                margin: "0 auto",
                mb: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
            />
            <Typography variant="h5" className="fw-bold">
              {officer.firstName} {officer.lastName}
            </Typography>

            <Chip
              label="Officer"
              color="primary"
              sx={{ mt: 1, fontWeight: 700 }}
            />
          </div>

          <Divider sx={{ my: 3 }} />

          {/* DETAILS */}
          <div className="row gy-3">
            <div className="col-md-6">
              <Typography variant="body1">
                <strong>Email:</strong> {officer.email}
              </Typography>

              <Typography variant="body1">
                <strong>Phone:</strong> {officer.phone || "N/A"}
              </Typography>

              <Typography variant="body1">
                <strong>Gender:</strong> {officer.gender || "N/A"}
              </Typography>

              <Typography variant="body1">
                <strong>Date of Birth:</strong>{" "}
                {officer.dob
                  ? new Date(officer.dob).toLocaleDateString()
                  : "N/A"}
              </Typography>
            </div>

            <div className="col-md-6">
              <Typography variant="body1">
                <strong>District:</strong> {officer.district}
              </Typography>

              <Typography variant="body1">
                <strong>Designation:</strong> {officer.designation || "Officer"}
              </Typography>

              <Typography variant="body1">
                <strong>Assigned Complaints:</strong>{" "}
                {officer.assignmentsCount || 0}
              </Typography>

              <Typography variant="body1">
                <strong>Joined On:</strong>{" "}
                {officer.createdAt
                  ? new Date(officer.createdAt).toLocaleDateString()
                  : "N/A"}
              </Typography>
            </div>
          </div>

          <Divider sx={{ my: 3 }} />

          {/* ADDRESS */}
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            📍 Address Details
          </Typography>

          <Typography variant="body1">
            {officer.address
              ? `${officer.address}, ${officer.city || ""}, ${officer.state || ""}, ${officer.country || ""} - ${officer.pincode || ""}`
              : "No address provided"}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
