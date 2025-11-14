// ============================================
// File: src/data/initialFileSystem.ts
// ============================================

import type { FileInfo } from '../types/Files/FileSystemTypes';
import { FileSystemArrayList } from '../utils/Files/FileSystemArrayList';

export const initialFileSystem: FileInfo[] = new FileSystemArrayList().getAll();
// [
  // // Root
  // { id: 1, name: 'This PC', size: 0, created: new Date('2025-01-01'), type: true, hash: 1001, parentId: 0 },

  // // C Drive
  // { id: 2, name: 'Local Disk (C:)', size: 0, created: new Date('2025-01-01'), type: true, hash: 1002, parentId: 1 },

  // // Program Files
  // { id: 3, name: 'Program Files', size: 0, created: new Date('2025-02-15'), type: true, hash: 1003, parentId: 2 },
  // { id: 4, name: 'Adobe', size: 0, created: new Date('2025-03-10'), type: true, hash: 1004, parentId: 3 },
  // { id: 5, name: 'Microsoft Office', size: 0, created: new Date('2025-03-12'), type: true, hash: 1005, parentId: 3 },

  // // Users
  // { id: 6, name: 'Users', size: 0, created: new Date('2025-01-05'), type: true, hash: 1006, parentId: 2 },

  // // Documents
  // { id: 7, name: 'Documents', size: 0, created: new Date('2025-04-01'), type: true, hash: 1007, parentId: 6 },
  // { id: 8, name: 'Report.docx', size: 2457600, created: new Date('2025-11-10'), type: false, hash: 2001, parentId: 7 },
  // { id: 9, name: 'Presentation.pptx', size: 5242880, created: new Date('2025-11-12'), type: false, hash: 2002, parentId: 7 },

  // // Downloads
  // { id: 10, name: 'Downloads', size: 0, created: new Date('2025-05-20'), type: true, hash: 1008, parentId: 6 },
  // { id: 11, name: 'setup.exe', size: 131072000, created: new Date('2025-11-01'), type: false, hash: 2003, parentId: 10 },

  // // Windows
  // { id: 12, name: 'Windows', size: 0, created: new Date('2025-01-01'), type: true, hash: 1009, parentId: 2 },

  // // D Drive
  // { id: 13, name: 'Local Disk (D:)', size: 0, created: new Date('2025-01-01'), type: true, hash: 1010, parentId: 1 },

  // // Projects
  // { id: 14, name: 'Projects', size: 0, created: new Date('2025-06-15'), type: true, hash: 1011, parentId: 13 },
  // { id: 15, name: 'index.html', size: 12288, created: new Date('2025-11-13'), type: false, hash: 2004, parentId: 14 },
  // { id: 16, name: 'style.css', size: 8192, created: new Date('2025-11-13'), type: false, hash: 2005, parentId: 14 },
// ];