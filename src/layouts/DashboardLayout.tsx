// ============================================
// File: src/layouts/DashboardLayout.tsx
// ============================================
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Sidebar } from '../components/Sidebar';
import { Menubar } from '../components/Menubar';
import { Footer } from '../components/Footer';
import './DashboardLayout.css';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Menubar toggleSidebar={toggleSidebar} />
      
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Container fluid className="py-4">
          <Outlet />
          <Footer />
        </Container>
      </div>
    </div>
  );
};