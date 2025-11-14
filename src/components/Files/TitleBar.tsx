// ============================================
// File: src/components/TitleBar.tsx (Improved)
// ============================================

import React from 'react';
import { HardDrive, Settings, Info, Send } from 'lucide-react';

interface TitleBarProps {
  onSettings?: () => void;
  onInfo?: () => void;
  onRequest?: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({ onSettings, onInfo, onRequest }) => {

  return (
    <div className="bg-dark text-white px-3 py-2 d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center">
        <HardDrive size={20} className="me-2" />
        <span className="fw-medium">File Explorer</span>
      </div>
      <div
        className={`d-flex align-items-center`}
        style={{ cursor: "pointer" }}
        // Execute the provided onRequest function on click
        onClick={onRequest}
        role="button" // Important for accessibility: indicates the div is interactive
        tabIndex={0} // Important for accessibility: makes the element keyboard-focusable
        onKeyDown={(e) => { // Handles keyboard accessibility (Enter/Space to click)
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onRequest;
          }
        }}
      >
        {/* Updated text label */}
        <span className='fw-meduim me-2'></span>

        {/* Replaced 'Download' icon with 'Send' */}
        <Send
          size={14}
          style={{ opacity: 0.7 }}
          className='text-light'
        />
      </div>
      {/* Optional action buttons */}
      {(onSettings || onInfo) && (
        <div className="d-flex gap-2">
          {onInfo && (
            <button
              className="btn btn-sm btn-outline-light"
              onClick={onInfo}
              title="Information"
              style={{ minWidth: '32px', padding: '4px 8px' }}
            >
              <Info size={16} />
            </button>
          )}
          {onSettings && (
            <button
              className="btn btn-sm btn-outline-light"
              onClick={onSettings}
              title="Settings"
              style={{ minWidth: '32px', padding: '4px 8px' }}
            >
              <Settings size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// =============================================================================================

// ============================================
// File: src/components/TitleBar.tsx (Improved)
// ============================================

// import React from 'react';
// import { HardDrive, Settings, Info } from 'lucide-react';

// interface TitleBarProps {
//   onSettings?: () => void;
//   onInfo?: () => void;
// }

// export const TitleBar: React.FC<TitleBarProps> = ({ onSettings, onInfo }) => {
//   return (
//     <div className="bg-dark text-white px-3 py-2 d-flex align-items-center justify-content-between">
//       <div className="d-flex align-items-center">
//         <HardDrive size={20} className="me-2" />
//         <span className="fw-medium">File Explorer</span>
//       </div>
      
//       {/* Optional action buttons */}
//       {(onSettings || onInfo) && (
//         <div className="d-flex gap-2">
//           {onInfo && (
//             <button
//               className="btn btn-sm btn-outline-light"
//               onClick={onInfo}
//               title="Information"
//               style={{ minWidth: '32px', padding: '4px 8px' }}
//             >
//               <Info size={16} />
//             </button>
//           )}
//           {onSettings && (
//             <button
//               className="btn btn-sm btn-outline-light"
//               onClick={onSettings}
//               title="Settings"
//               style={{ minWidth: '32px', padding: '4px 8px' }}
//             >
//               <Settings size={16} />
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };