// src/apis/HospitalApi.ts
import { AxiosInstance } from "axios";
import api from "../../../shares/configs/axios";
import { CreateHospitalBody } from "../types/body";
import {
  CreateHospitalResponse,
  DeleteHospitalResponse,
  ListHospitalsResponse,
} from "../types/response";
import { Hospital } from "../types/hospital";

const endpoint = "/hospitals";

class HospitalClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  // ---------------- Create Hospital ----------------
  async create(hospitalBody: CreateHospitalBody): Promise<CreateHospitalResponse> {
    const response = await this.client.post<CreateHospitalResponse>(endpoint, hospitalBody);
    return response.data;
  }

  // ---------------- List All Hospitals ----------------
  async getAll(): Promise<ListHospitalsResponse> {
    const response = await this.client.get<ListHospitalsResponse>(endpoint);
    return response.data;
  }

  // ---------------- Get Hospital By HospitalID ----------------
  async getById(hospitalId: string): Promise<Hospital> {
    const response = await this.client.get<Hospital>(`${endpoint}/${hospitalId}`);
    return response.data;
  }

  // ---------------- Update Hospital ----------------
  async update(
    hospitalId: string,
    updateData: Partial<Omit<Hospital, "hospitalId" | "createdAt" | "updatedAt">>,
  ): Promise<Hospital> {
    const response = await this.client.put<Hospital>(`${endpoint}/${hospitalId}`, updateData);
    return response.data;
  }

  async delete(hospitalId: string): Promise<DeleteHospitalResponse> {
    const response = await this.client.delete<DeleteHospitalResponse>(`${endpoint}/${hospitalId}`);
    return response.data;
  }
}

const HospitalApi = new HospitalClient();
export { HospitalApi };
