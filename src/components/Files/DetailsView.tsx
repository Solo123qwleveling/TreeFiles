// ============================================
// File: src/components/Files/DetailsView.tsx (Updated with Download)
// ============================================

import React, { useEffect, useCallback, useRef } from "react";
import { Folder, File, Download, CheckCircle, Edit3 } from "lucide-react";
import type { FileInfo } from "../../types/Files/FileSystemTypes";
import { FileSystemHelper } from "../../utils/Files/FileSystemHelper";

interface DetailsViewProps {
  items: FileInfo[];
  onNavigate: (item: FileInfo) => void;
  onSelect: (id: number, isCtrlKey: boolean, isShiftKey: boolean) => void;
  selectedItems: Set<number>;
  onDownload?: (fileId: number) => void;
}

export const DetailsView: React.FC<DetailsViewProps> = ({
  items,
  onNavigate,
  onSelect,
  selectedItems,
  onDownload,
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

  const handleDownloadClick = useCallback(
    (e: React.MouseEvent, fileId: number) => {
      e.stopPropagation();
      if (onDownload) {
        onDownload(fileId);
      }
    },
    [onDownload]
  );

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
            <th style={{ width: "35%" }}>Name</th>
            <th style={{ width: "15%" }}>Date Created</th>
            <th style={{ width: "10%" }}>Type</th>
            <th style={{ width: "12%" }}>Size</th>
            <th style={{ width: "13%" }}>Status</th>
            <th style={{ width: "15%" }} className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center text-muted py-5">
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
                  {/* Name */}
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

                  {/* Date Created */}
                  <td className="text-muted small">
                    {FileSystemHelper.formatDate(item.created)}
                  </td>

                  {/* Type */}
                  <td className="text-muted small">
                    {item.type ? "Folder" : "File"}
                  </td>

                  {/* Size */}
                  <td className="text-muted small">
                    {FileSystemHelper.formatSize(item.size)}
                  </td>

                  {/* Status */}
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      {item.isState && (
                        <span 
                          className="badge bg-success d-flex align-items-center gap-1" 
                          style={{ fontSize: '0.7rem' }}
                          title="Downloaded"
                        >
                          <CheckCircle size={12} />
                          Downloaded
                        </span>
                      )}
                      {item.isChange && (
                        <span 
                          className="badge bg-warning text-dark d-flex align-items-center gap-1" 
                          style={{ fontSize: '0.7rem' }}
                          title="Modified"
                        >
                          <Edit3 size={12} />
                          Modified
                        </span>
                      )}
                      {!item.isState && !item.isChange && !item.type && (
                        <span 
                          className="badge bg-secondary" 
                          style={{ fontSize: '0.7rem' }}
                        >
                          Not Downloaded
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="text-center">
                    {!item.type && (
                      <button
                        className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1"
                        onClick={(e) => handleDownloadClick(e, item.id)}
                        style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                        title={`Download ${item.name}`}
                      >
                        <Download size={14} />
                        Download
                      </button>
                    )}
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