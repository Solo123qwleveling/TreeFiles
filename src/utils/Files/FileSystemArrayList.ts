// ============================================
// File: src/utils/FileSystemArrayList.ts
// ============================================

import type { FileInfo } from '../../types/Files/FileSystemTypes';

export class FileSystemArrayList {
  private items: FileInfo[];

  constructor(initialItems: FileInfo[] = []) {
    this.items = initialItems;
  }

  // Add item to the list
  add(item: FileInfo): void {
    this.items.push(item);
  }

  addAll(itemsParem: FileInfo[]): void {
    this.items.push(...itemsParem);
  }

  // Get item by index
  get(index: number): FileInfo | undefined {
    return this.items[index];
  }

  // Get all items
  getAll(): FileInfo[] {
    return this.items;
  }

  // Remove item by id
  remove(id: number): boolean {
    const index = this.items.findIndex(item => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  // Find item by id
  findById(id: number): FileInfo | null {
    const item = this.items.find(item => item.id === id);
    return item || null;
  }

  existsFileById(id: number): boolean {
    return this.items.some(item => item.id === id && item.type === false);
  }

  // Find all children of a parent
  findByParentId(parentId: number): FileInfo[] {
    return this.items.filter(item => item.parentId === parentId);
  }

  // Get size of the list
  size(): number {
    return this.items.length;
  }

  // Clear all items
  clear(): void {
    this.items = [];
  }

  // Update an item
  update(id: number, updatedItem: Partial<FileInfo>): boolean {
    const index = this.items.findIndex(item => item.id === id);
    if (index !== -1) {
      this.items[index] = { ...this.items[index], ...updatedItem };
      return true;
    }
    return false;
  }

  // Check if item exists
  exists(id: number): boolean {
    return this.items.some(item => item.id === id);
  }

  // Get all folders
  getFolders(): FileInfo[] {
    return this.items.filter(item => item.type === true);
  }

  // Get all files
  getFiles(): FileInfo[] {
    return this.items.filter(item => item.type === false);
  }
}