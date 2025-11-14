// ============================================
// File: src/components/Sidebar/Sidebar.tsx (Improved & Cleaned)
// ============================================

import React, { useEffect, useState, useCallback } from 'react';
import { Nav, Spinner, Alert, Badge } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import {
  User,
  UserCheck,
  UserX,
  RefreshCw,
  Home,
  BarChart2,
  Users,
  Settings
} from 'lucide-react';
import type { User as UserState } from "../../types";
import './Sidebar.css';
import RequestUser from '../../api/users/RequestUser';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const [users, setUsers] = useState<UserState[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Static menu items
  const staticMenuItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'analytics', icon: BarChart2, label: 'Analytics', path: '/analytics' },
    { id: 'users', icon: Users, label: 'Users', path: '/users' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' }
  ];
  
  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await RequestUser.getUsers();
      console.log('Fetched users:', data);
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle user selection
  const handleUserClick = useCallback((userId: number) => {
    try {
      localStorage.setItem('userId', userId.toString());
    } catch (err) {
      console.error("Failed to save userId to localStorage:", err);
    }
  }, []);

  // Active/Inactive user counts
  const activeCount = users.filter(u => u.isState).length;
  const inactiveCount = users.length - activeCount;

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        <h4>Dashboard</h4>
      </div>

      {/* Main Navigation */}
      <Nav className="flex-column sidebar-nav">
        {/* Static Menu Section */}
         <div className="sidebar-section">
           <div className="sidebar-section-title">Main Menu</div>
           {staticMenuItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={20} />
                <span className="ms-3">{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Users Section */}
        <div className="sidebar-section">
          <div className="sidebar-section-title d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <User size={16} className="me-2" />
              <span>Users</span>
              {users.length > 0 && (
                <Badge bg="primary" className="ms-2">{users.length}</Badge>
              )}
            </div>
            {!loading && (
              <RefreshCw
                size={14}
                onClick={(e) => {
                  e.stopPropagation();
                  fetchUsers();
                }}
                className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                title="Refresh users"
              />
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="sidebar-loading">
              <Spinner animation="border" size="sm" variant="light" />
              <span className="ms-2">Loading users...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <Alert
              variant="danger"
              className="sidebar-alert"
              dismissible
              onClose={() => setError(null)}
            >
              <small>{error}</small>
              <button
                className="btn btn-sm btn-danger mt-2 w-100"
                onClick={fetchUsers}
              >
                Retry
              </button>
            </Alert>
          )}

          {/* Users List */}
          {!loading && !error && users.length > 0 && (
            <>
              {/* User count summary */}
              {(activeCount > 0 || inactiveCount > 0) && (
                <div className="px-3 py-2">
                  <small className="text-light d-flex justify-content-between">
                    <span>
                      <UserCheck size={12} className="text-success me-1" />
                      {activeCount} active
                    </span>
                    {inactiveCount > 0 && (
                      <span>
                        <UserX size={12} className="text-danger me-1" />
                        {inactiveCount} inactive
                      </span>
                    )}
                  </small>
                </div>
              )}

              {/* User list */}
              <div>
                {users.map(user => (
                  <NavLink
                    key={user.id}
                    to={`/FilesTree/${user.id}`}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? 'active' : ''}`
                    }
                    onClick={() => handleUserClick(user.id)}
                    title={`View ${user.username}'s files`}
                  >
                    {user.isState ? (
                      <UserCheck size={18} className="text-success" />
                    ) : (
                      <UserX size={18} className="text-danger" />
                    )}
                    <span className="ms-3 flex-grow-1">{user.username}</span>
                    {user.isState && (
                      <Badge bg="success" pill style={{ fontSize: '0.65rem' }}>
                        Active
                      </Badge>
                    )}
                  </NavLink>
                ))}
              </div>
            </>
          )}

          {/* Empty State */}
          {!loading && !error && users.length === 0 && (
            <div className="sidebar-empty">
              <User size={32} className="mb-2 opacity-50" />
              <small>No users found</small>
              <button
                className="btn btn-sm btn-outline-light mt-3"
                onClick={fetchUsers}
              >
                <RefreshCw size={14} className="me-2" />
                Refresh
              </button>
            </div>
          )}
        </div>
      </Nav>
    </div>
  );
};