import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, MenuItem, Card, CardContent } from "@mui/material";
import axios from "../../api/axiosConfig";
import "bootstrap/dist/css/bootstrap.min.css";

export default function LocationSelector() {
  const [district, setDistrict] = useState("");
  const [panchayats, setPanchayats] = useState([]);
  const [panchayat, setPanchayat] = useState("");
  const [villages, setVillages] = useState([]);
  const [village, setVillage] = useState("");

  const districts = ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"];

  // Fetch Panchayats
  useEffect(() => {
    if (district) {
      axios.get(`/api/lgd/${district}/gram-panchayats`)
        .then(res => setPanchayats(res.data.panchayats || []))
        .catch(() => setPanchayats([]));
      setPanchayat("");
      setVillages([]);
    }
  }, [district]);

  // Fetch Villages
  useEffect(() => {
    if (panchayat) {
      axios.get(`/api/lgd/${district}/${panchayat}/villages`)
        .then(res => setVillages(res.data.villages || []))
        .catch(() => setVillages([]));
      setVillage("");
    }
  }, [panchayat]);

  return (
    <Box className="container py-4">
      <Card sx={{ borderRadius: 3, boxShadow: "0 6px 20px rgba(0,0,0,0.1)", p: 2 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e3a8a", mb: 3 }}>
            🌍 Select Your Location
          </Typography>
          
          <div className="row g-3">
            {/* District */}
            <div className="col-md-4 col-sm-12">
              <TextField
                select
                fullWidth
                label="Select District"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              >
                <MenuItem value="">-- Choose District --</MenuItem>
                {districts.map((d) => (
                  <MenuItem key={d} value={d}>{d}</MenuItem>
                ))}
              </TextField>
            </div>

            {/* Gram Panchayat */}
            <div className="col-md-4 col-sm-12">
              <TextField
                select
                fullWidth
                label="Select Gram Panchayat"
                value={panchayat}
                onChange={(e) => setPanchayat(e.target.value)}
                disabled={!panchayats.length}
              >
                <MenuItem value="">-- Choose Panchayat --</MenuItem>
                {panchayats.map((p, i) => (
                  <MenuItem key={i} value={p}>{p}</MenuItem>
                ))}
              </TextField>
            </div>

            {/* Village */}
            <div className="col-md-4 col-sm-12">
              <TextField
                select
                fullWidth
                label="Select Village"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                disabled={!villages.length}
              >
                <MenuItem value="">-- Choose Village --</MenuItem>
                {villages.map((v, i) => (
                  <MenuItem key={i} value={v}>{v}</MenuItem>
                ))}
              </TextField>
            </div>
          </div>
        </CardContent>
      </Card>
    </Box>
  );
}
