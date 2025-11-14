// ============================================
// File: src/components/TitleBar.tsx
// ============================================

import React from 'react';
import { HardDrive } from 'lucide-react';

export const TitleBar: React.FC = () => {
  return (
    <div className="bg-dark text-white px-3 py-2 d-flex align-items-center">
      <HardDrive size={20} className="me-2" />
      <span>File Explorer</span>
    </div>
  );
};