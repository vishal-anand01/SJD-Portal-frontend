// frontend/src/modules/dm/pages/VisitList.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import axios from "../../../api/axiosConfig";
import SmartTable from "../../../components/ui/SmartTable";
import ToastAlert from "../../../components/notifications/ToastAlert";

export default function VisitList() {
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState([]);

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/dm/assignments?limit=200");
      // visits are assignments filtered to visited/completed
      const vs = (data.assignments || []).filter(a => ["Visited", "Completed"].includes(a.status));
      setVisits(vs);
    } catch (err) {
      ToastAlert.error("Failed to load visits");
    } finally { setLoading(false); }
  };


  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ color: "#1e3a8a", mb: 2 }}>Visits</Typography>

      <SmartTable rows={visits} columns={[
        { field: "visitDate", headerName: "Date", valueGetter: r => r.visitDate ? new Date(r.visitDate).toLocaleString() : "" },
        { field: "officer", headerName: "Officer", valueGetter: r => r.officer ? `${r.officer.firstName} ${r.officer.lastName}` : "N/A" },
        { field: "district", headerName: "District", valueGetter: r => r.location?.district || "" },
        { field: "complaints", headerName: "Complaints", valueGetter: r => (r.complaints || []).length },
        { field: "status", headerName: "Status" },
      ]} />
    </Box>
  );
}
