// ============================================
// File: src/components/StatsCard/StatsCard.tsx
// ============================================
import React from 'react';
import { Card } from 'react-bootstrap';
import type { LucideIcon } from 'lucide-react';
import './StatsCard.css';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color 
}) => {
  const isPositive = change.startsWith('+');
  
  return (
    <Card className="stats-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <div className="stats-title">{title}</div>
            <div className="stats-value">{value}</div>
            <div className={`stats-change ${isPositive ? 'positive' : 'negative'}`}>
              {change} from last month
            </div>
          </div>
          <div 
            className="stats-icon"
            style={{ backgroundColor: color }}
          >
            <Icon size={28} />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};