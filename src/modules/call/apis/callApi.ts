import { AxiosInstance } from "axios";
import api from "../../../shares/configs/axios";

// Kiểu dữ liệu trả về
export interface StringeeTokenResponse {
  status: number;
  message: string;
  data: {
    token: string;
  };
}

const endpoint = "hospital/call/stringee-token";

class CallClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  // ---------------- Get Stringee Token ----------------
  async getStringeeToken(userId: string): Promise<StringeeTokenResponse> {
    const response = await this.client.get<StringeeTokenResponse>(endpoint, {
      params: { userId },
    });
    return response.data;
  }
}

const CallApi = new CallClient();
export { CallApi };
