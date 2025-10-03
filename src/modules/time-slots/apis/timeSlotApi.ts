// src/apis/TimeSlotApi.ts
import { AxiosInstance } from "axios";
import api from "../../../shares/configs/axios";
import {
  CreateMultiShiftSlotsResponse,
  DeleteTimeSlotResponse,
  GetTimeSlotResponse,
  ListTimeSlotsResponse,
  UpdateTimeSlotResponse,
} from "../types/response";
import { CreateTimeSlotBody, UpdateTimeSlotBody } from "../types/body";
import { CreateMultiShiftSlotsBody } from "../types/time-slot";

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
  async getByDoctorId(doctorId: string): Promise<ListTimeSlotsResponse> {
    const response = await this.client.get<ListTimeSlotsResponse>(`${endpoint}/doctor/${doctorId}`);
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
  // ---------------- Batch Create TimeSlots ----------------
  createMultiShift = async (
    data: CreateMultiShiftSlotsBody,
  ): Promise<CreateMultiShiftSlotsResponse> => {
    const res = await this.client.post<CreateMultiShiftSlotsResponse>(
      `${endpoint}/multi-shift`,
      data,
    );
    return res.data;
  };

  // ---------------- Import Doctor Day-off (Excel) ----------------
  importDayOff = async (file: File): Promise<{ message: string }> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await this.client.post<{ message: string }>(`${endpoint}/import-dayoff`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  };

  // ---------------- Get TimeSlots by Doctor ID and month ----------------
  async getByDoctorIdAndMonth(doctorId: string, month: string): Promise<ListTimeSlotsResponse> {
    const response = await this.client.get<ListTimeSlotsResponse>(
      `${endpoint}/doctor/${doctorId}/month?month=${month}`,
    );
    return response.data;
  }

  // ---------------- Get TimeSlots by Doctor ID and date range ----------------
  async getByDoctorIdAndDateRange(
    doctorId: string,
    startDate: string,
    endDate: string,
  ): Promise<ListTimeSlotsResponse> {
    const response = await this.client.get<ListTimeSlotsResponse>(
      `${endpoint}/doctor/${doctorId}/date-range?start_date=${startDate}&end_date=${endDate}`,
    );
    return response.data;
  }
}

const TimeSlotApi = new TimeSlotClient();
export { TimeSlotApi };
