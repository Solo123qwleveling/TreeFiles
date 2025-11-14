import React, { useEffect, useCallback, useRef } from "react";
import { Folder, File } from "lucide-react";
import type { FileInfo } from "../../types/Files/FileSystemTypes";
import { FileSystemHelper } from "../../utils/Files/FileSystemHelper";

interface DetailsViewProps {
  items: FileInfo[];
  onNavigate: (item: FileInfo) => void;
  onSelect: (id: number, isCtrlKey: boolean, isShiftKey: boolean) => void;
  selectedItems: Set<number>;
}

// --- Safely format hash (supports string, number, Buffer/Uint8Array, etc.) ---
const formatHash = (hash: unknown): string => {
  if (hash == null) return "—";

  // If it's already a string
  if (typeof hash === "string") {
    return hash.length > 8 ? `${hash.slice(0, 8)}...` : hash;
  }

  // If it's a Uint8Array
  if (hash instanceof Uint8Array) {
    const hex = Array.from(hash)
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
    return hex.length > 8 ? `${hex.slice(0, 8)}...` : hex;
  }

  // If it's an array of numbers
  if (Array.isArray(hash) && hash.every(x => typeof x === "number")) {
    const hex = hash
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
    return hex.length > 8 ? `${hex.slice(0, 8)}...` : hex;
  }

  // Fallback for unknown types
  try {
    const s = String(hash);
    return s.length > 8 ? `${s.slice(0, 8)}...` : s;
  } catch {
    return "—";
  }
};


export const DetailsView: React.FC<DetailsViewProps> = ({
  items,
  onNavigate,
  onSelect,
  selectedItems,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Keyboard navigation ---
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement) || items.length === 0) {
        return;
      }

      const selectedArray = Array.from(selectedItems);
      const currentId = selectedArray.length > 0 ? selectedArray[selectedArray.length - 1] : null;
      const currentIndex = currentId !== null ? items.findIndex(i => i.id === currentId) : -1;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = Math.min(currentIndex + 1, items.length - 1);
        if (nextIndex >= 0) {
          onSelect(items[nextIndex].id, e.ctrlKey, e.shiftKey);
        }
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex = Math.max(currentIndex - 1, 0);
        if (prevIndex >= 0) {
          onSelect(items[prevIndex].id, e.ctrlKey, e.shiftKey);
        }
      }

      if (e.key === "Enter" && currentId !== null) {
        e.preventDefault();
        const item = items.find(i => i.id === currentId);
        if (item) onNavigate(item);
      }
    },
    [items, selectedItems, onSelect, onNavigate]
  );

  // Attach/remove key listener
  useEffect(() => {
    const ref = containerRef.current;
    if (ref) ref.focus();

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // --- Click handlers ---
  const handleRowClick = useCallback(
    (item: FileInfo, e: React.MouseEvent) => {
      e.preventDefault();
      onSelect(item.id, e.ctrlKey || e.metaKey, e.shiftKey);
    },
    [onSelect]
  );

  const handleDoubleClick = useCallback(
    (item: FileInfo, e: React.MouseEvent) => {
      e.preventDefault();
      onNavigate(item);
    },
    [onNavigate]
  );

  const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      // Clicking empty space clears selection
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex-grow-1 overflow-auto bg-white border-start"
      tabIndex={0}
      onClick={handleBackgroundClick}
      role="region"
      aria-label="File list"
    >
      <table className="table table-hover mb-0">
        <thead className="table-light sticky-top">
          <tr>
            <th style={{ width: "40%" }}>Name</th>
            <th style={{ width: "20%" }}>Date Created</th>
            <th style={{ width: "15%" }}>Type</th>
            <th style={{ width: "15%" }}>Size</th>
            <th style={{ width: "10%" }}>Hash</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center text-muted py-5">
                <Folder size={48} className="mb-3 opacity-25" />
                <div>This folder is empty</div>
              </td>
            </tr>
          ) : (
            items.map(item => {
              const isSelected = selectedItems.has(item.id);

              return (
                <tr
                  key={item.id}
                  onClick={e => handleRowClick(item, e)}
                  onDoubleClick={e => handleDoubleClick(item, e)}
                  className={isSelected ? "table-active" : ""}
                  style={{ cursor: "default", userSelect: "none" }}
                  role="row"
                  aria-selected={isSelected}
                >
                  <td>
                    <div className="d-flex align-items-center">
                      {item.type ? (
                        <Folder size={16} className="me-2 text-warning" />
                      ) : (
                        <File size={16} className="me-2 text-secondary" />
                      )}
                      <span className={item.type ? "fw-medium" : ""}>{item.name}</span>
                    </div>
                  </td>
                  <td className="text-muted small">
                    {FileSystemHelper.formatDate(item.created)}
                  </td>
                  <td className="text-muted small">
                    {item.type ? "File folder" : "File"}
                  </td>
                  <td className="text-muted small">
                    {FileSystemHelper.formatSize(item.size)}
                  </td>
                  <td className="text-muted small font-monospace">
                    {/* {formatHash(item.hash)} */}
                    {item.hash}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

// --------------------------------------------------------------------------------------------------------

// ============================================
// File: src/components/Files/DetailsView.tsx (Improved)
// ============================================

// import React, { useEffect, useCallback, useRef } from "react";
// import { Folder, File } from "lucide-react";
// import type { FileInfo } from "../../types/Files/FileSystemTypes";
// import { FileSystemHelper } from "../../utils/Files/FileSystemHelper";

// interface DetailsViewProps {
//   items: FileInfo[];
//   onNavigate: (item: FileInfo) => void;
//   onSelect: (id: number, isCtrlKey: boolean, isShiftKey: boolean) => void;
//   selectedItems: Set<number>;
// }

// export const DetailsView: React.FC<DetailsViewProps> = ({
//   items,
//   onNavigate,
//   onSelect,
//   selectedItems,
// }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const lastSelectedId = useRef<number | null>(null);

//   // --- Handle keyboard navigation ---
//   const handleKeyDown = useCallback(
//     (e: KeyboardEvent) => {
//       if (items.length === 0 || !containerRef.current?.contains(document.activeElement)) {
//         return;
//       }

//       const selectedArray = Array.from(selectedItems);
//       const currentId = selectedArray.length > 0 ? selectedArray[selectedArray.length - 1] : null;
//       const currentIndex = currentId !== null ? items.findIndex((i) => i.id === currentId) : -1;

//       if (e.key === "ArrowDown") {
//         e.preventDefault();
//         const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : currentIndex;
//         if (nextIndex >= 0 && nextIndex < items.length) {
//           onSelect(items[nextIndex].id, e.ctrlKey, e.shiftKey);
//         }
//       } else if (e.key === "ArrowUp") {
//         e.preventDefault();
//         const prevIndex = currentIndex > 0 ? currentIndex - 1 : 0;
//         if (prevIndex >= 0 && prevIndex < items.length) {
//           onSelect(items[prevIndex].id, e.ctrlKey, e.shiftKey);
//         }
//       } else if (e.key === "Enter" && currentId !== null) {
//         e.preventDefault();
//         const item = items.find((i) => i.id === currentId);
//         if (item?.type) {
//           onNavigate(item);
//         }
//       }
//     },
//     [items, selectedItems, onSelect, onNavigate]
//   );

//   // --- Add/remove keyboard listener with proper cleanup ---
//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;

//     // Focus container when items change to enable keyboard navigation
//     container.focus();

//     document.addEventListener("keydown", handleKeyDown);
//     return () => {
//       document.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [handleKeyDown]);

//   // --- Handle row click ---
//   const handleRowClick = useCallback((item: FileInfo, e: React.MouseEvent) => {
//     e.preventDefault();
//     onSelect(item.id, e.ctrlKey || e.metaKey, e.shiftKey);
//     lastSelectedId.current = item.id;
//   }, [onSelect]);

//   // --- Handle double click ---
//   const handleDoubleClick = useCallback((item: FileInfo, e: React.MouseEvent) => {
//     e.preventDefault();
//     if (item.type) {
//       onNavigate(item);
//     }
//   }, [onNavigate]);

//   // --- Handle background click (clear selection) ---
//   const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
//     if (e.target === e.currentTarget) {
//       // Clicking on empty space clears selection
//       lastSelectedId.current = null;
//     }
//   }, []);

//   return (
//     <div
//       ref={containerRef}
//       className="flex-grow-1 overflow-auto bg-white border-start"
//       tabIndex={0}
//       onClick={handleBackgroundClick}
//       role="region"
//       aria-label="File list"
//     >
//       <table className="table table-hover mb-0">
//         <thead className="table-light sticky-top">
//           <tr>
//             <th style={{ width: '40%' }}>Name</th>
//             <th style={{ width: '20%' }}>Date Created</th>
//             <th style={{ width: '15%' }}>Type</th>
//             <th style={{ width: '15%' }}>Size</th>
//             <th style={{ width: '10%' }}>Hash</th>
//           </tr>
//         </thead>
//         <tbody>
//           {items.length === 0 ? (
//             <tr>
//               <td colSpan={5} className="text-center text-muted py-5">
//                 <Folder size={48} className="mb-3 opacity-25" />
//                 <div>This folder is empty</div>
//               </td>
//             </tr>
//           ) : (
//             items.map((item) => {
//               const isSelected = selectedItems.has(item.id);
//               return (
//                 <tr
//                   key={item.id}
//                   onClick={(e) => handleRowClick(item, e)}
//                   onDoubleClick={(e) => handleDoubleClick(item, e)}
//                   className={isSelected ? "table-active" : ""}
//                   style={{
//                     cursor: "default",
//                     userSelect: "none",
//                   }}
//                   role="row"
//                   aria-selected={isSelected}
//                 >
//                   <td>
//                     <div className="d-flex align-items-center">
//                       {item.type ? (
//                         <Folder size={16} className="me-2 text-warning" />
//                       ) : (
//                         <File size={16} className="me-2 text-secondary" />
//                       )}
//                       <span className={item.type ? "fw-medium" : ""}>
//                         {item.name}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="text-muted small">
//                     {FileSystemHelper.formatDate(item.created)}
//                   </td>
//                   <td className="text-muted small">
//                     {item.type ? "File folder" : "File"}
//                   </td>
//                   <td className="text-muted small">
//                     {item.type ? "—" : FileSystemHelper.formatSize(item.size)}
//                   </td>
//                   <td className="text-muted small font-monospace">
//                     {/* {item.hash.substring(0, 8)}... */}
//                     {item.hash}
//                   </td>
//                 </tr>
//               );
//             })
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };