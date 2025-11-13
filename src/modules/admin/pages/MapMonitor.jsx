// Path: frontend/src/modules/admin/pages/MapMonitor.jsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Typography } from "@mui/material";
import MapView from "../../../components/shared/MapView";

const MapMonitor = () => {
  return (
    <Container fluid>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 3 }}>
        Map Monitor
      </Typography>
      <Row>
        <Col xs={12}>
          <MapView height="75vh" />
        </Col>
      </Row>
    </Container>
  );
};

export default MapMonitor;
