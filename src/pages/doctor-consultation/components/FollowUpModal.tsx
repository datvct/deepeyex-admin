// src/pages/doctor-consultation/components/FollowUpModal.tsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Form, DatePicker, Select, Input, Button, Spin, Empty } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useCreateFollowUpMutation } from "../../../modules/appointments/hooks/mutations/use-create-follow-up.mutation";
import { useGetAvailableSlotsByDateQuery } from "../../../modules/time-slots/hooks/queries/use-get-available-slots-by-date.query";
import { useGetServiceByIdQuery } from "../../../modules/services/hooks/queries/use-get-service-by-id.query";
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
  const { t } = useTranslation();
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

  // Query: Get default service (ID cố định)
  const DEFAULT_SERVICE_ID = "23026186-21ff-4d1d-91af-0bb7cad6a691";
  const { data: serviceData, isLoading: isLoadingService } = useGetServiceByIdQuery(
    DEFAULT_SERVICE_ID,
    {
      enabled: isOpen,
    },
  );

  // Set default service name when modal opens and service data is loaded
  React.useEffect(() => {
    if (serviceData?.data && isOpen) {
      form.setFieldsValue({
        service_name: serviceData.data.name,
      });
    }
  }, [serviceData, isOpen, form]);

  // Mutation: Create Follow-up Appointment
  const createFollowUpMutation = useCreateFollowUpMutation({
    onSuccess: () => {
      toast.success(t("medicalRecord.followUpModal.success"));
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Appointment] });
      form.resetFields();
      setSelectedDate("");
      onClose();
    },
    onError: (error) => {
      toast.error(t("medicalRecord.followUpModal.error") + " " + error.message);
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
      notes:
        values.reason +
        (values.notes ? `\n\n${t("medicalRecord.viewModal.notes")}: ${values.notes}` : ""),
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
          <span>
            {t("medicalRecord.followUpModal.title")} - {patientName}
          </span>
        </div>
      }
      open={isOpen}
      onCancel={handleCancel}
      width={700}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          {t("medicalRecord.followUpModal.cancel")}
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => form.submit()}
          loading={createFollowUpMutation.isPending}
        >
          {t("medicalRecord.followUpModal.confirm")}
        </Button>,
      ]}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="follow_up_date"
          label={t("medicalRecord.followUpModal.followUpDate")}
          rules={[
            { required: true, message: t("medicalRecord.followUpModal.followUpDateRequired") },
          ]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="DD/MM/YYYY"
            placeholder={t("medicalRecord.followUpModal.followUpDatePlaceholder")}
            disabledDate={(current) => current && current < dayjs().startOf("day")}
            onChange={handleDateChange}
          />
        </Form.Item>

        <Form.Item
          name="slot_ids"
          label={t("medicalRecord.followUpModal.timeSlot")}
          rules={[{ required: true, message: t("medicalRecord.followUpModal.timeSlotRequired") }]}
        >
          <Select
            placeholder={t("medicalRecord.followUpModal.timeSlotPlaceholder")}
            loading={isLoadingSlots}
            disabled={!selectedDate}
          >
            {isLoadingSlots ? (
              <Select.Option value="" disabled>
                <Spin size="small" /> {t("medicalRecord.followUpModal.loading")}
              </Select.Option>
            ) : availableSlots.length === 0 ? (
              <Select.Option value="" disabled>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={t("medicalRecord.followUpModal.noSlotsAvailable")}
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

        <Form.Item name="service_name" label={t("medicalRecord.followUpModal.service")}>
          <Input
            placeholder={t("medicalRecord.followUpModal.serviceLoading")}
            disabled
            suffix={
              isLoadingService ? (
                <Spin size="small" />
              ) : serviceData?.data?.price ? (
                <span className="text-gray-500">{serviceData.data.price.toLocaleString()} VNĐ</span>
              ) : null
            }
          />
        </Form.Item>

        <Form.Item
          name="reason"
          label={t("medicalRecord.followUpModal.reason")}
          rules={[{ required: true, message: t("medicalRecord.followUpModal.reasonRequired") }]}
        >
          <Input.TextArea
            rows={3}
            placeholder={t("medicalRecord.followUpModal.reasonPlaceholder")}
          />
        </Form.Item>

        <Form.Item name="notes" label={t("medicalRecord.followUpModal.additionalNotes")}>
          <Input.TextArea
            rows={2}
            placeholder={t("medicalRecord.followUpModal.additionalNotesPlaceholder")}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FollowUpModal;
