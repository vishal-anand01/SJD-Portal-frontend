// Path: frontend/src/modules/admin/pages/OfficersList.jsx
import React from "react";
import { Container } from "react-bootstrap";
import { Typography, Button } from "@mui/material";
import SmartTable from "../../../components/ui/SmartTable";
import StatusChip from "../../../components/ui/StatusChip";

const OfficersList = () => {
  const [rows, setRows] = React.useState([
    { id: 1, name: "Ravi Sharma", dept: "Sanitation", status: "active" },
    { id: 2, name: "Neha Singh", dept: "Health", status: "inactive" },
  ]);

  const columns = [
    { field: "name", headerName: "Name" },
    { field: "dept", headerName: "Department" },
    {
      field: "status",
      headerName: "Status",
      render: (row) => <StatusChip status={row.status === "active" ? "open" : "rejected"} />,
    },
  ];

  return (
    <Container fluid>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 3 }}>
        Officers List
      </Typography>

      <SmartTable
        columns={columns}
        data={rows}
        actions={<Button variant="contained">Add Officer</Button>}
      />
    </Container>
  );
};

export default OfficersList;
