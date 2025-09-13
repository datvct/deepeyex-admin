// src/modules/appointments/enums/appointment-status.ts
export enum AppointmentStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELED = "CANCELED",
  COMPLETED = "COMPLETED",
}

export const AppointmentStatusLabel: Record<AppointmentStatus, string> = {
  [AppointmentStatus.PENDING]: "Chờ xác nhận",
  [AppointmentStatus.CONFIRMED]: "Đã xác nhận",
  [AppointmentStatus.CANCELED]: "Đã hủy",
  [AppointmentStatus.COMPLETED]: "Hoàn thành",
};
