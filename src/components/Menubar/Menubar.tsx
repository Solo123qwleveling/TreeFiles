// ============================================
// File: src/components/Menubar/Menubar.tsx
// ============================================
import React from 'react';
import { Navbar, Container, Nav, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Search } from 'lucide-react';
import './Menubar.css';

interface MenubarProps {
  toggleSidebar: () => void;
}

export const Menubar: React.FC<MenubarProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="menubar">
      <Container fluid>
        <Button 
          variant="link" 
          onClick={toggleSidebar}
          className="menu-toggle"
        >
          <Menu size={24} />
        </Button>
        <Navbar.Brand 
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          My Dashboard
        </Navbar.Brand>
        <Nav className="ms-auto d-flex flex-row align-items-center">
          <Nav.Link className="nav-icon">
            <Search size={20} />
          </Nav.Link>
          <Nav.Link className="nav-icon position-relative">
            <Bell size={20} />
            <Badge 
              bg="danger" 
              className="notification-badge"
            >
              3
            </Badge>
          </Nav.Link>
          <Nav.Link>
            <div className="user-avatar">
              JD
            </div>
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};
