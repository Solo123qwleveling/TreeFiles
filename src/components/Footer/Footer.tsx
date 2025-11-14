// ============================================
// File: src/components/Footer/Footer.tsx
// ============================================
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="dashboard-footer">
      <Container>
        <Row>
          <Col className="text-center">
            © 2024 Dashboard App. All rights reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
