import { AxiosInstance } from "axios";
import api from "../../../shares/configs/axios";
import { SuccessResponse } from "./authApi";
import { UpdatePasswordByEmailBody } from "../../users/types/body";

class UserClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  async resetPasswordByEmail(payload: UpdatePasswordByEmailBody): Promise<SuccessResponse> {
    const response = await this.client.post<SuccessResponse>("/public/reset-password", payload);
    return response.data;
  }
}

const UserApi = new UserClient();
export { UserApi };
