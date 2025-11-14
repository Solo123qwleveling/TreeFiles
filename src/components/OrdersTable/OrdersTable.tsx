// ============================================
// File: src/components/OrdersTable/OrdersTable.tsx
// ============================================
import React from 'react';
import { Card, Table, Badge } from 'react-bootstrap';

interface Order {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: string;
  statusVariant: string;
}

interface OrdersTableProps {
  orders: Order[];
}

export const OrdersTable: React.FC<OrdersTableProps> = ({ orders }) => {
  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white border-bottom">
        <h5 className="mb-0">Recent Orders</h5>
      </Card.Header>
      <Card.Body className="p-0">
        <Table responsive hover className="mb-0">
          <thead className="bg-light">
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td className="fw-semibold">{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.product}</td>
                <td className="fw-bold">{order.amount}</td>
                <td>
                  <Badge bg={order.statusVariant}>
                    {order.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};