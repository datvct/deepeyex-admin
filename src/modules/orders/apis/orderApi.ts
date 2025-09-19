// src/apis/OrderApi.ts
import { AxiosInstance } from "axios";
import api from "../../../shares/configs/axios";
import {
  DeleteOrderResponse,
  GetOrderResponse,
  ListOrdersResponse,
  UpdateOrderStatusResponse,
} from "../types/response";
import { UpdateOrderStatusRequest } from "../types/body";

const endpoint = "/hospital/orders";

class OrderClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  // ---------------- List All Orders ----------------
  async getAll(): Promise<ListOrdersResponse> {
    const response = await this.client.get<ListOrdersResponse>(endpoint);
    return response.data;
  }

  // // ---------------- Create a New Order ----------------
  // async create(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
  //   const response = await this.client.post<CreateOrderResponse>(endpoint, orderData);
  //   return response.data;
  // }

  // ---------------- Get Orders by Patient ID ----------------
  async getByPatientId(patientId: string): Promise<ListOrdersResponse> {
    const response = await this.client.get<ListOrdersResponse>(`${endpoint}/patient/${patientId}`);
    return response.data;
  }

  // ---------------- Get Order by ID ----------------
  async getById(orderId: string): Promise<GetOrderResponse> {
    const response = await this.client.get<GetOrderResponse>(`${endpoint}/${orderId}`);
    return response.data;
  }

  // // ---------------- Update Order Details ----------------
  // async updateDetail(
  //   orderId: string,
  //   updateData: UpdateOrderDetailRequest,
  // ): Promise<UpdateOrderDetailResponse> {
  //   const response = await this.client.put<UpdateOrderDetailResponse>(
  //     `${endpoint}/${orderId}/detail`,
  //     updateData,
  //   );
  //   return response.data;
  // }

  // ---------------- Update Order Status ----------------
  async updateStatus(
    orderId: string,
    status: UpdateOrderStatusRequest,
  ): Promise<UpdateOrderStatusResponse> {
    const response = await this.client.put<UpdateOrderStatusResponse>(
      `${endpoint}/${orderId}/status`,
      status,
    );
    return response.data;
  }

  // ---------------- Delete Order ----------------
  async delete(orderId: string): Promise<DeleteOrderResponse> {
    const response = await this.client.delete<DeleteOrderResponse>(`${endpoint}/${orderId}`);
    return response.data;
  }
}

const OrderApi = new OrderClient();
export { OrderApi };
