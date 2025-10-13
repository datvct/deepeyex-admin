// src/modules/services/types/body.ts

export type CreateServiceBody = {
  name: string;
  duration: number;
  price: number;
};

export type UpdateServiceBody = {
  name?: string;
  duration?: number;
  price?: number;
};

export type AssignServiceBody = {
  doctor_id: string;
  service_id: string;
};
