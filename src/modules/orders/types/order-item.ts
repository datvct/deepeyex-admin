import { Drug } from "../../drugs/types/drug";

type OrderItem = {
  order_item_id: string;
  order_id: string;
  drug_id: string;
  quantity: number;
  price: number;
  drug: Drug;
};

export { OrderItem };
