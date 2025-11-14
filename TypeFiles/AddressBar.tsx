// ============================================
// File: src/components/AddressBar.tsx
// ============================================

import React from 'react';
import { Folder } from 'lucide-react';
import type { FileInfo } from '../../types/Files/FileSystemTypes';

interface AddressBarProps {
  currentPath: FileInfo[];
}

export const AddressBar: React.FC<AddressBarProps> = ({ currentPath }) => {
  return (
    <div className="bg-light border-bottom px-3 py-2">
      <div className="input-group">
        <span className="input-group-text bg-white">
          <Folder size={16} />
        </span>
        <input 
          type="text" 
          className="form-control" 
          value={currentPath.map(item => item.name).join(' > ')}
          readOnly
        />
      </div>
    </div>
  );
};