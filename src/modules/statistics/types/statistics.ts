export interface AppointmentTimeline {
  date: string;
  count: number;
}

export interface OrderStatusStat {
  status: string;
  count: number;
}

export interface RevenueByService {
  service_id: string;
  service_name: string;
  revenue: number;
  order_count: number;
}

export interface StatisticsData {
  total_orders: number;
  total_revenue: number;
  total_bookings: number;
  completed_appointments: number;
  appointment_timeline: AppointmentTimeline[];
  order_status_stats: OrderStatusStat[];
  revenue_by_service: RevenueByService[];
}

export interface StatisticsResponse {
  status: number;
  message: string;
  data: StatisticsData;
}
