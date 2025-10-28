// src/apis/AppointmentApi.ts
import { AxiosInstance } from "axios";
import api from "../../../shares/configs/axios";
import {
  DeleteAppointmentResponse,
  GetAppointmentResponse,
  ListAppointmentsResponse,
  UpdateAppointmentStatusResponse,
  EmergencyCancelAppointmentResponse,
} from "../types/response";
import { UpdateAppointmentStatusRequest } from "../types/body";
import {
  CreateFollowUpAppointmentBody,
  CreateFollowUpAppointmentResponse,
  CreatePendingFollowUpBody,
} from "../types/follow-up";

const endpoint = "/hospital/appointments";

class AppointmentClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  // ---------------- List All Appointments ----------------
  async getAll(params?: Record<string, any>): Promise<ListAppointmentsResponse> {
    const response = await this.client.get<ListAppointmentsResponse>(endpoint, { params });
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

  // ---------------- Get Appointment by doctorId ----------------
  async getByDoctorId(doctorId: string): Promise<ListAppointmentsResponse> {
    const response = await this.client.get<ListAppointmentsResponse>(
      `${endpoint}/doctor/${doctorId}`,
    );
    return response.data;
  }

  async getOnlineAppointments(params: {
    book_user_id?: string;
    doctorId?: string;
  }): Promise<ListAppointmentsResponse> {
    const response = await this.client.get<ListAppointmentsResponse>(
      `/hospital/appointments/online`,
      { params },
    );
    return response.data;
  }

  async getAppointmentsTodayByDoctorId(doctorId: string): Promise<ListAppointmentsResponse> {
    const response = await this.client.get<ListAppointmentsResponse>(
      `/hospital/appointments/today?doctor_id=${doctorId}`,
    );
    return response.data;
  }

  // ---------------- Create Follow-up Appointment ----------------
  async createFollowUp(
    body: CreateFollowUpAppointmentBody,
  ): Promise<CreateFollowUpAppointmentResponse> {
    const response = await this.client.post<CreateFollowUpAppointmentResponse>(
      `${endpoint}/follow-up`,
      body,
    );
    return response.data;
  }

  // ---------------- Create Pending Follow-up Appointment ----------------
  async createPendingFollowUp(
    body: CreatePendingFollowUpBody,
  ): Promise<CreateFollowUpAppointmentResponse> {
    const response = await this.client.post<CreateFollowUpAppointmentResponse>(
      `${endpoint}/pending-follow-up`,
      body,
    );
    return response.data;
  }

  // ---------------- Emergency Cancel Appointment ----------------
  async emergencyCancel(
    appointmentId: string,
    reason: string,
  ): Promise<EmergencyCancelAppointmentResponse> {
    const response = await this.client.put<EmergencyCancelAppointmentResponse>(
      `${endpoint}/${appointmentId}/emergency-cancel`,
      { reason },
    );
    return response.data;
  }

  // ---------------- Cancel Appointment ----------------
  async cancel(appointmentId: string): Promise<UpdateAppointmentStatusResponse> {
    const response = await this.client.put<UpdateAppointmentStatusResponse>(
      `${endpoint}/${appointmentId}/cancel`,
    );
    return response.data;
  }
}

const AppointmentApi = new AppointmentClient();
export { AppointmentApi };
