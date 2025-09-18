// src/apis/authApi.ts
import { AxiosInstance } from "axios";
import api from "../../../shares/configs/axios";

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
  firebase_uid?: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginFirebaseRequest = {
  firebase_uid: string;
  email: string;
};

export type TokenResponse = {
  access_token: string;
  access_expire: string;
  user_id?: string;
  role?: string;
};

export type SuccessResponse<T = unknown> = {
  status: number;
  message: string;
  data?: T;
};

export type ErrorResponse = {
  status: number;
  message: string;
};

class AuthClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  // ---------------- Register ----------------
  async register(form: RegisterRequest): Promise<SuccessResponse> {
    const response = await this.client.post<SuccessResponse>("/public/register", form);
    return response.data;
  }

  // ---------------- Login ----------------
  async login(form: LoginRequest): Promise<SuccessResponse<TokenResponse>> {
    const response = await this.client.post<SuccessResponse<TokenResponse>>("/public/login", form);
    return response.data;
  }

  // ---------------- Login Firebase ----------------
  async loginFirebase(form: LoginFirebaseRequest): Promise<SuccessResponse<TokenResponse>> {
    const response = await this.client.post<SuccessResponse<TokenResponse>>(
      "/public/login/firebase",
      form,
    );
    return response.data;
  }

  // ---------------- Refresh Token ----------------
  async refresh(): Promise<SuccessResponse<TokenResponse>> {
    const response = await this.client.post<SuccessResponse<TokenResponse>>("/public/refresh");
    return response.data;
  }

  // ---------------- Logout ----------------
  async logout(): Promise<SuccessResponse> {
    const response = await this.client.post<SuccessResponse>("/public/logout");
    return response.data;
  }

  // ---------------- Get Current User ----------------
  async me(): Promise<SuccessResponse<{ user_id: string; role: string }>> {
    const response = await this.client.get<SuccessResponse<{ user_id: string; role: string }>>(
      "/private/me",
    );
    return response.data;
  }
}

const AuthApi = new AuthClient();
export { AuthApi };
