// Path: frontend/src/modules/department/pages/AssignedComplaints.jsx
import React from "react";
import { Container } from "react-bootstrap";
import { Typography, Button } from "@mui/material";
import SmartTable from "../../../components/ui/SmartTable";
import StatusChip from "../../../components/ui/StatusChip";

const AssignedComplaints = () => {
  const complaints = [
    { id: "C001", title: "Water Leakage", status: "open", officer: "Ravi Sharma" },
    { id: "C002", title: "Street Light Issue", status: "inprogress", officer: "Neha Singh" },
    { id: "C003", title: "Garbage Overflow", status: "closed", officer: "Arjun Patel" },
  ];

  const columns = [
    { field: "id", headerName: "Complaint ID" },
    { field: "title", headerName: "Title" },
    { field: "officer", headerName: "Assigned Officer" },
    { field: "status", headerName: "Status", render: (r) => <StatusChip status={r.status} /> },
  ];

  return (
    <Container fluid>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 3 }}>
        Assigned Complaints
      </Typography>

      <SmartTable columns={columns} data={complaints} actions={<Button variant="contained">Assign New</Button>} />
    </Container>
  );
};

export default AssignedComplaints;
