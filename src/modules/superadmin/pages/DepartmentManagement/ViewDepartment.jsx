// ViewDepartment.jsx
import React, { useEffect, useState } from "react";
import axios from "../../../../api/axiosConfig";
import { Box, Card, CardContent, Typography, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";

export default function ViewDepartment() {
  const { id } = useParams();
  const [dep, setDep] = useState(null);

  useEffect(()=> {
    const load = async () => {
      const { data } = await axios.get(`/admin/departments/${id}`);
      setDep(data.department);
    };
    load();
  }, [id]);

  if (!dep) return <Box className="py-5 text-center"><CircularProgress /></Box>;

  return (
    <Box className="container-fluid py-4">
      <Card><CardContent>
        <Typography variant="h5" sx={{ color: "#1e3a8a", fontWeight: 800 }}>{dep.name}</Typography>
        <Typography color="text.secondary">{dep.description}</Typography>
        <Typography sx={{ mt: 2 }}><strong>Email:</strong> {dep.contactEmail || "—"}</Typography>
        <Typography><strong>Phone:</strong> {dep.contactPhone || "—"}</Typography>
      </CardContent></Card>
    </Box>
  );
}
