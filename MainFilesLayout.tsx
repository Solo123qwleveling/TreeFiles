import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FileSystemArrayList } from "../utils/Files/FileSystemArrayList";
import type { FileInfo } from "../types/Files/FileSystemTypes";
import { FileSystemHelper } from "../utils/Files/FileSystemHelper";
import { TitleBar } from "../components/Files/TitleBar";
import { AddressBar } from "../components/Files/AddressBar";
import { TreeView } from "../components/Files/TreeView";
import { DetailsView } from "../components/Files/DetailsView";
import { StatusBar } from "../components/Files/StatusBar";
import RequestFile from "../api/files/RequestFile";
import { useParams } from "react-router-dom";
import type { FilePath } from "../types";

export const MainFilesLayout: React.FC = () => {
  const [fileSystemList, setFileSystemList] = useState<FileSystemArrayList | null>(null);
  const { userId } = useParams();
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set([1]));
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [lastSelectedItem, setLastSelectedItem] = useState<number | null>(null);
  const [currentPath, setCurrentPath] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track loaded folders to prevent duplicate API calls
  const loadedFolders = useRef<Set<number>>(new Set());

  // --- Initial file system load ---
  useEffect(() => {
    const fetchFileSystemList = async () => {
      try {
        setLoading(true);
        setError(null);
        const files = await RequestFile.getMainFile(Number(userId));

        // Normalize date fields and mark root folders as loaded
        files.forEach((f: FileInfo) => {
          if (f.created && typeof f.created === "string") {
            f.created = new Date(f.created);
          }
          if (!f.parentId) {
            loadedFolders.current.add(f.id);
          }
        });

        const list = new FileSystemArrayList(files);
        setFileSystemList(list);
        
        // Set initial path to first root folder
        const rootFolders = list.findByParentId(0);
        if (rootFolders.length > 0 && rootFolders[0].type) {
          setCurrentPath([rootFolders[0]]);
        }
      } catch (err) {
        console.error("Error loading file system:", err);
        setError("Failed to load file system. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchFileSystemList();
    }
  }, [userId]);

  // --- Toggle folder expansion in tree view ---
  const toggleFolder = useCallback((id: number) => {
    setExpandedFolders((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  }, []);

  // --- Load folder contents (only once per folder) ---
  const loadFolderContents = useCallback(async (folderId: number) => {
    if (loadedFolders.current.has(folderId) || !userId || !fileSystemList) {
      return;
    }

    loadedFolders.current.add(folderId);

    try {
      const files = await RequestFile.getAllContentsFolder({
        userId: Number(userId),
        parentId: folderId,
      });
      
      fileSystemList.addAll(files);
      // Force re-render by creating new instance
      setFileSystemList(new FileSystemArrayList(fileSystemList.getAll()));
    } catch (err) {
      console.error("Error loading folder contents:", err);
      loadedFolders.current.delete(folderId); // Allow retry on failure
    }
  }, [userId, fileSystemList]);

  // --- Navigate to a folder ---
  const navigateToFolder = useCallback((item: FileInfo) => {
    if (item.type === true && fileSystemList) {
      const path = FileSystemHelper.buildPath(fileSystemList.getAll(), item.id);
      setCurrentPath(path);
      setSelectedItems(new Set([item.id]));
      setLastSelectedItem(item.id);
      
      // Load contents if not already loaded
      loadFolderContents(item.id);
    }
  }, [fileSystemList, loadFolderContents]);

  // --- Navigate to folder by clicking breadcrumb ---
  const navigateToBreadcrumb = useCallback((item: FileInfo) => {
    navigateToFolder(item);
  }, [navigateToFolder]);

  // --- Handle item selection (single/multi-select) ---
  const handleSelect = useCallback((id: number, isCtrlKey: boolean, isShiftKey: boolean) => {
    setSelectedItems((prev) => {
      const updated = new Set(prev);
      
      if (isShiftKey && lastSelectedItem !== null && currentContents.length > 0) {
        // Range selection
        const lastIndex = currentContents.findIndex(item => item.id === lastSelectedItem);
        const currentIndex = currentContents.findIndex(item => item.id === id);
        
        if (lastIndex !== -1 && currentIndex !== -1) {
          const start = Math.min(lastIndex, currentIndex);
          const end = Math.max(lastIndex, currentIndex);
          
          updated.clear();
          for (let i = start; i <= end; i++) {
            updated.add(currentContents[i].id);
          }
        }
      } else if (isCtrlKey) {
        // Toggle selection
        if (updated.has(id)) {
          updated.delete(id);
        } else {
          updated.add(id);
        }
      } else {
        // Single selection
        updated.clear();
        updated.add(id);
      }
      
      setLastSelectedItem(id);
      return updated;
    });
  }, [lastSelectedItem]);

  // --- Navigate up one level ---
  const navigateUp = useCallback(() => {
    if (currentPath.length > 1 && fileSystemList) {
      const parentFolder = currentPath[currentPath.length - 2];
      navigateToFolder(parentFolder);
    }
  }, [currentPath, fileSystemList, navigateToFolder]);

  // --- Derive current folder contents ---
  const currentContents = useMemo(() => {
    if (!fileSystemList || currentPath.length === 0) return [];
    const currentFolder = currentPath[currentPath.length - 1];
    return fileSystemList.findByParentId(currentFolder.id);
  }, [fileSystemList, currentPath]);

  // --- Selected item info for status bar ---
  const selectedItemInfo = useMemo(() => {
    if (selectedItems.size === 0) return undefined;
    if (selectedItems.size === 1) {
      const item = currentContents.find(i => i.id === Array.from(selectedItems)[0]);
      return item ? `${item.name} - ${FileSystemHelper.formatSize(item.size)}` : undefined;
    }
    
    const totalSize = currentContents
      .filter(i => selectedItems.has(i.id))
      .reduce((sum, item) => sum + item.size, 0);
    
    return `${selectedItems.size} items selected - ${FileSystemHelper.formatSize(totalSize)}`;
  }, [selectedItems, currentContents]);

  // --- Keyboard shortcuts ---
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      // Ctrl/Cmd + A: Select all
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        setSelectedItems(new Set(currentContents.map(item => item.id)));
      }
      
      // Backspace: Navigate up
      if (e.key === 'Backspace' && currentPath.length > 1) {
        e.preventDefault();
        navigateUp();
      }
      
      // Escape: Clear selection
      if (e.key === 'Escape') {
        setSelectedItems(new Set());
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [currentContents, currentPath, navigateUp]);

  // --- Loading state ---
  if (loading) {
    return (
      <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="text-muted">Loading file system...</div>
        </div>
      </div>
    );
  }

  // --- Error state ---
  if (error) {
    return (
      <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // --- Main render ---
  return (
    <div className="container-fluid vh-100 d-flex flex-column p-0">
      <TitleBar />
      <AddressBar 
        currentPath={currentPath} 
        onNavigate={navigateToBreadcrumb}
        onNavigateUp={currentPath.length > 1 ? navigateUp : undefined}
      />

      <div className="flex-grow-1 d-flex overflow-hidden">
        <TreeView
          fileSystemList={fileSystemList!}
          expandedFolders={expandedFolders}
          selectedItem={lastSelectedItem}
          onToggleFolder={toggleFolder}
          onNavigateToFolder={navigateToFolder}
          onLoadFolderContents={loadFolderContents}
        />

        <DetailsView
          items={currentContents}
          onNavigate={navigateToFolder}
          onSelect={handleSelect}
          selectedItems={selectedItems}
        />
      </div>

      <StatusBar
        itemCount={currentContents.length}
        selectedItemInfo={selectedItemInfo}
      />
    </div>
  );
};