import { AxiosInstance } from "axios";
import { DiagnosisResponse } from "../types/predict";
import api from "../../../shares/configs/axios";

const endpoint = "/retinal/predict";

class PredictClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  /**
   * Upload ảnh để AI chẩn đoán
   * @param file - File ảnh cần upload
   * @param topK - Số lượng kết quả dự đoán top K
   */
  async predict(file: File, topK = 3): Promise<DiagnosisResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await this.client.post<DiagnosisResponse>(
      `${endpoint}?top_k=${topK}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  }
}

const PredictApi = new PredictClient();
export { PredictApi };
