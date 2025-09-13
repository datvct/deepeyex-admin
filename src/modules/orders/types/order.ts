import { Patient } from "../../patients/types/patient";
import { OrderStatus } from "../enums/order-status";
import { OrderItem } from "./order-item";

type Order = {
  order_id: string;
  patient_id: string;
  created_at: string;
  status: OrderStatus;
  total_amount: number;
  order_items: OrderItem[];
  patient: Patient;
};
export { Order };
