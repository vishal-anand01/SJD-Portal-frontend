// Path: frontend/src/modules/superadmin/pages/Dashboard.jsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Typography } from "@mui/material";
import SystemStats from "../components/SystemStats";

const SuperAdminDashboard = () => {
  return (
    <Container fluid>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 3 }}>SuperAdmin Dashboard</Typography>
      <Row>
        <Col xs={12}>
          <SystemStats />
        </Col>
      </Row>
    </Container>
  );
};

export default SuperAdminDashboard;
