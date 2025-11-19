import React, { useState } from "react";
import { Appointment } from "../../modules/appointments/types/appointment";
import PatientProfileModal from "./components/PatientProfileModal";
import FollowUpModal from "./components/FollowUpModal";
import ViewMedicalRecordModal from "./components/ViewMedicalRecordModal";
import { Button, Spin, Alert, Modal, Input, message } from "antd";
import {
  EyeOutlined,
  UserOutlined,
  FileTextOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useGetAppointmentsTodayByDoctorIdQuery } from "../../modules/appointments/hooks/queries/use-get-appointments-today-by-doctor.query";
import { useSelector } from "react-redux";
import { RootState } from "../../shares/stores";
import { useEmergencyCancelAppointmentMutation } from "../../modules/appointments/hooks/mutations/use-emergency-cancel-appointment.mutation";
import { useUpdateAppointmentStatusMutation } from "../../modules/appointments/hooks/mutations/use-update-appointment-status.mutation";
import { AppointmentStatus } from "../../modules/appointments/enums/appointment-status";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../shares/enums/queryKey";
import { toast } from "react-toastify";
import { EmailApi } from "../../modules/emails/apis/emailApi";
import dayjs from "dayjs";

const DoctorConsultationPage: React.FC = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // State cho follow-up modal
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [savedRecordId, setSavedRecordId] = useState<string>("");
  const [followUpAppointment, setFollowUpAppointment] = useState<Appointment | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // State cho view medical record modal
  const [isViewRecordModalOpen, setIsViewRecordModalOpen] = useState(false);
  const [viewingPatientId, setViewingPatientId] = useState<string>("");
  const [viewingPatientName, setViewingPatientName] = useState<string>("");

  // State cho cancel appointment modal
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelingAppointment, setCancelingAppointment] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState<string>("");

  const { doctor, userId } = useSelector((state: RootState) => state.auth);
  const doctorId = doctor?.doctor_id || "";
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useGetAppointmentsTodayByDoctorIdQuery(doctorId);

  const emergencyCancelMutation = useEmergencyCancelAppointmentMutation({
    onSuccess: (data) => {
      message.success(
        data.data?.note || "Hủy lịch khám thành công và tự động chuyển đến bác sĩ thay thế!",
      );
      setIsCancelModalOpen(false);
      setCancelReason("");
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.Appointment, "today", doctorId],
      });
    },
    onError: (error: any) => {
      // Parse error message from response
      const errorMessage =
        error?.response?.data?.message || error?.message || "Có lỗi xảy ra khi hủy lịch khám!";

      toast.error("Không có bác sĩ nào thay thế! Vui lòng liên hệ với admin để được hỗ trợ.");
    },
  });

  const updateStatusMutation = useUpdateAppointmentStatusMutation({
    onSuccess: async () => {
      message.success("Cập nhật trạng thái thành công!");

      // Gửi email thông báo hủy lịch
      if (cancelingAppointment) {
        try {
          await EmailApi.sendCancelNotification({
            appointment_id: cancelingAppointment.appointment_id,
            patient_id: cancelingAppointment.patient_id,
            patient_name: cancelingAppointment.patient?.full_name || "",
            patient_email: cancelingAppointment.patient?.email || "",
            doctor_id: cancelingAppointment.doctor_id || "",
            doctor_name: cancelingAppointment.doctor?.full_name || "",
            hospital_id: cancelingAppointment.hospital_id || "",
            service_name: cancelingAppointment.service_name || "",
            appointment_date: cancelingAppointment.time_slots[0]?.start_time
              ? dayjs(cancelingAppointment.time_slots[0].start_time).format("DD/MM/YYYY")
              : "",
            appointment_time: cancelingAppointment.time_slots[0]?.start_time
              ? dayjs(cancelingAppointment.time_slots[0].start_time).format("HH:mm")
              : "",
            reason: cancelReason || "Hủy lịch khẩn cấp",
          });
        } catch (error) {
          console.error("Lỗi gửi email:", error);
          // Không hiển thị lỗi cho user vì trạng thái đã được update thành công
        }
      }

      setIsCancelModalOpen(false);
      setCancelReason("");
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.Appointment, "today", doctorId],
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Không thể cập nhật trạng thái!";
      message.error(errorMessage);
    },
  });

  // const {
  //   data: medicalRecordData,
  //   isLoading: isMedicalRecordLoading,
  //   isError: isMedicalRecordError,
  // } = useGetMedicalRecordByPatientIdQuery(appointment.patient_id, {
  //   enabled: !!appointment.patient_id,
  // });

  const handleViewPatientProfile = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleSaveSuccess = (recordId: string, appointment: Appointment) => {
    setSavedRecordId(recordId);
    setFollowUpAppointment(appointment);

    // Hiển thị confirm modal bằng state
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setShowConfirmModal(true);
      });
    });
  };

  const handleConfirmFollowUp = () => {
    setShowConfirmModal(false);
    setIsFollowUpModalOpen(true);
  };

  const handleCancelFollowUp = () => {
    setShowConfirmModal(false);
    setSavedRecordId("");
    setFollowUpAppointment(null);
  };

  const handleViewOldRecord = (patientId: string, patientName: string) => {
    setViewingPatientId(patientId);
    setViewingPatientName(patientName);
    setIsViewRecordModalOpen(true);
  };

  const handleCancelAppointment = (appointment: Appointment) => {
    setCancelingAppointment(appointment);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (!cancelingAppointment) return;

    // Sử dụng updateStatus thay vì emergencyCancel
    updateStatusMutation.mutate({
      appointment_id: cancelingAppointment.appointment_id,
      status: AppointmentStatus.CANCELED,
    });
  };

  const handleCancelCancelModal = () => {
    setIsCancelModalOpen(false);
    setCancelingAppointment(null);
    setCancelReason("");
  };

  const inProgressAppointments = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        type="error"
        message="Lỗi tải dữ liệu"
        description="Không thể tải danh sách lịch khám hôm nay. Vui lòng thử lại sau."
        showIcon
        className="m-4"
      />
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Danh sách khám bệnh</h1>
          <p className="text-gray-600">
            Danh sách lịch khám hôm nay ({inProgressAppointments.length})
          </p>
        </div>
      </div>

      {inProgressAppointments.length === 0 ? (
        <div className="text-center py-12">
          <UserOutlined className="text-6xl text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">
            Không có lịch khám nào đang diễn ra
          </h3>
          <p className="text-gray-400">Hiện tại không có bệnh nhân nào đang được khám</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {inProgressAppointments.map((appointment) => (
            <div
              key={appointment.appointment_id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {appointment.patient?.image ? (
                      <img
                        src={appointment.patient.image}
                        alt={appointment.patient.full_name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserOutlined className="text-blue-600 text-xl" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {appointment.patient?.full_name || "Không có thông tin"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Mã lịch: {appointment.appointment_code}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Dịch vụ</p>
                      <p className="text-gray-800">{appointment.service_name || "Không có"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Bệnh nhân</p>
                      <p className="text-gray-800">{appointment.patient?.phone || "Không có"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Trạng thái</p>
                      <p className="text-gray-800">
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            appointment.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : appointment.status === "CONFIRMED"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "COMPLETED"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {appointment.status === "PENDING"
                            ? "Chờ xác nhận"
                            : appointment.status === "CONFIRMED"
                            ? "Đã xác nhận"
                            : appointment.status === "COMPLETED"
                            ? "Hoàn thành"
                            : appointment.status}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Thời gian khám</p>
                      <p className="text-gray-800">
                        {appointment.time_slots[0]?.start_time
                          ? new Date(appointment.time_slots[0].start_time).toLocaleTimeString(
                              "vi-VN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )
                          : ""}{" "}
                        -{" "}
                        {appointment.time_slots[0]?.end_time
                          ? new Date(appointment.time_slots[0].end_time).toLocaleTimeString(
                              "vi-VN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Địa chỉ</p>
                      <p className="text-gray-800 text-sm">
                        {appointment.patient?.address || "Không có"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email</p>
                      <p className="text-gray-800 text-sm">
                        {appointment.patient?.email || "Không có"}
                      </p>
                    </div>
                  </div>

                  {appointment.notes && appointment.notes.trim() !== "" && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-600">Ghi chú</p>
                      <p className="text-gray-800 bg-amber-50 p-2 rounded border-l-4 border-amber-400">
                        {appointment.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewPatientProfile(appointment)}
                    size="large"
                    className="flex items-center gap-2"
                  >
                    Tạo hồ sơ
                  </Button>

                  {/* Nút xem hồ sơ cũ */}
                  <Button
                    icon={<FileTextOutlined />}
                    onClick={() =>
                      handleViewOldRecord(
                        appointment.patient_id,
                        appointment.patient?.full_name || "Bệnh nhân",
                      )
                    }
                    size="large"
                    className="flex items-center gap-2"
                  >
                    Xem hồ sơ cũ
                  </Button>

                  {/* Nút hủy lịch - chỉ hiện khi status PENDING hoặc CONFIRMED */}
                  {(appointment.status === AppointmentStatus.PENDING ||
                    appointment.status === AppointmentStatus.CONFIRMED) && (
                    <Button
                      danger
                      icon={<CloseCircleOutlined />}
                      onClick={() => handleCancelAppointment(appointment)}
                      size="large"
                      className="flex items-center gap-2"
                    >
                      Hủy lịch
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedAppointment && (
        <PatientProfileModal
          appointment={selectedAppointment}
          isOpen={isProfileModalOpen}
          onClose={handleCloseProfileModal}
          onSaveSuccess={handleSaveSuccess}
        />
      )}

      {/* Confirm Modal - Hỏi có muốn tạo lịch tái khám không */}
      <Modal
        title="Tạo hồ sơ thành công!"
        open={showConfirmModal}
        onOk={handleConfirmFollowUp}
        onCancel={handleCancelFollowUp}
        okText="Có, tạo lịch tái khám"
        cancelText="Không, đóng lại"
        centered
      >
        <p>Bạn có muốn tạo lịch hẹn tái khám cho bệnh nhân không?</p>
      </Modal>

      {/* Follow-up Modal - Render ở ngoài để không bị unmount */}
      {followUpAppointment && (
        <FollowUpModal
          isOpen={isFollowUpModalOpen}
          onClose={() => {
            setIsFollowUpModalOpen(false);
            setSavedRecordId("");
            setFollowUpAppointment(null);
          }}
          patientId={followUpAppointment.patient_id}
          patientName={followUpAppointment.patient.full_name}
          doctorId={followUpAppointment.doctor_id || ""}
          hospitalId={followUpAppointment.hospital_id}
          bookUserId={followUpAppointment.patient?.user_id || ""}
          relatedRecordId={savedRecordId}
        />
      )}

      {/* View Medical Record Modal */}
      {viewingPatientId && (
        <ViewMedicalRecordModal
          isOpen={isViewRecordModalOpen}
          onClose={() => {
            setIsViewRecordModalOpen(false);
            setViewingPatientId("");
            setViewingPatientName("");
          }}
          patientId={viewingPatientId}
          patientName={viewingPatientName}
        />
      )}

      {/* Cancel Appointment Modal */}
      <Modal
        title="Xác nhận hủy lịch khám"
        open={isCancelModalOpen}
        onOk={handleConfirmCancel}
        onCancel={handleCancelCancelModal}
        okText="Xác nhận hủy"
        cancelText="Hủy"
        okButtonProps={{ danger: true, loading: updateStatusMutation.isPending }}
        centered
      >
        <div className="space-y-4">
          {cancelingAppointment && (
            <>
              <p className="text-gray-700 mb-2">
                Bạn có chắc chắn muốn hủy lịch khám của bệnh nhân{" "}
                <strong>{cancelingAppointment.patient?.full_name}</strong>?
              </p>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Mã lịch:</strong> {cancelingAppointment.appointment_code}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Dịch vụ:</strong> {cancelingAppointment.service_name || "Khám tổng quát"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Thời gian:</strong>{" "}
                  {cancelingAppointment.time_slots[0]?.start_time &&
                    new Date(cancelingAppointment.time_slots[0].start_time).toLocaleString("vi-VN")}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do hủy (tùy chọn):
                </label>
                <Input.TextArea
                  rows={3}
                  placeholder="Ví dụ: Có ca khám gấp, bác sĩ nghỉ phép..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default DoctorConsultationPage;
