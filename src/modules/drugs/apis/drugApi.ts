// src/apis/DrugApi.ts
import { AxiosInstance } from "axios";
import api from "../../../shares/configs/axios";
import {
  CreateDrugResponse,
  DeleteDrugResponse,
  GetDrugResponse,
  ListDrugsResponse,
  UpdateDrugResponse,
} from "../types/response";

const endpoint = "/hospital/drugs";

class DrugClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  // ---------------- Create Drug ----------------
  async create(form: FormData): Promise<CreateDrugResponse> {
    const response = await this.client.post<CreateDrugResponse>(endpoint, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  // ---------------- List All Drugs ----------------
  async getAll(): Promise<ListDrugsResponse> {
    const response = await this.client.get<ListDrugsResponse>(endpoint);
    return response.data;
  }

  // ---------------- Get Drug By ID ----------------
  async getById(drugId: string): Promise<GetDrugResponse> {
    const response = await this.client.get<GetDrugResponse>(`${endpoint}/${drugId}`);
    return response.data;
  }

  // ---------------- Update Drug ----------------
  async update(drugId: string, updateData: FormData): Promise<UpdateDrugResponse> {
    const response = await this.client.put<UpdateDrugResponse>(
      `${endpoint}/${drugId}`,
      updateData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  }

  // ---------------- Delete Drug ----------------
  async delete(drugId: string): Promise<DeleteDrugResponse> {
    const response = await this.client.delete<DeleteDrugResponse>(`${endpoint}/${drugId}`);
    return response.data;
  }
}

const DrugApi = new DrugClient();
export { DrugApi };
