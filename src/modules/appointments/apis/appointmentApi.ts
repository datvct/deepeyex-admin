// src/apis/AppointmentApi.ts
import { AxiosInstance } from "axios";
import api from "../../../shares/configs/axios";
import {
  DeleteAppointmentResponse,
  GetAppointmentResponse,
  ListAppointmentsResponse,
  UpdateAppointmentStatusResponse,
} from "../types/response";
import { UpdateAppointmentStatusRequest } from "../types/body";

const endpoint = "/appointments";

class AppointmentClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  // ---------------- List All Appointments ----------------
  async getAll(): Promise<ListAppointmentsResponse> {
    const response = await this.client.get<ListAppointmentsResponse>(endpoint);
    return response.data;
  }

  // // ---------------- Create a New Appointment ----------------
  // async create(data: CreateAppointmentRequest): Promise<GetAppointmentResponse> {
  //   const response = await this.client.post<GetAppointmentResponse>(endpoint, data);
  //   return response.data;
  // }

  // ---------------- Get Appointments by Patient ID ----------------
  async getByPatientId(patientId: string): Promise<ListAppointmentsResponse> {
    const response = await this.client.get<ListAppointmentsResponse>(
      `${endpoint}/patient/${patientId}`,
    );
    return response.data;
  }

  // ---------------- Get Appointment by ID ----------------
  async getById(appointmentId: string): Promise<GetAppointmentResponse> {
    const response = await this.client.get<GetAppointmentResponse>(`${endpoint}/${appointmentId}`);
    return response.data;
  }

  // ---------------- Update Appointment Status ----------------
  async updateStatus(
    appointmentId: string,
    status: UpdateAppointmentStatusRequest,
  ): Promise<UpdateAppointmentStatusResponse> {
    const response = await this.client.put<UpdateAppointmentStatusResponse>(
      `${endpoint}/${appointmentId}/status`,
      status,
    );
    return response.data;
  }

  // ---------------- Delete Appointment ----------------
  async delete(appointmentId: string): Promise<DeleteAppointmentResponse> {
    const response = await this.client.delete<DeleteAppointmentResponse>(
      `${endpoint}/${appointmentId}`,
    );
    return response.data;
  }
}

const AppointmentApi = new AppointmentClient();
export { AppointmentApi };
