import axios, { type AxiosInstance } from "axios";
import type { User as AllUsers } from "../../types";

class RequestUser {

    private users: AxiosInstance;

    constructor() {
        this.users = axios.create({
        baseURL: "/api/TFs", // replace with your API base URL
        headers: { "Content-Type": "application/json" },
        });
    }

  // GET: fetch all users
  public async getUsers(): Promise<AllUsers[]> {
    // getUser.interceptors.request.use((config) => {
    //   const token = localStorage.getItem("token");
    //   if (token) {
    //     config.headers.Authorization = `${token}`;
    //   }
    //   return config;
    // });
    
    const response = await this.users.get<AllUsers[]>('/users');
    return response.data;
  }

  // POST: create a new user
//   public async createUser(user: Partial<AllUsers>): Promise<AllUsers> {
//     const response = await this.users.post<AllUsers>("/users", user);
//     return response.data;
//   }

//   // PUT: update an existing user
//   public async updateUser(id: number, user: Partial<AllUsers>): Promise<AllUsers> {
//     const response = await this.users.put<AllUsers>(`/users/${id}`, user);
//     return response.data;
//   }

//   // Optional: DELETE
//   public async deleteUser(id: number): Promise<void> {
//     await this.users.delete(`/users/${id}`);
//   }
}

export default new RequestUser();
