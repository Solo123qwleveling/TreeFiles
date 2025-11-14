// ============================================
// File: src/utils/FileSystemHelper.ts
// ============================================

import type { FileInfo } from '../../types/Files/FileSystemTypes';

export class FileSystemHelper {
  // Format file size in human-readable format
  static formatSize(bytes: number): string {
    if (bytes === 0) return '-';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${units[i]}`;
  }

  // Format date
  // static formatDate(date: Date): string {
  //   return date.toLocaleDateString('en-US', {
  //     month: '2-digit',
  //     day: '2-digit',
  //     year: 'numeric'
  //   });
  // }

  static formatDate(date: string | Date): string {
    const parsedDate = date instanceof Date ? date : new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  }

  // Build path from root to item
  static buildPath(items: FileInfo[], targetId: number): FileInfo[] {
    const path: FileInfo[] = [];
    let currentId = targetId;

    while (currentId !== 0) {
      const item = items.find(i => i.id === currentId);
      if (!item) break;
      path.unshift(item);
      currentId = item.parentId;
    }

    return path;
  }

  // Get all descendants of a folder (for recursive operations)
  static getDescendants(items: FileInfo[], parentId: number): FileInfo[] {
    const descendants: FileInfo[] = [];
    const children = items.filter(item => item.parentId === parentId);

    for (const child of children) {
      descendants.push(child);
      if (child.type) { // if folder
        descendants.push(...this.getDescendants(items, child.id));
      }
    }

    return descendants;
  }
}
