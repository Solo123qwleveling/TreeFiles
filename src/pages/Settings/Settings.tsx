// ============================================
// File: src/pages/Settings/Settings.tsx
// ============================================
import React from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';

export const Settings: React.FC = () => {
  return (
    <>
      <h2 className="mb-4">Settings</h2>
      <Row className="g-4">
        <Col xs={12} lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Profile Settings</h5>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter your name" defaultValue="John Doe" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Enter your email" defaultValue="john@example.com" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control type="tel" placeholder="Enter your phone" defaultValue="+1 234 567 8900" />
                </Form.Group>
                <Button variant="primary">Save Changes</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={12} lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Security Settings</h5>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control type="password" placeholder="Enter current password" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control type="password" placeholder="Enter new password" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control type="password" placeholder="Confirm new password" />
                </Form.Group>
                <Button variant="primary">Update Password</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};