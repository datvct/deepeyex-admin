import axios from "axios";
import { SuccessResponse, TokenResponse } from "../../modules/auth/apis/authApi";

const rawAxios = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export async function refreshToken() {
  const res = await rawAxios.post<SuccessResponse<TokenResponse>>("/public/refresh");
  return res.data;
}
