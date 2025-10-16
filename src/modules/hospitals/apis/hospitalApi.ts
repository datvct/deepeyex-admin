// src/apis/HospitalApi.ts
import { AxiosInstance } from "axios";
import api from "../../../shares/configs/axios";
import { CreateHospitalBody } from "../types/body";
import {
  CreateHospitalResponse,
  DeleteHospitalResponse,
  ListHospitalsResponse,
  UpdateHospitalResponse,
} from "../types/response";
import { Hospital } from "../types/hospital";

const endpoint = "/hospital/hospitals";

class HospitalClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  // ---------------- Create Hospital ----------------
  async create(form: FormData): Promise<CreateHospitalResponse> {
    const response = await this.client.post<CreateHospitalResponse>(endpoint, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  // ---------------- List All Hospitals ----------------
  async getAll(params?: Record<string, any>): Promise<ListHospitalsResponse> {
    const response = await this.client.get<ListHospitalsResponse>(endpoint, { params });
    return response.data;
  }

  // ---------------- Get Hospital By HospitalID ----------------
  async getById(hospitalId: string): Promise<Hospital> {
    const response = await this.client.get<Hospital>(`${endpoint}/${hospitalId}`);
    return response.data;
  }

  // ---------------- Update Hospital ----------------
  async update(hospitalId: string, updateData: FormData): Promise<UpdateHospitalResponse> {
    const response = await this.client.put<UpdateHospitalResponse>(
      `${endpoint}/${hospitalId}`,
      updateData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  }

  async delete(hospitalId: string): Promise<DeleteHospitalResponse> {
    const response = await this.client.delete<DeleteHospitalResponse>(`${endpoint}/${hospitalId}`);
    return response.data;
  }
}

const HospitalApi = new HospitalClient();
export { HospitalApi };
