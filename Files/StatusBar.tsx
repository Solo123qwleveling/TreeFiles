// ============================================
// File: src/components/StatusBar.tsx
// ============================================

import React from 'react';

interface StatusBarProps {
  itemCount: number;
  selectedItemInfo?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ itemCount, selectedItemInfo }) => {
  return (
    <div className="bg-light border-top px-3 py-1 d-flex justify-content-between">
      <small className="text-muted">
        {itemCount} items
      </small>
      {selectedItemInfo && (
        <small className="text-muted">
          {selectedItemInfo}
        </small>
      )}
    </div>
  );
};