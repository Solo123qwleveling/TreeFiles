// ============================================
// File: src/components/StatusBar.tsx (Improved)
// ============================================

import React from 'react';

interface StatusBarProps {
  itemCount: number;
  selectedItemInfo?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ 
  itemCount, 
  selectedItemInfo 
}) => {
  return (
    <div className="bg-light border-top px-3 py-1 d-flex justify-content-between align-items-center">
      <small className="text-muted">
        {itemCount === 0 ? (
          'No items'
        ) : itemCount === 1 ? (
          '1 item'
        ) : (
          `${itemCount} items`
        )}
      </small>
      
      {selectedItemInfo && (
        <small className="text-muted fw-medium">
          {selectedItemInfo}
        </small>
      )}
    </div>
  );
};


// ------------------------------------------------------------------------------------------

// ============================================
// File: src/components/StatusBar.tsx (Improved)
// ============================================

// import React from 'react';

// interface StatusBarProps {
//   itemCount: number;
//   selectedItemInfo?: string;
// }

// export const StatusBar: React.FC<StatusBarProps> = ({ 
//   itemCount, 
//   selectedItemInfo 
// }) => {
//   return (
//     <div className="bg-light border-top px-3 py-1 d-flex justify-content-between align-items-center">
//       <small className="text-muted">
//         {itemCount === 0 ? (
//           'No items'
//         ) : itemCount === 1 ? (
//           '1 item'
//         ) : (
//           `${itemCount} items`
//         )}
//       </small>
      
//       {selectedItemInfo && (
//         <small className="text-muted fw-medium">
//           {selectedItemInfo}
//         </small>
//       )}
//     </div>
//   );
// };
