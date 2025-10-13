import { Outlet } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import HeaderLayout from "./HeaderLayout";
import React from "react";
import Sidebar from "../shares/components/SideBar";
import { useWebSocket } from "../hooks/useWebSocket";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeyEnum } from "../shares/enums/queryKey";
import { useSelector } from "react-redux";
import { RootState } from "../shares/stores";
import dayjs from "dayjs";

export default function MainLayout() {
  const queryClient = useQueryClient();
  const { doctor } = useSelector((state: RootState) => state.auth);

  // WebSocket global listener - chạy khi MainLayout mount
  useWebSocket({
    onNewAppointment: (message) => {
      const newAppointment = message.payload.appointment;

      // console.log("📨 WebSocket NEW APPOINTMENT received:", message);

      // Hiển thị toast notification
      toast.success(`🔔 Có lịch hẹn mới từ ${newAppointment.patient?.full_name || "bệnh nhân"}`, {
        autoClose: 8000,
        position: "top-right",
      });

      // Invalidate queries để refetch data
      // Chỉ invalidate data của doctor hiện tại
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.Appointment, "doctor", doctor?.doctor_id],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.TimeSlot, "doctor", doctor?.doctor_id],
      });
    },
    onUpdateAppointment: (message) => {
      const updatedAppointment = message.payload.appointment;

      // console.log("📨 WebSocket UPDATE APPOINTMENT received:", message);

      toast.info(`📝 Lịch hẹn ${updatedAppointment.appointment_code} được cập nhật`, {
        autoClose: 5000,
        position: "top-right",
      });

      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.Appointment, "doctor", doctor?.doctor_id],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.TimeSlot, "doctor", doctor?.doctor_id],
      });
    },
    onCancelAppointment: (message) => {
      const cancelledAppointment = message.payload.appointment;

      toast.warning(`❌ Lịch hẹn ${cancelledAppointment.appointment_code} bị hủy`, {
        autoClose: 5000,
        position: "top-right",
      });

      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.Appointment, "doctor", doctor?.doctor_id],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.TimeSlot, "doctor", doctor?.doctor_id],
      });
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        style={{ zIndex: 9999 }}
      />

      <main className="flex h-screen overflow-hidden">
        <Sidebar />

        <section className="flex-1 flex flex-col overflow-y-auto p-2 pt-0">
          <HeaderLayout />
          <div className="flex-1 px-2 pt-2">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
}
