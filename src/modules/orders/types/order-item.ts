import { Drug } from "../../drugs/types/drug";

type OrderItem = {
  order_item_id: string;
  order_id: string;
  drug_id?: string;
  service_id?: string;
  item_name?: string;
  quantity: number;
  price: number;
  drug?: Drug;
  created_at: string;
  updated_at: string;
};

export { OrderItem };
