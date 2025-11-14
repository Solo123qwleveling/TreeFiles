// ============================================
// File: src/MainFilesLayout.tsx (Windows Style with Download)
// ============================================

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
import { useParams, useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

export const MainFilesLayout: React.FC = () => {
  const [fileSystemList, setFileSystemList] = useState<FileSystemArrayList | null>(null);
  const { userId } = useParams();
  const navigate = useNavigate();
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set([1]));
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [lastSelectedItem, setLastSelectedItem] = useState<number | null>(null);
  const [currentPath, setCurrentPath] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string>("");

  // Track loaded folders to prevent duplicate API calls
  const loadedFolders = useRef<Set<number>>(new Set());

  // Get current user info
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setCurrentUser(storedUsername);
    } else if (storedUserId) {
      setCurrentUser(`User ${storedUserId}`);
    }
  }, []);

  // Handle logout
  const handleLogout = useCallback(() => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      navigate('/login');
    }
  }, [navigate]);

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

  const requestFile = () => {
    const rq = async () => {
      if (!Number(userId)) {
        alert('User not found. Please log in again.');
        console.warn(`This user not found ${userId}`);
        return;
      }
      if (!lastSelectedItem) {
        alert('Please select a file first.');
        console.warn(`Not found file selected`);
        return;
      }
      if (!fileSystemList?.existsFileById(lastSelectedItem)) {
        alert('Please select a file, not a folder.');
        console.warn(`This Folder no file.`);
        return;
      }

      const selectedFile = fileSystemList.findById(lastSelectedItem);
      console.log('Request Download - User ID:', Number(userId), 'File ID:', lastSelectedItem);
      console.log('Selected File:', selectedFile);

      try {
        await RequestFile.requestFile({ 
          userId: Number(userId), 
          parentId: lastSelectedItem 
        });
        alert(`Download request sent for: ${selectedFile?.name}\nUser ID: ${userId}\nFile ID: ${lastSelectedItem}`);
      } catch (error) {
        console.error('Error requesting file:', error);
        alert('Failed to request download. Please try again.');
      }
    };
    rq();
  };

  // --- Handle download for specific file ---
  const handleDownloadFile = useCallback((fileId: number) => {
    const file = fileSystemList?.findById(fileId);
    if (!file || file.type) {
      alert('Cannot download folders. Please select a file.');
      return;
    }

    console.log('Download File - User ID:', Number(userId), 'File ID:', fileId);
    console.log('File to download:', file);

    const downloadRequest = async () => {
      try {
        await RequestFile.requestFile({ 
          userId: Number(userId), 
          parentId: fileId 
        });
        alert(`Download started for: ${file.name}\nUser ID: ${userId}\nFile ID: ${fileId}`);
      } catch (error) {
        console.error('Error downloading file:', error);
        alert('Failed to download file. Please try again.');
      }
    };

    downloadRequest();
  }, [userId, fileSystemList]);

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
      <div className="vh-100 d-flex align-items-center justify-content-center" style={{ background: '#f0f0f0' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="text-muted fw-medium">Loading File Explorer...</div>
        </div>
      </div>
    );
  }

  // --- Error state ---
  if (error) {
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center" style={{ background: '#f0f0f0' }}>
        <div className="card shadow" style={{ maxWidth: '500px' }}>
          <div className="card-body text-center p-4">
            <div className="text-danger mb-3">
              <svg width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
            </div>
            <h4 className="card-title mb-3">Error Loading Files</h4>
            <p className="text-muted mb-4">{error}</p>
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Main render (Windows 11 style) ---
  return (
    <div className="vh-100 d-flex flex-column" style={{ background: '#f3f3f3' }}>
      {/* Top Bar with User Info */}
      <div className="d-flex align-items-center justify-content-between px-3 py-2" style={{ background: '#202020', color: 'white' }}>
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.93 4.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
            </svg>
            <span className="fw-medium">File Explorer</span>
          </div>
        </div>
        
        <div className="d-flex align-items-center gap-3">
          {currentUser && (
            <div className="d-flex align-items-center gap-2" style={{ fontSize: '14px' }}>
              <User size={16} />
              <span>{currentUser}</span>
            </div>
          )}
          <button
            className="btn btn-sm btn-outline-light d-flex align-items-center gap-2"
            onClick={handleLogout}
            style={{ fontSize: '13px', padding: '4px 12px' }}
          >
            <LogOut size={14} />
            <span>Sign out</span>
          </button>
        </div>
      </div>

      {/* Main Window */}
      <div className="flex-grow-1 d-flex flex-column m-2 shadow-sm" style={{ background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
        <TitleBar onRequest={requestFile} />
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
            onDownload={handleDownloadFile}
          />
        </div>

        <StatusBar
          itemCount={currentContents.length}
          selectedItemInfo={selectedItemInfo}
        />
      </div>
    </div>
  );
};