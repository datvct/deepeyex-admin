// src/apis/TimeSlotApi.ts
import { AxiosInstance } from "axios";
import api from "../../../shares/configs/axios";
import {
  DeleteTimeSlotResponse,
  GetTimeSlotResponse,
  ListTimeSlotsResponse,
  UpdateTimeSlotResponse,
} from "../types/response";
import { CreateTimeSlotBody, UpdateTimeSlotBody } from "../types/body";

const endpoint = "/hospital/timeslots";

class TimeSlotClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  // ---------------- List All TimeSlots ----------------
  async listAll(): Promise<ListTimeSlotsResponse> {
    const response = await this.client.get<ListTimeSlotsResponse>(endpoint);
    return response.data;
  }

  // ---------------- Create TimeSlot ----------------
  async create(data: CreateTimeSlotBody): Promise<GetTimeSlotResponse> {
    const response = await this.client.post<GetTimeSlotResponse>(endpoint, data);
    return response.data;
  }

  // ---------------- Get TimeSlot by ID ----------------
  async getById(slotId: string): Promise<GetTimeSlotResponse> {
    const response = await this.client.get<GetTimeSlotResponse>(`${endpoint}/${slotId}`);
    return response.data;
  }

  // ---------------- Get TimeSlots by Doctor ID ----------------
  async getByDoctorId(doctorId: string): Promise<GetTimeSlotResponse> {
    const response = await this.client.get<GetTimeSlotResponse>(`${endpoint}/doctor/${doctorId}`);
    return response.data;
  }

  // ---------------- Update TimeSlot ----------------
  async update(slotId: string, data: UpdateTimeSlotBody): Promise<UpdateTimeSlotResponse> {
    const response = await this.client.put<UpdateTimeSlotResponse>(`${endpoint}/${slotId}`, data);
    return response.data;
  }

  // ---------------- Delete TimeSlot ----------------
  async delete(slotId: string): Promise<DeleteTimeSlotResponse> {
    const response = await this.client.delete<DeleteTimeSlotResponse>(`${endpoint}/${slotId}`);
    return response.data;
  }
}

const TimeSlotApi = new TimeSlotClient();
export { TimeSlotApi };
