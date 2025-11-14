// ============================================
// File: src/MainFiles.tsx (Main Component)
// ============================================

import React, { useEffect, useState, useMemo, useRef } from "react";
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
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [currentPath, setCurrentPath] = useState<FileInfo[]>([]);
  // Parent component where TreeViewItem is used
  const loadedFolders = useRef<Set<number>>(new Set());

  // --- Load file system once on mount ---
  useEffect(() => {
    const fetchFileSystemList = async () => {
      try {
        const files = await RequestFile.getMainFile(Number(userId));

        // Normalize date fields to Date objects for consistency
        files.forEach((f: FileInfo) => {
          if (f.created && typeof f.created === "string") {
            f.created = new Date(f.created);
          }
          if (!f.parentId) {
            if (!loadedFolders.current.has(f.id)) {
              loadedFolders.current.add(f.id);
            };
          }
        });

        const list = new FileSystemArrayList(files);
        setFileSystemList(list);
      } catch (error) {
        console.error("Error loading file system:", error);
      }
    };

    fetchFileSystemList();
  }, [userId]);

  // --- Once loaded, set initial root path ---
  // useEffect(() => {
  //   if (!fileSystemList) return;
  //   const root = fileSystemList.findById(2);
  //   if (root) setCurrentPath([root]);
  // }, [fileSystemList]);

  // --- Toggle folder open/close in tree view ---
  const toggleFolder = (id: number) => {
    setExpandedFolders((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  };

  // --- Navigate to a folder (on double-click) ---
  const navigateToFolder = (item: FileInfo) => {
    if (item.type === true && fileSystemList) {
      setSelectedItem(item.id);
      const path = FileSystemHelper.buildPath(fileSystemList.getAll(), item.id);
      setCurrentPath(path);
    }
  };

  const addContentsFolder = async (path: FilePath) => {
    // 🔥 Prevent double-load
    if (loadedFolders.current.has(path.parentId)) {
      return; // Already loaded → skip
    }

    loadedFolders.current.add(path.parentId);

    try {
      const files = await RequestFile.getAllContentsFolder(path);
      fileSystemList?.addAll(files);
    } catch (error) {
      console.error("Error loading folder contents:", error);
    }
  };



  // --- Derive current folder contents ---
  const currentContents = useMemo(() => {
    if (!fileSystemList || currentPath.length === 0) return [];
    const currentFolder = currentPath[currentPath.length - 1];
    return fileSystemList.findByParentId(currentFolder.id);
  }, [fileSystemList, currentPath]);

  // --- Loading state ---
  if (!fileSystemList) {
    return (
      <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
        <div className="text-muted">Loading file system...</div>
      </div>
    );
  }

  // --- Render layout ---
  return (
    <div className="container-fluid vh-100 d-flex flex-column p-0">
      <TitleBar />
      <AddressBar currentPath={currentPath} />

      <div className="flex-grow-1 d-flex overflow-hidden">
        <TreeView
          fileSystemList={fileSystemList}
          expandedFolders={expandedFolders}
          selectedItem={selectedItem}
          onToggleFolder={toggleFolder}
          onAddContentsFolder={addContentsFolder}
          onNavigateToFolder={navigateToFolder}
        />


        {/* 👇 Double-click navigation handled inside DetailsView */}
        <DetailsView
          items={currentContents}
          onNavigate={navigateToFolder}
          onSelect={(id) => setSelectedItem(id)}   // ✅ single click updates selection
          selectedItem={selectedItem}              // ✅ highlight follows parent state
        />
      </div>

      <StatusBar
        itemCount={currentContents.length}
        selectedItemInfo={selectedItem ? `Selected ID: ${selectedItem}` : undefined}
      />
    </div>
  );
};