// ============================================
// File: src/pages/Analytics/Analytics.tsx
// ============================================
import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { LineChart, BarChart3, PieChart } from 'lucide-react';

export const Analytics: React.FC = () => {
  return (
    <>
      <h2 className="mb-4">Analytics</h2>
      <Row className="g-4">
        <Col xs={12} md={6} lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <LineChart size={48} className="text-primary mb-3" />
              <h5>Sales Trend</h5>
              <p className="text-muted">View your sales performance over time</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <BarChart3 size={48} className="text-success mb-3" />
              <h5>Revenue Analysis</h5>
              <p className="text-muted">Detailed breakdown of your revenue</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <PieChart size={48} className="text-warning mb-3" />
              <h5>Market Share</h5>
              <p className="text-muted">Your position in the market</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};
