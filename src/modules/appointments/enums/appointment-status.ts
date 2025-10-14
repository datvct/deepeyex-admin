export enum AppointmentStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELED = "CANCELED",
  COMPLETED = "COMPLETED",
  PENDING_ONLINE = "PENDING_ONLINE",
  CONFIRMED_ONLINE = "CONFIRMED_ONLINE",
  COMPLETED_ONLINE = "COMPLETED_ONLINE",
}

export const AppointmentStatusLabel: Record<AppointmentStatus, string> = {
  [AppointmentStatus.PENDING]: "Chờ xác nhận",
  [AppointmentStatus.CONFIRMED]: "Đã xác nhận",
  [AppointmentStatus.CANCELED]: "Đã hủy",
  [AppointmentStatus.COMPLETED]: "Hoàn thành",
  [AppointmentStatus.PENDING_ONLINE]: "Chờ tư vấn trực tuyến",
  [AppointmentStatus.CONFIRMED_ONLINE]: "Đang tư vấn trực tuyến",
  [AppointmentStatus.COMPLETED_ONLINE]: "Hoàn tất tư vấn trực tuyến",
};
