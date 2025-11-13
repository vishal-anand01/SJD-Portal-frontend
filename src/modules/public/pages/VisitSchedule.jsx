// Path: frontend/src/modules/public/pages/VisitSchedule.jsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Typography } from "@mui/material";
import SmartTable from "../../../components/ui/SmartTable";

const VisitSchedule = () => {
  const visits = [
    { id: "V001", officer: "Ravi Sharma", date: "2025-10-24", area: "Sector 5" },
    { id: "V002", officer: "Neha Singh", date: "2025-10-25", area: "Market Road" },
  ];

  const columns = [
    { field: "id", headerName: "Visit ID" },
    { field: "officer", headerName: "Officer" },
    { field: "date", headerName: "Date" },
    { field: "area", headerName: "Area" },
  ];

  return (
    <Container>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 3 }}>Visit Schedule</Typography>
      <SmartTable columns={columns} data={visits} />
    </Container>
  );
};

export default VisitSchedule;
