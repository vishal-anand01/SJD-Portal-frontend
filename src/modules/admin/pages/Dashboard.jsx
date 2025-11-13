// Path: frontend/src/modules/admin/pages/Dashboard.jsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Typography, Box } from "@mui/material";
import Card from "../../../components/ui/Card";
import Chart from "../../../components/ui/Chart";
import VisitCard from "../components/VisitCard";
import ReportChart from "../components/ReportChart";
import StatusChip from "../../../components/ui/StatusChip";

const Dashboard = () => {
  const quickStats = [
    { label: "Active Complaints", value: 142 },
    { label: "Pending Visits", value: 27 },
    { label: "Departments", value: 12 },
    { label: "Officers", value: 64 },
  ];

  return (
    <Container fluid>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 3 }}>
        Admin Dashboard
      </Typography>

      <Row className="g-3">
        {quickStats.map((s, idx) => (
          <Col md={3} sm={6} xs={12} key={idx}>
            <Card sx={{ textAlign: "center", background: "var(--card-bg)" }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {s.value}
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                {s.label}
              </Typography>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-3 mt-3">
        <Col lg={8} xs={12}>
          <Card title="Complaint Trends" subtitle="Last 6 months">
            <ReportChart />
          </Card>
        </Col>
        <Col lg={4} xs={12}>
          <Card title="Recent Visits">
            <VisitCard officer="Ravi Sharma" status="completed" date="2025-10-22" />
            <VisitCard officer="Neha Singh" status="pending" date="2025-10-23" />
            <VisitCard officer="Arjun Patel" status="inprogress" date="2025-10-24" />
          </Card>
        </Col>
      </Row>

      <Row className="g-3 mt-3">
        <Col xs={12}>
          <Card title="Complaint Summary">
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <StatusChip status="open" />
              <StatusChip status="inprogress" />
              <StatusChip status="closed" />
              <StatusChip status="pending" />
            </Box>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
