// src/pages/doctor-consultation/components/FollowUpModal.tsx
import React, { useState } from "react";
import { Modal, Form, DatePicker, Select, Input, Button, Spin, Empty } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useCreateFollowUpMutation } from "../../../modules/appointments/hooks/mutations/use-create-follow-up.mutation";
import { useGetAvailableSlotsByDateQuery } from "../../../modules/time-slots/hooks/queries/use-get-available-slots-by-date.query";
import { useGetServicesByDoctorIdQuery } from "../../../modules/services/hooks/queries/use-get-services-by-doctor-id.query";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../shares/enums/queryKey";
import { toast } from "react-toastify";

interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  doctorId: string;
  hospitalId: string;
  bookUserId: string;
  relatedRecordId?: string;
}

interface FollowUpForm {
  follow_up_date: dayjs.Dayjs | null;
  slot_ids: string;
  service_name?: string;
  reason: string;
  notes?: string;
}

const FollowUpModal: React.FC<FollowUpModalProps> = ({
  isOpen,
  onClose,
  patientId,
  patientName,
  doctorId,
  hospitalId,
  bookUserId,
  relatedRecordId,
}) => {
  const [form] = Form.useForm<FollowUpForm>();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const queryClient = useQueryClient();

  // Query: Get available time slots by date
  const { data: timeSlotsData, isLoading: isLoadingSlots } = useGetAvailableSlotsByDateQuery({
    doctorId: doctorId,
    date: selectedDate,
    options: {
      enabled: !!selectedDate && !!doctorId,
    },
  });

  // Query: Get services by doctor
  const { data: servicesData, isLoading: isLoadingServices } = useGetServicesByDoctorIdQuery(
    doctorId,
    {
      enabled: !!doctorId && isOpen,
    },
  );

  // Mutation: Create Follow-up Appointment
  const createFollowUpMutation = useCreateFollowUpMutation({
    onSuccess: () => {
      toast.success("Đã hẹn tái khám thành công!");
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Appointment] });
      form.resetFields();
      setSelectedDate("");
      onClose();
    },
    onError: (error) => {
      toast.error("Lỗi hẹn tái khám: " + error.message);
    },
  });

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setSelectedDate(date.format("YYYY-MM-DD"));
      form.setFieldsValue({ slot_ids: undefined });
    } else {
      setSelectedDate("");
    }
  };

  const handleSubmit = (values: FollowUpForm) => {
    createFollowUpMutation.mutate({
      patient_id: patientId,
      doctor_id: doctorId,
      hospital_id: hospitalId,
      book_user_id: bookUserId,
      service_name: values.service_name || "",
      notes: values.reason + (values.notes ? `\n\nGhi chú: ${values.notes}` : ""),
      slot_ids: Array.isArray(values.slot_ids) ? values.slot_ids : [values.slot_ids],
      related_record_id: relatedRecordId,
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedDate("");
    onClose();
  };

  // Filter available slots
  const availableSlots =
    timeSlotsData?.data?.filter((slot) => {
      const slotDate = new Date(slot.start_time).toISOString().split("T")[0];
      const isCorrectDate = slotDate === selectedDate;
      const isAvailable = !slot.appointment_id;
      return isCorrectDate && isAvailable;
    }) || [];

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <CalendarOutlined className="text-green-600" />
          <span>Hẹn tái khám - {patientName}</span>
        </div>
      }
      open={isOpen}
      onCancel={handleCancel}
      width={700}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => form.submit()}
          loading={createFollowUpMutation.isPending}
        >
          Xác nhận hẹn tái khám
        </Button>,
      ]}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="follow_up_date"
          label="Ngày tái khám"
          rules={[{ required: true, message: "Vui lòng chọn ngày tái khám" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="DD/MM/YYYY"
            placeholder="Chọn ngày tái khám"
            disabledDate={(current) => current && current < dayjs().startOf("day")}
            onChange={handleDateChange}
          />
        </Form.Item>

        <Form.Item
          name="slot_ids"
          label="Khung giờ khám"
          rules={[{ required: true, message: "Vui lòng chọn khung giờ" }]}
        >
          <Select
            placeholder="Chọn khung giờ khám"
            loading={isLoadingSlots}
            disabled={!selectedDate}
          >
            {isLoadingSlots ? (
              <Select.Option value="" disabled>
                <Spin size="small" /> Đang tải...
              </Select.Option>
            ) : availableSlots.length === 0 ? (
              <Select.Option value="" disabled>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Không có khung giờ khả dụng"
                />
              </Select.Option>
            ) : (
              availableSlots.map((slot) => (
                <Select.Option key={slot.slot_id} value={slot.slot_id}>
                  {new Date(slot.start_time).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(slot.end_time).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Select.Option>
              ))
            )}
          </Select>
        </Form.Item>

        <Form.Item name="service_name" label="Dịch vụ khám">
          <Select
            placeholder="Chọn dịch vụ (tùy chọn)"
            allowClear
            showSearch
            loading={isLoadingServices}
            filterOption={(input, option) =>
              String(option?.children || "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {servicesData?.data?.map((service) => (
              <Select.Option key={service.service_id} value={service.name}>
                {service.name} - {service.price?.toLocaleString()} VNĐ
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="reason"
          label="Lý do tái khám"
          rules={[{ required: true, message: "Vui lòng nhập lý do tái khám" }]}
        >
          <Input.TextArea rows={3} placeholder="Nhập lý do tái khám..." />
        </Form.Item>

        <Form.Item name="notes" label="Ghi chú thêm">
          <Input.TextArea rows={2} placeholder="Ghi chú thêm (tùy chọn)..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FollowUpModal;
