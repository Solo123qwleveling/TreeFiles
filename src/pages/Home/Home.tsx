// ============================================
// File: src/pages/Home/Home.tsx
// ============================================
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import { StatsCard } from '../../components/StatsCard';
import { OrdersTable } from '../../components/OrdersTable';
import type { StatsData, Order } from '../../types';

export const Home: React.FC = () => {
  const statsData: StatsData[] = [
    { 
      title: 'Total Revenue', 
      value: '$45,231', 
      change: '+20.1%', 
      icon: DollarSign, 
      color: '#3b82f6' 
    },
    { 
      title: 'Orders', 
      value: '1,234', 
      change: '+15.3%', 
      icon: ShoppingCart, 
      color: '#8b5cf6' 
    },
    { 
      title: 'Customers', 
      value: '892', 
      change: '+8.2%', 
      icon: Users, 
      color: '#f97316' 
    },
    { 
      title: 'Growth', 
      value: '28%', 
      change: '+12.5%', 
      icon: TrendingUp, 
      color: '#10b981' 
    }
  ];

  const recentOrders: Order[] = [
    { 
      id: '#12345', 
      customer: 'John Doe', 
      product: 'Laptop', 
      amount: '$1,299', 
      status: 'Completed', 
      statusVariant: 'success' 
    },
    { 
      id: '#12346', 
      customer: 'Jane Smith', 
      product: 'Phone', 
      amount: '$899', 
      status: 'Pending', 
      statusVariant: 'warning' 
    },
    { 
      id: '#12347', 
      customer: 'Bob Johnson', 
      product: 'Tablet', 
      amount: '$599', 
      status: 'Completed', 
      statusVariant: 'success' 
    },
    { 
      id: '#12348', 
      customer: 'Alice Brown', 
      product: 'Monitor', 
      amount: '$399', 
      status: 'Processing', 
      statusVariant: 'info' 
    }
  ];

  return (
    <>
      <h2 className="mb-4">Dashboard Overview</h2>
      <Row className="g-3 mb-4">
        {statsData.map((stat, idx) => (
          <Col key={idx} xs={12} sm={6} lg={3}>
            <StatsCard {...stat} />
          </Col>
        ))}
      </Row>

      <Row>
        <Col xs={12}>
          <OrdersTable orders={recentOrders} />
        </Col>
      </Row>
    </>
  );
};