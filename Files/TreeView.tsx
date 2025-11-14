// // ============================================
// // File: src/components/TreeView.tsx
// // ============================================

// import React from 'react';
// import { TreeViewItem } from './TreeViewItem';
// import type { FileInfo } from '../../types/Files/FileSystemTypes';
// import { FileSystemArrayList } from '../../utils/Files/FileSystemArrayList';
// import type { FilePath } from '../../types';

// interface TreeViewProps {
//   fileSystemList: FileSystemArrayList;
//   expandedFolders: Set<number>;
//   selectedItem: number | null;
//   onToggleFolder: (id: number) => void;
//   onNavigateToFolder: (item: FileInfo) => void;
//   onAddContentsFolder: (path: FilePath) => void;
// }


// export const TreeView: React.FC<TreeViewProps> = ({
//   fileSystemList,
//   expandedFolders,
//   selectedItem,
//   onToggleFolder,
//   onNavigateToFolder,
//   onAddContentsFolder
// }) => {
//   const renderTreeItem = (item: FileInfo, level: number = 0): React.ReactNode => {
//     if (!item.type) return null; // Only render folders in tree

//     const children = fileSystemList.findByParentId(item.id);
//     const folderChildren = children.filter(child => child.type);
//     const hasChildren = folderChildren.length > 0;
//     const isExpanded = expandedFolders.has(item.id);

//     return (
//       <TreeViewItem
//         key={item.id}
//         item={item}
//         level={level}
//         isExpanded={isExpanded}
//         isSelected={selectedItem === item.id}
//         hasChildren={hasChildren}
//         onToggle={onToggleFolder}
//         onNavigate={onNavigateToFolder}
//         onAddContentsFolder={onAddContentsFolder}
//       >
//         {folderChildren.map(child => renderTreeItem(child, level + 1))}
//       </TreeViewItem>

//     );
//   };

//   const rootItems = fileSystemList.findByParentId(0);

//   return (
//     <div className="border-end bg-white overflow-auto" style={{ width: '280px' }}>
//       <div className="p-2">
//         {rootItems.map(item => renderTreeItem(item))}
//       </div>
//     </div>
//   );
// };

// ------------------------------------------------------------------------------------------------

// ============================================
// File: src/components/TreeView.tsx (Improved)
// ============================================

import React, { memo } from 'react';
import { TreeViewItem } from './TreeViewItem';
import type { FileInfo } from '../../types/Files/FileSystemTypes';
import { FileSystemArrayList } from '../../utils/Files/FileSystemArrayList';

interface TreeViewProps {
  fileSystemList: FileSystemArrayList;
  expandedFolders: Set<number>;
  selectedItem: number | null;
  onToggleFolder: (id: number) => void;
  onNavigateToFolder: (item: FileInfo) => void;
  onLoadFolderContents: (folderId: number) => void;
}

const TreeViewComponent: React.FC<TreeViewProps> = ({
  fileSystemList,
  expandedFolders,
  selectedItem,
  onToggleFolder,
  onNavigateToFolder,
  onLoadFolderContents
}) => {
  const renderTreeItem = (item: FileInfo, level: number = 0): React.ReactNode => {
    if (!item.type) return null; // Only render folders in tree

    const children = fileSystemList.findByParentId(item.id);
    const folderChildren = children.filter(child => child.type);
    const hasChildren = folderChildren.length > 0;
    const isExpanded = expandedFolders.has(item.id);

    return (
      <TreeViewItem
        key={item.id}
        item={item}
        level={level}
        isExpanded={isExpanded}
        isSelected={selectedItem === item.id}
        hasChildren={hasChildren}
        onToggle={onToggleFolder}
        onNavigate={onNavigateToFolder}
        onLoadContents={onLoadFolderContents}
      >
        {isExpanded && folderChildren.map(child => renderTreeItem(child, level + 1))}
      </TreeViewItem>
    );
  };

  const rootItems = fileSystemList.findByParentId(0).filter(item => item.type);

  return (
    <div 
      className="border-end bg-white overflow-auto" 
      style={{ width: '280px', minWidth: '200px' }}
      role="tree"
      aria-label="Folder tree"
    >
      <div className="p-2">
        {rootItems.length === 0 ? (
          <div className="text-center text-muted py-3">
            <small>No folders found</small>
          </div>
        ) : (
          rootItems.map(item => renderTreeItem(item))
        )}
      </div>
    </div>
  );
};

// Memoize to prevent unnecessary re-renders
export const TreeView = memo(TreeViewComponent);
