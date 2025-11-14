// ============================================
// File: src/components/Files/DetailsView.tsx
// ============================================

import React, { useState, useEffect, useCallback } from "react";
import { Folder, File } from "lucide-react";
import type { FileInfo } from "../../types/Files/FileSystemTypes";
import { FileSystemHelper } from "../../utils/Files/FileSystemHelper";

interface DetailsViewProps {
  items: FileInfo[];
  onNavigate: (item: FileInfo) => void;
  onSelect: (id: number) => void;
  selectedItem: number | null;
}

export const DetailsView: React.FC<DetailsViewProps> = ({
  items,
  onNavigate,
  onSelect,
  selectedItem,
}) => {
  // --- Handle keyboard navigation like Explorer ---
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (items.length === 0) return;

      const currentIndex = items.findIndex((i) => i.id === selectedItem);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next =
          currentIndex < items.length - 1 ? currentIndex + 1 : items.length - 1;
        onSelect(items[next].id);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = currentIndex > 0 ? currentIndex - 1 : 0;
        onSelect(items[prev].id);
      } else if (e.key === "Enter" && selectedItem !== null) {
        const item = items.find((i) => i.id === selectedItem);
        if (item && item.type) onNavigate(item);
      }
    },
    [items, selectedItem, onSelect, onNavigate]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex-grow-1 overflow-auto bg-white border-start">
      <table className="table table-hover mb-0">
        <thead className="table-light sticky-top">
          <tr>
            <th>Name</th>
            <th>Date Created</th>
            <th>Type</th>
            <th>Size</th>
            <th>Hash</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const isSelected = selectedItem === item.id;
            return (
              <tr
                key={item.id}
                tabIndex={0}
                onClick={() => onSelect(item.id)} // ✅ single click selects
                onDoubleClick={() => item.type && onNavigate(item)} // ✅ double click opens folder
                className={isSelected ? "table-active" : ""}
                style={{
                  cursor: "default",
                  userSelect: "none",
                }}
              >
                <td>
                  <div className="d-flex align-items-center">
                    {item.type ? (
                      <Folder size={16} className="me-2 text-warning" />
                    ) : (
                      <File size={16} className="me-2 text-secondary" />
                    )}
                    {item.name}
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
                <td className="text-muted small">{item.hash}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
