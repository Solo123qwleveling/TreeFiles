// ============================================
// File: src/components/Sidebar/Sidebar.tsx (Modern Design)
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
  Settings,
  Sparkles
} from 'lucide-react';
import type { User as UserState } from "../../types";
import RequestUser from '../../api/users/RequestUser';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const [users, setUsers] = useState<UserState[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const staticMenuItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 'analytics', icon: BarChart2, label: 'Analytics', path: '/analytics', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { id: 'users', icon: Users, label: 'Users', path: '/users', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }
  ];
  
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await RequestUser.getUsers();
      const sortedUsers = data.sort((a, b) => {
        if (a.isState === b.isState) return 0;
        return a.isState ? -1 : 1;
      });
      setUsers(sortedUsers);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUserClick = useCallback((userId: number) => {
    try {
      localStorage.setItem('userId', userId.toString());
    } catch (err) {
      console.error("Failed to save userId to localStorage:", err);
    }
  }, []);

  const activeCount = users.filter(u => u.isState).length;
  const inactiveCount = users.length - activeCount;

  return (
    <div 
      className="custom-scrollbar"
      style={{
        position: 'fixed',
        top: 0,
        left: isOpen ? 0 : '-280px',
        width: '280px',
        height: '100vh',
        background: 'linear-gradient(180deg, #2c3e50 0%, #1a252f 100%)',
        transition: 'left 0.3s ease',
        zIndex: 1000,
        overflowY: 'auto',
        boxShadow: '4px 0 20px rgba(0,0,0,0.2)'
      }}
    >
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
          transition: all 0.3s ease;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #764ba2 0%, #667eea 100%);
          width: 8px;
        }
        
        /* For Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #667eea rgba(0, 0, 0, 0.1);
        }
      `}</style>
      {/* Header */}
      <div 
        className="p-4"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <div 
            className="rounded-3"
            style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Sparkles size={24} className="text-white" />
          </div>
          <div>
            <h4 className="mb-0 text-white fw-bold">Dashboard</h4>
            <small className="text-white opacity-75">Control Panel</small>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <Nav className="flex-column p-3">
        {/* Static Menu Section */}
        <div className="mb-4">
          <div 
            className="px-3 py-2 mb-2"
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            Main Menu
          </div>
          {staticMenuItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                style={({ isActive }) => ({
                  color: 'white',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textDecoration: 'none',
                  borderRadius: '10px',
                  margin: '4px 0',
                  background: isActive ? item.gradient : 'transparent',
                  transition: 'all 0.3s ease',
                  border: isActive ? 'none' : '1px solid transparent'
                })}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.classList.contains('active')) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.classList.contains('active')) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              >
                <Icon size={20} />
                <span style={{ fontWeight: 500 }}>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Users Section */}
        <div>
          <div 
            className="d-flex align-items-center justify-content-between px-3 py-2 mb-2"
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <User size={14} />
              <span>Users</span>
              {users.length > 0 && (
                <Badge 
                  pill
                  style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontSize: '0.7rem'
                  }}
                >
                  {users.length}
                </Badge>
              )}
            </div>
            {!loading && (
              <RefreshCw
                size={14}
                onClick={(e) => {
                  e.stopPropagation();
                  fetchUsers();
                }}
                style={{ cursor: 'pointer', opacity: 0.7, transition: 'all 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                title="Refresh users"
              />
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="px-3 py-3 text-white d-flex align-items-center gap-2">
              <Spinner animation="border" size="sm" />
              <span style={{ fontSize: '0.85rem' }}>Loading...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <Alert 
              variant="danger" 
              className="mx-3 py-2"
              style={{ fontSize: '0.8rem' }}
              dismissible
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {/* Users List */}
          {!loading && !error && users.length > 0 && (
            <>
              {/* User count summary */}
              {(activeCount > 0 || inactiveCount > 0) && (
                <div className="px-3 py-2 mb-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="badge rounded-pill" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', fontSize: '0.7rem', padding: '6px 10px' }}>
                      <UserCheck size={12} className="me-1" />
                      {activeCount} active
                    </span>
                    {inactiveCount > 0 && (
                      <span className="badge rounded-pill" style={{ background: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)', fontSize: '0.7rem', padding: '6px 10px' }}>
                        <UserX size={12} className="me-1" />
                        {inactiveCount} inactive
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* User list */}
              <div>
                {users.map(user => (
                  <NavLink
                    key={user.id}
                    to={`/FilesTree/${user.id}`}
                    style={({ isActive }) => ({
                      color: 'white',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      textDecoration: 'none',
                      borderRadius: '10px',
                      margin: '4px 0',
                      background: isActive ? 'linear-gradient(to right, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)' : 'transparent',
                      transition: 'all 0.3s ease',
                      borderLeft: isActive ? '3px solid #667eea' : '3px solid transparent'
                    })}
                    onClick={() => handleUserClick(user.id)}
                    title={`View ${user.username}'s files`}
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.classList.contains('active')) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!e.currentTarget.classList.contains('active')) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <div 
                      className="rounded-circle"
                      style={{
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        color: 'white',
                        background: user.isState 
                          ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' 
                          : 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        flexShrink: 0
                      }}
                    >
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ flex: 1, fontWeight: 500, fontSize: '0.9rem' }}>
                      {user.username}
                    </span>
                    <span style={{ fontSize: '18px' }}>
                      {user.isState ? '🟢' : '🔴'}
                    </span>
                  </NavLink>
                ))}
              </div>
            </>
          )}

          {/* Empty State */}
          {!loading && !error && users.length === 0 && (
            <div className="text-center py-4">
              <User size={40} className="text-white opacity-25 mb-3" />
              <small className="text-white opacity-50 d-block mb-3">No users found</small>
              <button
                className="btn btn-sm btn-outline-light rounded-pill"
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