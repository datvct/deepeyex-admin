
import { AxiosInstance } from "axios";
import api from "../../../shares/configs/axios";
import { UploadFileResponse } from "../types/response";

const endpoint = "/hospital/upload";

class UploadClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  // ---------------- Upload File ----------------
  async uploadFile(file: File): Promise<UploadFileResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await this.client.post<UploadFileResponse>(endpoint, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  }
}

const UploadApi = new UploadClient();
export { UploadApi };
