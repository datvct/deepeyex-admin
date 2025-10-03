import { Alert, Form, Input, Modal, Spin, Tag, Tooltip, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CrudTable from "../../shares/components/CrudTable";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../shares/enums/queryKey";
import { Appointment } from "../../modules/appointments/types/appointment";
import { useListAppointmentsQuery } from "../../modules/appointments/hooks/queries/use-get-appointments.query";
import { useUpdateAppointmentStatusMutation } from "../../modules/appointments/hooks/mutations/use-update-appointment-status.mutation";
import { AppointmentStatus } from "../../modules/appointments/enums/appointment-status";
import { useListHospitalsQuery } from "../../modules/hospitals/hooks/queries/use-get-hospitals.query";

export default function AppointmentsPage() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useListAppointmentsQuery();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const {
    data: hospitalData,
    isLoading: isLoadingHospitals,
    isError: isErrorHospitals,
  } = useListHospitalsQuery();

  const hospitalMap: Record<string, string> = {};
  if (hospitalData?.data) {
    hospitalData.data.forEach((h) => {
      hospitalMap[h.hospital_id] = h.name;
    });
  }

  // ---- Mutation: Update status ----
  const updateStatusMutation = useUpdateAppointmentStatusMutation({
    onSuccess: (data) => {
      toast.success(data.message || t("appointment.messages.update_success"));
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Appointment] });
    },
    onError: (error) => {
      toast.error(error.message || t("appointment.messages.update_error"));
    },
  });

  // Load dữ liệu vào state
  useEffect(() => {
    if (data?.data) {
      setAppointments(data.data);
    }
  }, [data]);

  // ---- Mở modal cập nhật trạng thái ----
  const handleEditStatus = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    form.setFieldsValue({
      appointment_id: appointment.appointment_id,
      full_name: appointment.patient.full_name,
      status: appointment.status,
    });
    setIsModalOpen(true);
  };

  // ---- Hủy lịch (cập nhật trạng thái CANCELED) ----
  const handleDelete = (appointment: Appointment) => {
    updateStatusMutation.mutate({
      appointment_id: appointment.appointment_id,
      status: AppointmentStatus.CANCELED,
    });
  };

  // ---- Submit form ----
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!selectedAppointment) return;
      updateStatusMutation.mutate({
        appointment_id: selectedAppointment.appointment_id,
        status: values.status,
      });
      setIsModalOpen(false);
      form.resetFields();
      setSelectedAppointment(null);
    } catch (err) {
      console.error(err);
    }
  };

  const statusColors: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]: "blue",
    [AppointmentStatus.CONFIRMED]: "green",
    [AppointmentStatus.CANCELED]: "red",
    [AppointmentStatus.COMPLETED]: "orange",
  };

  // ---- Cấu hình cột bảng ----
  const appointmentColumns = [
    {
      title: t("appointment.columns.index"),
      dataIndex: "index",
      key: "index",
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: t("appointment.columns.patient"),
      dataIndex: "patient",
      key: "patient",
      render: (patient: Appointment["patient"]) => (
        <div className="flex items-center gap-2">
          {patient.image && (
            <img
              src={patient.image}
              alt={patient.full_name}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div>
            <p className="font-medium">{patient.full_name || "-"}</p>
            <p className="text-sm text-gray-500">{patient.phone || "-"}</p>
          </div>
        </div>
      ),
    },
    {
      title: t("appointment.columns.timeSlot"),
      dataIndex: "time_slots",
      key: "time_slots",
      render: (slot: Appointment["time_slots"], record: Appointment) => {
        const doctor = slot[0].doctor;
        const hospitalName = hospitalMap[record.hospital_id] || "-";

        return (
          <div>
            <p>
              <strong>{t("appointment.doctor")}:</strong> {doctor?.full_name || "-"}
            </p>
            <p>
              <strong>{t("appointment.hospital")}:</strong> {hospitalName ?? "-"}
            </p>
            <p>
              <strong>{t("appointment.time")}:</strong>{" "}
              {new Date(slot[0].start_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              -{" "}
              {new Date(slot[0].end_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p>
              <strong>{t("appointment.quantity")}:</strong> {slot[0].capacity}
            </p>
          </div>
        );
      },
    },
    {
      title: t("appointment.columns.status"),
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={statusColors[status] || "default"}>
          {t(`appointment.status.${status.toLowerCase()}`)}
        </Tag>
      ),
    },
    {
      title: t("appointment.columns.notes"),
      dataIndex: "notes",
      key: "notes",
      render: (notes: string) => <p className="text-sm">{notes || "-"}</p>,
    },
  ];

  return (
    <>
      {isError && (
        <Alert
          message="Error"
          description={t("appointment.messages.load_error")}
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      <Spin spinning={isLoading}>
        <CrudTable
          title={t("appointment.title")}
          subtitle={t("appointment.subtitle")}
          rowKey="appointment_id"
          columns={appointmentColumns}
          dataSource={appointments}
          onEdit={handleEditStatus}
          onDelete={handleDelete}
        />
      </Spin>

      <Modal
        title={t("appointment.modal.title")}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setSelectedAppointment(null);
        }}
        centered
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item label={t("appointment.form.appointment_id")} name="appointment_id">
            <Input disabled />
          </Form.Item>
          <Form.Item label={t("appointment.form.full_name")} name="full_name">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label={t("appointment.form.status")}
            name="status"
            rules={[{ required: true, message: t("appointment.form.status_placeholder") }]}
          >
            <Select placeholder={t("appointment.form.status_placeholder")}>
              {Object.entries(AppointmentStatus).map(([key, value]) => (
                <Select.Option key={key} value={key}>
                  {t(`appointment.status.${key.toLowerCase()}`)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
