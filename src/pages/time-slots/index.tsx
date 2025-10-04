import { Alert, Form, InputNumber, Modal, Spin, Select, DatePicker } from "antd";
import React, { useEffect, useState } from "react";
import CrudTable from "../../shares/components/CrudTable";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../shares/enums/queryKey";
import { useListTimeSlotsQuery } from "../../modules/time-slots/hooks/queries/use-get-time-slots.query";
import { TimeSlot } from "../../modules/time-slots/types/time-slot";
import { useCreateTimeSlotMutation } from "../../modules/time-slots/hooks/mutations/use-create-time-slot.mutation";
import { useUpdateTimeSlotMutation } from "../../modules/time-slots/hooks/mutations/use-update-time-slot.mutation";
import { useDeleteTimeSlotMutation } from "../../modules/time-slots/hooks/mutations/use-delete-time-slot.mutation";
import moment from "moment";
import { useListDoctorsQuery } from "../../modules/doctors/hooks/queries/use-get-doctors.query";
import { createTimeSlotSchema } from "../../modules/time-slots/schemas/createTimeSlot.schema";
import z from "zod";
import { useTranslation } from "react-i18next";

export default function TimeSlotsPage() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useListTimeSlotsQuery();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [editingTimeSlot, setEditingTimeSlot] = useState<TimeSlot | null>(null);

  const {
    data: doctorData,
    isLoading: isLoadingDoctors,
    isError: isErrorDoctors,
  } = useListDoctorsQuery();

  // ---- Mutations ----
  const createMutation = useCreateTimeSlotMutation({
    onSuccess: () => {
      toast.success(t("timeSlots.messages.create_success"));
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.TimeSlot] });
    },
    onError: (err: any) => toast.error(err.message || t("timeSlots.messages.create_error")),
  });

  const updateMutation = useUpdateTimeSlotMutation({
    onSuccess: () => {
      toast.success(t("timeSlots.messages.update_success"));
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.TimeSlot] });
    },
    onError: (err: any) => toast.error(err.message || t("timeSlots.messages.update_error")),
  });

  const deleteMutation = useDeleteTimeSlotMutation({
    onSuccess: () => {
      toast.success(t("timeSlots.messages.delete_success"));
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.TimeSlot] });
    },
    onError: (err: any) => toast.error(err.message || t("timeSlots.messages.delete_error")),
  });

  useEffect(() => {
    if (data?.data) setSlots(data.data);
  }, [data]);

  const handleAdd = () => {
    setEditingTimeSlot(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (timeSlot: TimeSlot) => {
    setEditingTimeSlot(timeSlot);
    form.setFieldsValue({
      doctor_id: timeSlot.doctor_id,
      start_time: moment(timeSlot.start_time),
      end_time: moment(timeSlot.end_time),
      capacity: timeSlot.capacity,
    });

    setIsModalOpen(true);
  };

  const handleDelete = (slot: TimeSlot) => {
    deleteMutation.mutate(slot.slot_id);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        doctor_id: values.doctor_id,
        start_time: values.start_time.toISOString(),
        end_time: values.end_time.toISOString(),
        capacity: values.capacity,
      };

      const parsed = createTimeSlotSchema.parse(payload);
      if (editingTimeSlot) {
        updateMutation.mutate({ time_slot_id: editingTimeSlot.slot_id, ...payload });
      } else {
        createMutation.mutate(parsed);
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (err) {
      if (err instanceof z.ZodError) {
        form.setFields(
          err.issues.map((e) => ({
            name: e.path.join("."),
            errors: [e.message],
          })),
        );
      }
    }
  };

  // ---- Table columns ----
  const columns = [
    {
      title: t("timeSlots.columns.index"),
      dataIndex: "index",
      key: "index",
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    { title: t("timeSlots.columns.doctor"), dataIndex: ["doctor", "full_name"], key: "doctor" },
    {
      title: t("timeSlots.columns.time"),
      key: "time",
      render: (record: TimeSlot) => (
        <span>
          {moment(record.start_time).format("HH:mm DD/MM/YYYY")} -{" "}
          {moment(record.end_time).format("HH:mm DD/MM/YYYY")}
        </span>
      ),
    },
    { title: t("timeSlots.columns.capacity"), dataIndex: "capacity", key: "capacity", width: 100 },
  ];

  return (
    <>
      {isError && (
        <Alert
          message={t("timeSlots.messages.load_error")}
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      <Spin spinning={isLoading}>
        <CrudTable
          title={t("timeSlots.title")}
          subtitle={t("timeSlots.subtitle")}
          rowKey="hospital_id"
          columns={columns}
          dataSource={slots}
          addButtonText={t("timeSlots.addButton")}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Spin>

      <Modal
        title={editingTimeSlot ? t("timeSlots.editModalTitle") : t("timeSlots.createModalTitle")}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        centered
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="doctor_id"
            label={t("timeSlots.form.doctor")}
            rules={[{ required: true, message: t("timeSlots.form.placeholder.doctor") }]}
          >
            <Select
              placeholder={t("timeSlots.form.placeholder.doctor")}
              loading={isLoadingDoctors}
              allowClear
            >
              {doctorData?.data?.map((doctor) => (
                <Select.Option key={doctor.doctor_id} value={doctor.doctor_id}>
                  {doctor.full_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={t("timeSlots.form.start_time")}
            name="start_time"
            rules={[{ required: true, message: t("timeSlots.form.start_time") }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label={t("timeSlots.form.end_time")}
            name="end_time"
            rules={[{ required: true, message: t("timeSlots.form.end_time") }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label={t("timeSlots.form.capacity")}
            name="capacity"
            rules={[{ required: true, message: t("timeSlots.form.capacity") }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
