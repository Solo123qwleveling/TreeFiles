// ============================================
// File: src/pages/Users/Users.tsx
// ============================================
import React from 'react';
import { Table, Card, Badge, Button } from 'react-bootstrap';
import { UserPlus } from 'lucide-react';

export const Users: React.FC = () => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Manager', status: 'Active' },
  ];

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Users Management</h2>
        <Button variant="primary">
          <UserPlus size={18} className="me-2" />
          Add User
        </Button>
      </div>
      
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td className="fw-semibold">{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge bg={user.role === 'Admin' ? 'danger' : user.role === 'Manager' ? 'primary' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={user.status === 'Active' ? 'success' : 'warning'}>
                      {user.status}
                    </Badge>
                  </td>
                  <td>
                    <Button variant="sm" size="sm" className="me-2">Edit</Button>
                    <Button variant="outline-danger" size="sm">Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};