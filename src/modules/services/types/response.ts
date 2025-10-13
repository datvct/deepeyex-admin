// src/modules/services/types/response.ts
import { ApiResponse } from "../../../shares/types/response";
import { Service } from "./service";

export type ServiceResponse = ApiResponse<Service>;
export type ListServicesResponse = ApiResponse<Service[]>;
