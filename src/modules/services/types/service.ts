// src/modules/services/types/service.ts

export type Service = {
  service_id: string;
  name: string;
  duration: number; // Thời gian khám (phút)
  price: number; // Giá dịch vụ (VNĐ)
  created_at: string;
  updated_at: string;
};
