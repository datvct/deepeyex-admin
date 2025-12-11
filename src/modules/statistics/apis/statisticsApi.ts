// src/modules/statistics/apis/statisticsApi.ts
import { AxiosInstance } from "axios";
import api from "../../../shares/configs/axios";
import { StatisticsResponse } from "../types/statistics";

const endpoint = "/hospital/statistics";

class StatisticsClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  // ---------------- Get Statistics ----------------
  async getAll(params?: { start_date?: string; end_date?: string }): Promise<StatisticsResponse> {
    const response = await this.client.get<StatisticsResponse>(endpoint, { params });
    return response.data;
  }
}

const StatisticsApi = new StatisticsClient();
export { StatisticsApi };
