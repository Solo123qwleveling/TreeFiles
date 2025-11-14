// // ============================================
// // File: src/components/TreeViewItem.tsx
// // ============================================

// import React, { useRef } from "react";
// import { ChevronRight, ChevronDown, Folder, FolderOpen } from "lucide-react";
// import type { FileInfo } from "../../types/Files/FileSystemTypes";
// import type { FilePath } from './../../types';
// import { useParams } from "react-router-dom";

// interface TreeViewItemProps {
//   item: FileInfo;
//   level: number;
//   isExpanded: boolean;
//   isSelected: boolean;
//   hasChildren: boolean;
//   children?: React.ReactNode;
//   onToggle: (id: number) => void;
//   onNavigate: (item: FileInfo) => void;
//   onAddContentsFolder: (path: FilePath) => void;
// }

// export const TreeViewItem: React.FC<TreeViewItemProps> = ({
//   item,
//   level,
//   isExpanded,
//   isSelected,
//   hasChildren,
//   children,
//   onToggle,
//   onNavigate,
//   onAddContentsFolder
// }) => {
//   const { userId } = useParams();
//   const isChildIcon = useRef<Set<Number>>(new Set());

//   return (
//     <div>
//       {/* Main row */}
//       <div
//         className={`d-flex align-items-center ${isSelected ? "bg-primary bg-opacity-25" : ""}`}
//         style={{
//           paddingLeft: `${level * 16}px`,
//           height: "24px",
//           cursor: "default",
//           userSelect: "none",
//         }}
//         onClick={(e) => {
//           onAddContentsFolder({userId: Number(userId), parentId: item.id});
//           e.stopPropagation();
//           onNavigate(item);
//         }}
//       >
//         {/* Chevron */}
//         <div
//           onClick={(e) => {
//             onAddContentsFolder({userId: Number(userId), parentId: item.id});
//             e.stopPropagation();
//             if (hasChildren) onToggle(item.id);
//           }}
//           style={{
//             width: "14px",
//             marginRight: "4px",
//             display: "flex",
//             justifyContent: "center",
//             cursor: hasChildren ? "pointer" : "default",
//           }}
//         >
//           {
//             (isExpanded ? (
//               <ChevronDown size={14} />
//             ) : (
//               <ChevronRight size={14} />
//             ))}
//         </div>

//         {/* Folder icon */}
//         <div style={{ width: "16px", marginRight: "6px" }}>
//           {isExpanded ? (
//             <FolderOpen size={16} className="text-warning" />
//           ) : (
//             <Folder size={16} className="text-warning" />
//           )}
//         </div>

//         {/* Folder name */}
//         <span style={{ fontSize: "14px" }}>{item.name}</span>
//       </div>

//       {/* Children */}
//       {isExpanded && <div>{children}</div>}
//     </div>
//   );
// };



// ============================================
// File: src/components/TreeViewItem.tsx (Improved)
// ============================================

import React, { memo, useCallback } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen } from "lucide-react";
import type { FileInfo } from "../../types/Files/FileSystemTypes";

interface TreeViewItemProps {
  item: FileInfo;
  level: number;
  isExpanded: boolean;
  isSelected: boolean;
  hasChildren: boolean;
  children?: React.ReactNode;
  onToggle: (id: number) => void;
  onNavigate: (item: FileInfo) => void;
  onLoadContents: (folderId: number) => void;
}

const TreeViewItemComponent: React.FC<TreeViewItemProps> = ({
  item,
  level,
  isExpanded,
  isSelected,
  hasChildren,
  children,
  onToggle,
  onNavigate,
  onLoadContents
}) => {
  // --- Handle chevron click ---
  const handleChevronClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isExpanded) {
      // Load contents before expanding
      onLoadContents(item.id);
    }
    
    if (hasChildren) {
      onToggle(item.id);
    }
  }, [isExpanded, hasChildren, item.id, onToggle, onLoadContents]);

  // --- Handle folder name click ---
  const handleFolderClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Load contents if not already loaded
    if (!isExpanded) {
      onLoadContents(item.id);
    }
    
    onNavigate(item);
  }, [isExpanded, item, onNavigate, onLoadContents]);

  return (
    <div role="treeitem" aria-expanded={isExpanded} aria-selected={isSelected}>
      {/* Main row */}
      <div
        className={`d-flex align-items-center ${isSelected ? "bg-primary bg-opacity-25 rounded" : ""}`}
        style={{
          paddingLeft: `${level * 16 + 4}px`,
          height: "28px",
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={handleFolderClick}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = "transparent";
          }
        }}
      >
        {/* Chevron */}
        <div
          onClick={handleChevronClick}
          style={{
            width: "20px",
            height: "20px",
            marginRight: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            borderRadius: "4px",
            visibility: hasChildren ? "visible" : "hidden"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          {isExpanded ? (
            <ChevronDown size={14} />
          ) : (
            <ChevronRight size={14} />
          )}
        </div>

        {/* Folder icon */}
        <div style={{ width: "18px", marginRight: "8px", display: "flex", alignItems: "center" }}>
          {isExpanded ? (
            <FolderOpen size={16} className="text-warning" />
          ) : (
            <Folder size={16} className="text-warning" />
          )}
        </div>

        {/* Folder name */}
        <span 
          style={{ 
            fontSize: "14px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
          title={item.name}
        >
          {item.name}
        </span>
      </div>

      {/* Children */}
      {isExpanded && children && <div>{children}</div>}
    </div>
  );
};

// Memoize to prevent unnecessary re-renders
export const TreeViewItem = memo(TreeViewItemComponent);