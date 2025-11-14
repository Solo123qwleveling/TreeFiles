// ============================================
// File: src/types/Files/FileSystemTypes.ts (Updated)
// ============================================

export interface FileInfo {
  id: number;
  name: string;
  size: number;
  created: Date;
  type: boolean; // true = folder, false = file
  isState: boolean; // true = downloaded, false = not downloaded
  isChange: boolean; // true = modified, false = not modified
  parentId: number;
}