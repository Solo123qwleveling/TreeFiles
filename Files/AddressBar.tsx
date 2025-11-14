// // ============================================
// // File: src/components/AddressBar.tsx
// // ============================================

// import React from 'react';
// import { Folder } from 'lucide-react';
// import type { FileInfo } from '../../types/Files/FileSystemTypes';

// interface AddressBarProps {
//   currentPath: FileInfo[];
// }

// export const AddressBar: React.FC<AddressBarProps> = ({ currentPath }) => {
//   return (
//     <div className="bg-light border-bottom px-3 py-2">
//       <div className="input-group">
//         <span className="input-group-text bg-white">
//           <Folder size={16} />
//         </span>
//         <input 
//           type="text" 
//           className="form-control" 
//           value={currentPath.map(item => item.name).join(' > ')}
//           readOnly
//         />
//       </div>
//     </div>
//   );
// };

// ------------------------------------------------------------------------------------------------

// ============================================
// File: src/components/AddressBar.tsx (Improved)
// ============================================

import React, { useState } from 'react';
import { Folder, ChevronRight, ArrowUp, Copy } from 'lucide-react';
import type { FileInfo } from '../../types/Files/FileSystemTypes';

interface AddressBarProps {
  currentPath: FileInfo[];
  onNavigate?: (item: FileInfo) => void;
  onNavigateUp?: () => void;
}

export const AddressBar: React.FC<AddressBarProps> = ({ 
  currentPath, 
  onNavigate,
  onNavigateUp 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPath = () => {
    const pathString = currentPath.map(item => item.name).join(' > ');
    navigator.clipboard.writeText(pathString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleBreadcrumbClick = (item: FileInfo, index: number) => {
    // Don't navigate if clicking current folder
    if (index === currentPath.length - 1) return;
    onNavigate?.(item);
  };

  return (
    <div className="bg-light border-bottom px-3 py-2">
      <div className="d-flex align-items-center gap-2">
        {/* Up button */}
        {onNavigateUp && (
          <button 
            className="btn btn-sm btn-outline-secondary"
            onClick={onNavigateUp}
            title="Go up one level"
            style={{ minWidth: '36px' }}
          >
            <ArrowUp size={16} />
          </button>
        )}

        {/* Breadcrumb path */}
        <div className="input-group flex-grow-1">
          <span className="input-group-text bg-white">
            <Folder size={16} />
          </span>
          <div 
            className="form-control d-flex align-items-center gap-1 overflow-auto"
            style={{ 
              whiteSpace: 'nowrap',
              cursor: 'default'
            }}
          >
            {currentPath.map((item, index) => (
              <React.Fragment key={item.id}>
                <span
                  className={`${onNavigate && index < currentPath.length - 1 ? 'text-primary' : ''}`}
                  onClick={() => handleBreadcrumbClick(item, index)}
                  style={{
                    cursor: onNavigate && index < currentPath.length - 1 ? 'pointer' : 'default',
                    textDecoration: onNavigate && index < currentPath.length - 1 ? 'underline' : 'none',
                    fontWeight: index === currentPath.length - 1 ? 600 : 400
                  }}
                  title={`Navigate to ${item.name}`}
                >
                  {item.name}
                </span>
                {index < currentPath.length - 1 && (
                  <ChevronRight size={14} className="text-muted" />
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Copy path button */}
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={handleCopyPath}
            title="Copy path"
            style={{ minWidth: '38px' }}
          >
            {copied ? (
              <span className="text-success">✓</span>
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};