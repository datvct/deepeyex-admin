// src/modules/services/apis/serviceApi.ts
import api from "../../../shares/configs/axios";
import { CreateServiceBody, UpdateServiceBody, AssignServiceBody } from "../types/body";
import { ServiceResponse, ListServicesResponse } from "../types/response";
import { ApiResponse } from "../../../shares/types/response";

const BASE_URL = "/hospital/services";

export const ServiceApi = {
  // Lấy danh sách tất cả services
  getAll: async (params?: Record<string, any>): Promise<ListServicesResponse> => {
    const response = await api.get<ListServicesResponse>(BASE_URL, { params });
    return response.data;
  },

  // Lấy chi tiết service theo ID
  getById: async (serviceId: string): Promise<ServiceResponse> => {
    const response = await api.get<ServiceResponse>(`${BASE_URL}/${serviceId}`);
    return response.data;
  },

  // Lấy danh sách services của doctor
  getByDoctorId: async (doctorId: string): Promise<ListServicesResponse> => {
    const response = await api.get<ListServicesResponse>(`/hospital/doctors/${doctorId}/services`);
    return response.data;
  },

  // Tạo service mới
  create: async (body: CreateServiceBody): Promise<ServiceResponse> => {
    const response = await api.post<ServiceResponse>(BASE_URL, body);
    return response.data;
  },

  // Cập nhật service
  update: async (serviceId: string, body: UpdateServiceBody): Promise<ServiceResponse> => {
    const response = await api.put<ServiceResponse>(`${BASE_URL}/${serviceId}`, body);
    return response.data;
  },

  // Xóa service
  delete: async (serviceId: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`${BASE_URL}/${serviceId}`);
    return response.data;
  },

  // Gán service cho doctor
  assignToDoctor: async (body: AssignServiceBody): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>(`${BASE_URL}/assign`, body);
    return response.data;
  },

  // Xóa service khỏi doctor
  removeFromDoctor: async (doctorId: string, serviceId: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(
      `/hospital/doctors/${doctorId}/services/${serviceId}`,
    );
    return response.data;
  },
};
