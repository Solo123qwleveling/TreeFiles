// // ============================================
// // File: src/components/Files/DetailsView.tsx
// // ============================================

// import React, { useState, useEffect, useCallback } from "react";
// import { Folder, File } from "lucide-react";
// import type { FileInfo } from "../../types/Files/FileSystemTypes";
// import { FileSystemHelper } from "../../utils/Files/FileSystemHelper";

// interface DetailsViewProps {
//   items: FileInfo[];
//   onNavigate: (item: FileInfo) => void;
//   onSelect: (id: number) => void;
//   selectedItem: number | null;
// }

// export const DetailsView: React.FC<DetailsViewProps> = ({
//   items,
//   onNavigate,
//   onSelect,
//   selectedItem,
// }) => {
//   // --- Handle keyboard navigation like Explorer ---
//   const handleKeyDown = useCallback(
//     (e: KeyboardEvent) => {
//       if (items.length === 0) return;

//       const currentIndex = items.findIndex((i) => i.id === selectedItem);
//       if (e.key === "ArrowDown") {
//         e.preventDefault();
//         const next =
//           currentIndex < items.length - 1 ? currentIndex + 1 : items.length - 1;
//         onSelect(items[next].id);
//       } else if (e.key === "ArrowUp") {
//         e.preventDefault();
//         const prev = currentIndex > 0 ? currentIndex - 1 : 0;
//         onSelect(items[prev].id);
//       } else if (e.key === "Enter" && selectedItem !== null) {
//         const item = items.find((i) => i.id === selectedItem);
//         if (item && item.type) onNavigate(item);
//       }
//     },
//     [items, selectedItem, onSelect, onNavigate]
//   );

//   useEffect(() => {
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [handleKeyDown]);

//   return (
//     <div className="flex-grow-1 overflow-auto bg-white border-start">
//       <table className="table table-hover mb-0">
//         <thead className="table-light sticky-top">
//           <tr>
//             <th>Name</th>
//             <th>Date Created</th>
//             <th>Type</th>
//             <th>Size</th>
//             <th>Hash</th>
//           </tr>
//         </thead>
//         <tbody>
//           {items.map((item) => {
//             const isSelected = selectedItem === item.id;
//             return (
//               <tr
//                 key={item.id}
//                 tabIndex={0}
//                 onClick={() => onSelect(item.id)} // ✅ single click selects
//                 onDoubleClick={() => item.type && onNavigate(item)} // ✅ double click opens folder
//                 className={isSelected ? "table-active" : ""}
//                 style={{
//                   cursor: "default",
//                   userSelect: "none",
//                 }}
//               >
//                 <td>
//                   <div className="d-flex align-items-center">
//                     {item.type ? (
//                       <Folder size={16} className="me-2 text-warning" />
//                     ) : (
//                       <File size={16} className="me-2 text-secondary" />
//                     )}
//                     {item.name}
//                   </div>
//                 </td>
//                 <td className="text-muted small">
//                   {FileSystemHelper.formatDate(item.created)}
//                 </td>
//                 <td className="text-muted small">
//                   {item.type ? "File folder" : "File"}
//                 </td>
//                 <td className="text-muted small">
//                   {FileSystemHelper.formatSize(item.size)}
//                 </td>
//                 <td className="text-muted small">{item.hash}</td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// ------------------------------------------------------------------------------------------------

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
