// ============================================
// File: src/components/TreeViewItem.tsx
// ============================================

import React, { useRef } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen } from "lucide-react";
import type { FileInfo } from "../../types/Files/FileSystemTypes";
import type { FilePath } from './../../types';
import { useParams } from "react-router-dom";

interface TreeViewItemProps {
  item: FileInfo;
  level: number;
  isExpanded: boolean;
  isSelected: boolean;
  hasChildren: boolean;
  children?: React.ReactNode;
  onToggle: (id: number) => void;
  onNavigate: (item: FileInfo) => void;
  onAddContentsFolder: (path: FilePath) => void;
}

export const TreeViewItem: React.FC<TreeViewItemProps> = ({
  item,
  level,
  isExpanded,
  isSelected,
  hasChildren,
  children,
  onToggle,
  onNavigate,
  onAddContentsFolder
}) => {
  const { userId } = useParams();
  const isChildIcon = useRef<Set<Number>>(new Set());

  return (
    <div>
      {/* Main row */}
      <div
        className={`d-flex align-items-center ${isSelected ? "bg-primary bg-opacity-25" : ""}`}
        style={{
          paddingLeft: `${level * 16}px`,
          height: "24px",
          cursor: "default",
          userSelect: "none",
        }}
        onClick={(e) => {
          onAddContentsFolder({userId: Number(userId), parentId: item.id});
          e.stopPropagation();
          onNavigate(item);
        }}
      >
        {/* Chevron */}
        <div
          onClick={(e) => {
            onAddContentsFolder({userId: Number(userId), parentId: item.id});
            e.stopPropagation();
            if (hasChildren) onToggle(item.id);
          }}
          style={{
            width: "14px",
            marginRight: "4px",
            display: "flex",
            justifyContent: "center",
            cursor: hasChildren ? "pointer" : "default",
          }}
        >
          {
            (isExpanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            ))}
        </div>

        {/* Folder icon */}
        <div style={{ width: "16px", marginRight: "6px" }}>
          {isExpanded ? (
            <FolderOpen size={16} className="text-warning" />
          ) : (
            <Folder size={16} className="text-warning" />
          )}
        </div>

        {/* Folder name */}
        <span style={{ fontSize: "14px" }}>{item.name}</span>
      </div>

      {/* Children */}
      {isExpanded && <div>{children}</div>}
    </div>
  );
};
