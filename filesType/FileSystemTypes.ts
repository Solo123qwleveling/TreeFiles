// ============================================
// File: src/types/FileSystemTypes.ts
// ============================================
export interface FileInfo {
  id: number;
  name: string;
  size: number;
  created: Date;
  type: boolean; // true = folder, false = file
  isChange: boolean;
  isState: boolean;
  parentId: number;
}