// Path: frontend/src/modules/admin/pages/Reports.jsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Typography, Button } from "@mui/material";
import Card from "../../../components/ui/Card";
import ReportChart from "../components/ReportChart";
import { exportPDF, exportExcel } from "../../../utils/exportUtils";

const Reports = () => {
  const handleExport = (type) => {
    if (type === "pdf") exportPDF();
    else exportExcel();
  };

  return (
    <Container fluid>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 3 }}>
        Reports
      </Typography>

      <Row>
        <Col xs={12}>
          <Card title="Monthly Complaint Report">
            <ReportChart />
            <div className="d-flex gap-2 mt-3">
              <Button variant="contained" onClick={() => handleExport("pdf")}>
                Export PDF
              </Button>
              <Button variant="outlined" onClick={() => handleExport("excel")}>
                Export Excel
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Reports;
