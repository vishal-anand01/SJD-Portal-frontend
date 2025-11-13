// Path: frontend/src/modules/department/pages/Dashboard.jsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Typography } from "@mui/material";
import Card from "../../../components/ui/Card";
import ReportChart from "../../admin/components/ReportChart";

const DepartmentDashboard = () => {
  const metrics = [
    { label: "Total Complaints", value: 87 },
    { label: "Resolved", value: 69 },
    { label: "Pending", value: 18 },
  ];

  return (
    <Container fluid>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 3 }}>
        Department Dashboard
      </Typography>

      <Row className="g-3">
        {metrics.map((m, i) => (
          <Col sm={6} md={4} key={i}>
            <Card sx={{ textAlign: "center", background: "var(--card-bg)" }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{m.value}</Typography>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>{m.label}</Typography>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mt-4">
        <Col xs={12}>
          <Card title="Department Performance">
            <ReportChart />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DepartmentDashboard;
