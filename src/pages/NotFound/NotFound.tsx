// ============================================
// File: src/pages/NotFound/NotFound.tsx
// ============================================
import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container className="text-center py-5">
      <h1 className="display-1 fw-bold">404</h1>
      <p className="fs-3">
        <span className="text-danger">Oops!</span> Page not found.
      </p>
      <p className="lead">
        The page you're looking for doesn't exist.
      </p>
      <Button variant="primary" onClick={() => navigate('/')}>
        <Home size={18} className="me-2" />
        Go Home
      </Button>
    </Container>
  );
};