// src/apis/UserApi.ts
import { AxiosInstance } from "axios";
import api from "../../../shares/configs/axios";
import { CreateUserBody, UpdatePasswordByEmailBody, UpdateUserBody } from "../types/body";
import {
  CreateUserResponse,
  DeleteUserResponse,
  ListUsersResponse,
  UpdateUserResponse,
} from "../types/response";
import { User } from "../types/user";
import { SuccessResponse } from "../../auth/apis/authApi";

const endpoint = "/private/users";

class UserClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  // ---------------- Create User ----------------
  async create(userBody: CreateUserBody): Promise<CreateUserResponse> {
    const response = await this.client.post<CreateUserResponse>(endpoint, userBody);
    return response.data;
  }

  // ---------------- List All Users ----------------
  async getAll(params?: Record<string, any>): Promise<ListUsersResponse> {
    const response = await this.client.get<ListUsersResponse>(endpoint, { params });
    return response.data;
  }

  // ---------------- Get User By UserID ----------------
  async getById(userId: string): Promise<User> {
    const response = await this.client.get<User>(`${endpoint}/${userId}`);
    return response.data;
  }

  // ---------------- Update User ----------------
  async update(userId: string, updateData: UpdateUserBody): Promise<UpdateUserResponse> {
    const response = await this.client.put<UpdateUserResponse>(`${endpoint}/${userId}`, updateData);
    return response.data;
  }

  // ---------------- Delete User ----------------
  async delete(userId: string): Promise<DeleteUserResponse> {
    const response = await this.client.delete<DeleteUserResponse>(`${endpoint}/${userId}`);
    return response.data;
  }

  async resetPasswordByEmail(payload: UpdatePasswordByEmailBody): Promise<SuccessResponse> {
    const response = await this.client.post<SuccessResponse>("/public/reset-password", payload);
    return response.data;
  }
}

const UserApi = new UserClient();
export { UserApi };
