type Drug = {
  drug_id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  stock_quantity: number;
  discount_percent: number;
  sold_quantity: number;
  created_at: string;
  updated_at: string;
};

export { Drug };
