// ============================================
// File: src/api/files/RequestFile.ts
// ============================================
import axios, { type AxiosInstance } from 'axios';
// import type { FileNode } from '../../types';
import type { FileInfo } from '../../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import type { FilePath } from './../../types';

class RequestFile {

  private files: AxiosInstance;

  constructor() {
    this.files = axios.create({
      baseURL: "/api/TFs", // replace with your API base URL
      headers: { "Content-Type": "application/json" },
    });
  }

  // Get file tree for a user
  // async getUserFileMain(userId: number): Promise<FileNode[]> {
  //   try {
  //     const response = (await axios.get<FileNode[]>(`/api/users/${userId}`));
  //     return response.data;
  //   } catch (error) {
  //     console.error(`Error fetching file tree for user ${userId}:`, error);
  //     throw error;
  //   }
  // }

  public async getAll(userId: number): Promise<FileInfo[]> {
    try {
      const reponse = await this.files.get<FileInfo[]>(`/getAll/${userId}`);
      return reponse.data;
    } catch (error) {
      console.error(`Error fetching file tree for user ${userId}:`, error)
      throw error;
    }
  }

  public async getMainFile(userId: number): Promise<FileInfo[]> {

    try {
      const data = await this.files.get<FileInfo[]>(`/${userId}`);

      console.log("Successfully fetched main files");
      return data.data;

    } catch (error: any) {

      const status = error.response?.status;

      if (status === 401) {
        alert("User not found");
        console.error(`This user not found ${userId}`);
      } else if (status === 404) {
        console.warn(`This user not found files`);
        // alert("User has no files");
      } else {
        console.warn("Error fetching main files");
      }
    }
    return [];
  }



  public async getAllContentsFolder(path: FilePath): Promise<FileInfo[]> {
    try {
      const response = await this.files.post<FileInfo[]>(`/contents`, path);
      return response.data;
    } catch (error: any) {

      const status = error.response?.status;

      if (status === 401) {
        console.error(`This user not found ${path.userId}`);
      } else if (status === 404) {
        console.warn(`This user not found files ${path.parentId}`);
      } else {
        alert("Unexpected error loading files");
      }
    }
    return [];
  }

  public async requestFile(path: FilePath) {
    try {
      await this.files.post(`/request`, path);
      console.log("Successfully request file.");
    } catch (error: any) {
      const status = error.response?.status;

      if (status === 401) {
        console.warn(`This user not found ${path.userId}`);
      } else if (status === 404) {
        console.warn(`This user no connected to server ${path.parentId}`);
      } else {
        alert("Unexpected error loading files");
      }
    }
  }

  public async requestTreeFiles(userId: number) {
    // try {
    //   // await this.files.post();
    // }
  }

  // Download file
  // async downloadFile(filePath: string, fileName: string): Promise<void> {
  //   try {
  //     const response = await axios.get(`${API_BASE_URL}/api/files/download`, {
  //       params: { path: filePath },
  //       responseType: 'blob',
  //     });

  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.setAttribute('download', fileName);
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();
  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error('Error downloading file:', error);
  //     throw error;
  //   }
  // }

  // // Delete file or folder
  // async deleteFile(path: string): Promise<void> {
  //   try {
  //     await axios.delete(`${API_BASE_URL}/api/files`, {
  //       params: { path }
  //     });
  //   } catch (error) {
  //     console.error('Error deleting file:', error);
  //     throw error;
  //   }
  // }

  // Create folder
  // async createFolder(userId: number, folderPath: string): Promise<FileNode> {
  //   try {
  //     const response = await axios.post<FileNode>(`${API_BASE_URL}/api/users/${userId}/folders`, {
  //       path: folderPath
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error creating folder:', error);
  //     throw error;
  //   }
  // }
}

export default new RequestFile();
