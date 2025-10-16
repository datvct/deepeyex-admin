import React, { useState } from "react";
import { Appointment } from "../../modules/appointments/types/appointment";
import PatientProfileModal from "./components/PatientProfileModal";
import { Button } from "antd";
import { EyeOutlined, UserOutlined } from "@ant-design/icons";
import { mockInProgressAppointments } from "./mockData";

const DoctorConsultationPage: React.FC = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleViewPatientProfile = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
    setSelectedAppointment(null);
  };

  // Sử dụng mock data thay vì gọi API
  const inProgressAppointments = mockInProgressAppointments;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Đang khám bác sĩ</h1>
        <p className="text-gray-600">Danh sách lịch khám đang được thực hiện</p>
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
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserOutlined className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {appointment.patient.full_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Mã lịch: {appointment.appointment_code}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Bác sĩ</p>
                      <p className="text-gray-800">{appointment.doctor.full_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Chuyên khoa</p>
                      <p className="text-gray-800">{appointment.specialty}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Thời gian khám</p>
                      <p className="text-gray-800">
                        {appointment.time_slots[0]?.start_time} -{" "}
                        {appointment.time_slots[0]?.end_time}
                      </p>
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-600">Ghi chú</p>
                      <p className="text-gray-800 bg-gray-50 p-2 rounded">{appointment.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewPatientProfile(appointment)}
                    className="flex items-center gap-2"
                  >
                    Xem hồ sơ
                  </Button>
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
        />
      )}
    </div>
  );
};

export default DoctorConsultationPage;
