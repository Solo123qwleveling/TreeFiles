// ============================================
// File: src/pages/UserDetail/UserDetail.tsx
// ============================================
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Spinner, Alert, Button, Badge } from 'react-bootstrap';
import { ArrowLeft, UserCheck, UserX } from 'lucide-react';
import type { User } from '../../types';

export const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        // const data = await RequestUser.getUserById(parseInt(id));
        // setUser(data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setError('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading user details...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <Alert variant="danger">
        {error || 'User not found'}
      </Alert>
    );
  }

  return (
    <>
      <Button 
        variant="link" 
        className="mb-3 p-0"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={20} className="me-2" />
        Back
      </Button>

      <h2 className="mb-4">User Details</h2>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <div className="d-flex align-items-center mb-4">
            <div 
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
              style={{ width: '64px', height: '64px', fontSize: '24px', fontWeight: 'bold' }}
            >
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="mb-1">{user.username}</h4>
              <Badge bg={user.isState ? 'success' : 'danger'}>
                {user.isState ? (
                  <>
                    <UserCheck size={14} className="me-1" />
                    Active
                  </>
                ) : (
                  <>
                    <UserX size={14} className="me-1" />
                    Inactive
                  </>
                )}
              </Badge>
            </div>
          </div>

          <hr />

          <div className="row">
            <div className="col-md-6 mb-3">
              <strong className="text-muted">User ID:</strong>
              <p className="mb-0">{user.id}</p>
            </div>
            <div className="col-md-6 mb-3">
              <strong className="text-muted">Username:</strong>
              <p className="mb-0">{user.username}</p>
            </div>
            <div className="col-md-6 mb-3">
              <strong className="text-muted">Status:</strong>
              <p className="mb-0">
                {user.isState ? (
                  <span className="text-success">Active</span>
                ) : (
                  <span className="text-danger">Inactive</span>
                )}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <Button variant="primary" className="me-2">
              Edit User
            </Button>
            <Button variant="outline-danger">
              Delete User
            </Button>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};