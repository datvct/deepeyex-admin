import {
  Alert,
  Form,
  Input,
  Modal,
  Spin,
  Tag,
  Tooltip,
  Select,
  DatePicker,
  Button,
  Space,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import CrudTable from "../../shares/components/CrudTable";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../shares/enums/queryKey";
import { Appointment } from "../../modules/appointments/types/appointment";
import { useListAppointmentsQuery } from "../../modules/appointments/hooks/queries/use-get-appointments.query";
import { useListAppointmentByHospitalIdQuery } from "../../modules/appointments/hooks/queries/use-get-appointments-by-hospital-id.query";
import { useUpdateAppointmentStatusMutation } from "../../modules/appointments/hooks/mutations/use-update-appointment-status.mutation";
import { useUpdateAppointmentByReceptionistMutation } from "../../modules/appointments/hooks/mutations/use-update-appointment-by-receptionist.mutation";
import { useCreateBookingMutation } from "../../modules/appointments/hooks/mutations/use-create-booking.mutation";
import { AppointmentStatus } from "../../modules/appointments/enums/appointment-status";
import { PaymentStatus, PaymentStatusLabel } from "../../modules/appointments/enums/payment-status";
import { useListHospitalsQuery } from "../../modules/hospitals/hooks/queries/use-get-hospitals.query";
import { FilterField } from "../../shares/components/AdvancedFilter";
import { useListDoctorsQuery } from "../../modules/doctors/hooks/queries/use-get-doctors.query";
import { useGetDoctorsByHospitalIdQuery } from "../../modules/doctors/hooks/queries/use-get-doctor-by-hospital-id.query";
import { useGetTimeSlotsByDoctorIdQuery } from "../../modules/time-slots/hooks/queries/use-get-time-slots-by-doctor-id.query";
import { useListPatientsQuery } from "../../modules/patients/hooks/queries/use-get-patients.query";
import { useGetServicesByDoctorIdQuery } from "../../modules/services/hooks/queries/use-get-services-by-doctor-id.query";
import { useSelector } from "react-redux";
import { RootState } from "../../shares/stores";
import dayjs, { Dayjs } from "dayjs";

export default function AppointmentsPage() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [createDate, setCreateDate] = useState<Dayjs | null>(null);

  const { role, doctor, userId } = useSelector((state: RootState) => state.auth);
  const isReceptionist = role === "receptionist";
  // Xác định hospital_id: ưu tiên từ doctor.hospital_id, nếu không có thì dùng userId (nếu role là hospital/receptionist)
  const hospitalId =
    doctor?.hospital_id || (role === "hospital" || role === "receptionist" ? userId : null);

  // Chỉ query theo hospital_id nếu là hospital hoặc receptionist
  const shouldQueryByHospital = !!hospitalId && (role === "hospital" || role === "receptionist");
  const {
    data: hospitalAppointmentsData,
    isLoading: isLoadingHospitalAppointments,
    isError: isErrorHospitalAppointments,
  } = useListAppointmentByHospitalIdQuery({
    hospitalId: hospitalId || "",
    filters,
    options: {
      enabled: shouldQueryByHospital,
    },
  });

  // Query tất cả appointments nếu là admin
  const {
    data: allAppointmentsData,
    isLoading: isLoadingAllAppointments,
    isError: isErrorAllAppointments,
  } = useListAppointmentsQuery({
    filters,
    options: { enabled: role === "admin" },
  });

  // Lấy data từ query phù hợp
  const data = role === "admin" ? allAppointmentsData : hospitalAppointmentsData;
  const isLoading = role === "admin" ? isLoadingAllAppointments : isLoadingHospitalAppointments;
  const isError = role === "admin" ? isErrorAllAppointments : isErrorHospitalAppointments;

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const {
    data: hospitalData,
    isLoading: isLoadingHospitals,
    isError: isErrorHospitals,
  } = useListHospitalsQuery();

  // Lấy doctors theo role: admin lấy tất cả, hospital/receptionist lấy theo hospital_id
  const { data: allDoctorsData, isLoading: isLoadingAllDoctors } = useListDoctorsQuery({
    options: { enabled: role === "admin" },
  });

  const { data: hospitalDoctorsData, isLoading: isLoadingHospitalDoctors } =
    useGetDoctorsByHospitalIdQuery({
      hospitalId: hospitalId || "",
      enabled: !!hospitalId && (role === "hospital" || role === "receptionist"),
    });

  // Lấy data từ query phù hợp
  const doctorData = role === "admin" ? allDoctorsData : hospitalDoctorsData;

  const selectedDoctorId = Form.useWatch("doctor_id", form);
  const createDoctorId = Form.useWatch("doctor_id", createForm);
  const { data: timeSlotsData } = useGetTimeSlotsByDoctorIdQuery(
    selectedDoctorId || selectedAppointment?.doctor_id || "",
    { enabled: !!selectedDoctorId || !!selectedAppointment?.doctor_id },
  );

  // Queries cho create modal
  const { data: patientsData } = useListPatientsQuery({});
  const { data: doctorServicesData } = useGetServicesByDoctorIdQuery(createDoctorId || "", {
    enabled: !!createDoctorId,
  });
  const { data: createTimeSlotsData } = useGetTimeSlotsByDoctorIdQuery(createDoctorId || "", {
    enabled: !!createDoctorId,
  });

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
      setIsModalOpen(false);
      form.resetFields();
      setSelectedAppointment(null);
    },
    onError: (error) => {
      toast.error(error.message || t("appointment.messages.update_error"));
    },
  });

  // ---- Mutation: Update by Receptionist ----
  const updateByReceptionistMutation = useUpdateAppointmentByReceptionistMutation({
    onSuccess: (data) => {
      toast.success(data.message || "Cập nhật lịch hẹn thành công");
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Appointment] });
      setIsModalOpen(false);
      form.resetFields();
      setSelectedAppointment(null);
      setSelectedDate(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật lịch hẹn");
    },
  });

  // ---- Mutation: Create Booking ----
  const createBookingMutation = useCreateBookingMutation({
    onSuccess: (data) => {
      toast.success(data.message || "Tạo lịch hẹn thành công");
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Appointment] });
      setIsCreateModalOpen(false);
      createForm.resetFields();
      setCreateDate(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Có lỗi xảy ra khi tạo lịch hẹn");
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

    // Kiểm tra nếu appointment đã hoàn thành hoặc đã hủy
    if (isReceptionist) {
      const isCompleted =
        appointment.status === AppointmentStatus.COMPLETED ||
        appointment.status === AppointmentStatus.COMPLETED_ONLINE;
      const isCanceled = appointment.status === AppointmentStatus.CANCELED;

      if (isCompleted || isCanceled) {
        toast.warning(`Không thể cập nhật lịch hẹn đã ${isCompleted ? "hoàn thành" : "hủy"}`);
        return;
      }
    }

    if (isReceptionist) {
      // Lấy slot đầu tiên của appointment (nếu có)
      const currentSlot =
        appointment.time_slots && appointment.time_slots.length > 0
          ? appointment.time_slots[0]
          : null;
      const currentSlotId = currentSlot ? currentSlot.slot_id : "";
      // Lấy ngày hẹn từ slot đầu tiên
      const slotDate = currentSlot ? dayjs(currentSlot.start_time) : null;

      form.setFieldsValue({
        appointment_id: appointment.appointment_id,
        patient_full_name: appointment.patient.full_name,
        patient_phone: appointment.patient.phone || "",
        patient_email: appointment.patient.email || "",
        doctor_id: appointment.doctor_id,
        new_slot_id: currentSlotId,
        date: slotDate,
        status: appointment.status,
        notes: appointment.notes || "",
        internal_notes: "",
      });
      setSelectedDate(slotDate);
    } else {
      form.setFieldsValue({
        appointment_id: appointment.appointment_id,
        full_name: appointment.patient.full_name,
        status: appointment.status,
      });
    }
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

      if (isReceptionist) {
        // Lấy slot hiện tại của appointment (nếu có)
        const currentSlotId =
          selectedAppointment.time_slots && selectedAppointment.time_slots.length > 0
            ? selectedAppointment.time_slots[0].slot_id
            : "";
        const newSlotId = values.new_slot_id || "";
        const hasSlotChanged = currentSlotId !== newSlotId;

        const updateData: any = {
          appointment_id: selectedAppointment.appointment_id,
        };

        // Chỉ gửi các trường có giá trị
        if (values.patient_full_name) updateData.patient_full_name = values.patient_full_name;
        if (values.patient_phone) updateData.patient_phone = values.patient_phone;
        if (values.patient_email) updateData.patient_email = values.patient_email;
        if (values.notes !== undefined) updateData.notes = values.notes;
        if (values.internal_notes) updateData.internal_notes = values.internal_notes;
        // Chỉ gửi new_slot_id nếu có thay đổi và có giá trị
        if (hasSlotChanged && newSlotId) {
          updateData.new_slot_ids = [newSlotId]; // Backend vẫn expect array
        }
        if (values.status) updateData.status = values.status;

        updateByReceptionistMutation.mutate(updateData);
      } else {
        updateStatusMutation.mutate({
          appointment_id: selectedAppointment.appointment_id,
          status: values.status,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Lấy slot hiện tại của appointment (nếu có)
  const currentSlotId = useMemo(() => {
    if (!selectedAppointment?.time_slots || selectedAppointment.time_slots.length === 0) {
      return null;
    }
    return selectedAppointment.time_slots[0].slot_id;
  }, [selectedAppointment]);

  // Lọc time slots có sẵn (chưa được book hoặc cùng appointment)
  const availableTimeSlots = useMemo(() => {
    if (!timeSlotsData?.data) return [];

    const isChangingDoctor =
      selectedDoctorId && selectedAppointment?.doctor_id !== selectedDoctorId;

    // Lọc slots: chỉ hiển thị slot trống hoặc slot hiện tại của appointment này
    let slots = timeSlotsData.data.filter((slot) => {
      // Nếu đang thay đổi doctor, chỉ hiển thị slot trống
      if (isChangingDoctor) {
        return !slot.appointment_id; // Chỉ slot trống
      }
      // Slot trống luôn hiển thị
      if (!slot.appointment_id) return true;
      // Slot hiện tại của appointment này (để giữ lại khi không thay đổi)
      if (currentSlotId && slot.slot_id === currentSlotId) {
        return true;
      }
      return false;
    });

    // Lọc theo ngày đã chọn nếu có (không bắt buộc)
    if (selectedDate) {
      slots = slots.filter((slot) => {
        const slotDate = dayjs(slot.start_time);
        return slotDate.format("YYYY-MM-DD") === selectedDate.format("YYYY-MM-DD");
      });
    }

    // Sắp xếp theo thời gian
    return slots.sort((a, b) => {
      return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
    });
  }, [timeSlotsData?.data, selectedDate, selectedAppointment, selectedDoctorId, currentSlotId]);

  // Xử lý khi chọn doctor
  const handleDoctorChange = (doctorId: string) => {
    form.setFieldsValue({ new_slot_id: undefined, date: null });
    setSelectedDate(null);
  };

  // Xử lý khi chọn ngày
  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    form.setFieldsValue({ date: date });
    // Không reset new_slot_ids khi chọn/xóa ngày, chỉ filter available slots
  };

  // Xử lý khi mở modal tạo mới
  const handleAdd = () => {
    setIsCreateModalOpen(true);
    createForm.setFieldsValue({
      hospital_id: hospitalId || "",
      book_user_id: userId || "",
      payment_status: PaymentStatus.PENDING,
      order_items: [],
    });
  };

  // Xử lý khi chọn doctor trong create modal
  const handleCreateDoctorChange = (doctorId: string) => {
    createForm.setFieldsValue({
      slot_id: undefined,
      date: null,
      service_id: undefined,
      order_items: [],
    });
    setCreateDate(null);
  };

  // Xử lý khi chọn dịch vụ
  const handleServiceChange = (serviceId: string) => {
    if (!serviceId) {
      // Nếu clear service, xóa order_items
      createForm.setFieldsValue({ order_items: [] });
      return;
    }

    const selectedService = doctorServicesData?.data?.find((s) => s.service_id === serviceId);
    if (selectedService) {
      // Tự động tạo order_item với service_id và item_name
      const orderItem = {
        service_id: selectedService.service_id,
        item_name: selectedService.name,
        quantity: 1,
        price: selectedService.price || 0,
      };
      createForm.setFieldsValue({
        order_items: [orderItem],
        service_name: selectedService.name,
      });
    }
  };

  // Xử lý khi chọn ngày trong create modal
  const handleCreateDateChange = (date: Dayjs | null) => {
    setCreateDate(date);
    createForm.setFieldsValue({ date: date });
  };

  // Submit form tạo mới
  const handleCreateSubmit = async () => {
    try {
      const values = await createForm.validateFields();
      // Lấy tất cả giá trị từ form (bao gồm order_items)
      const allValues = createForm.getFieldsValue();
      const selectedDoctor = doctorData?.data?.find((d) => d.doctor_id === values.doctor_id);
      const selectedHospitalId = values.hospital_id || selectedDoctor?.hospital_id || hospitalId;

      const payload = {
        book_user_id: values.book_user_id || userId || "",
        doctor_id: values.doctor_id,
        hospital_id: selectedHospitalId || "",
        patient_id: values.patient_id,
        slot_ids: values.slot_id ? [values.slot_id] : [],
        service_name: values.service_name || allValues.service_name,
        notes: values.notes,
        payment_status: values.payment_status || PaymentStatus.PENDING,
        order_items: allValues.order_items || [],
      };

      createBookingMutation.mutate(payload);
    } catch (err) {
      console.error(err);
    }
  };

  // Lọc time slots cho create modal
  const availableCreateTimeSlots = useMemo(() => {
    if (!createTimeSlotsData?.data || !createDoctorId) return [];

    // Chỉ hiển thị slot trống
    let slots = createTimeSlotsData.data.filter((slot) => !slot.appointment_id);

    // Lọc theo ngày đã chọn nếu có
    if (createDate) {
      slots = slots.filter((slot) => {
        const slotDate = dayjs(slot.start_time);
        return slotDate.format("YYYY-MM-DD") === createDate.format("YYYY-MM-DD");
      });
    }

    // Sắp xếp theo thời gian
    return slots.sort((a, b) => {
      return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
    });
  }, [createTimeSlotsData?.data, createDate, createDoctorId]);

  const handleFilter = (filterValues: Record<string, any>) => {
    setFilters(filterValues);
  };

  const handleResetFilter = () => {
    setFilters({});
  };

  const statusColors: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]: "blue",
    [AppointmentStatus.CONFIRMED]: "green",
    [AppointmentStatus.CANCELED]: "red",
    [AppointmentStatus.COMPLETED]: "orange",
    [AppointmentStatus.PENDING_ONLINE]: "purple",
    [AppointmentStatus.CONFIRMED_ONLINE]: "cyan",
    [AppointmentStatus.COMPLETED_ONLINE]: "teal",
  };

  // Cấu hình filter fields
  const filterFields: FilterField[] = [
    {
      name: "patient_name",
      label: t("appointment.columns.patient"),
      type: "text",
      placeholder: "Nhập tên bệnh nhân",
      width: 200,
    },
    {
      name: "status",
      label: t("appointment.columns.status"),
      type: "select",
      placeholder: "Chọn trạng thái",
      options: Object.entries(AppointmentStatus).map(([key, value]) => ({
        label: t(`appointment.status.${key.toLowerCase()}`),
        value: key,
      })),
      width: 200,
    },
    {
      name: "doctor_id",
      label: t("appointment.doctor"),
      type: "select",
      placeholder: "Chọn bác sĩ",
      options:
        doctorData?.data?.map((doctor) => ({
          label: doctor.full_name,
          value: doctor.doctor_id,
        })) || [],
      width: 250,
    },
  ];

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
        const hospitalName = hospitalMap[record.hospital_id] || "-";
        return (
          <div>
            <p>
              <strong>{t("appointment.doctor")}:</strong> {record.doctor?.full_name || "-"}
            </p>
            <p>
              <strong>{t("appointment.hospital")}:</strong> {hospitalName ?? "-"}
            </p>
            <p>
              <strong>{t("appointment.time")}:</strong>{" "}
              {slot?.length > 0 ? (
                <span>
                  {new Date(slot[0].start_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(slot[0].end_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              ) : (
                "-"
              )}
            </p>
            <p>
              <strong>{t("appointment.quantity")}:</strong>
              {slot?.length > 0 ? slot[0].capacity : "-"}
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
          onAdd={isReceptionist ? handleAdd : undefined}
          addButtonText="Tạo lịch hẹn mới"
          onEdit={handleEditStatus}
          onDelete={handleDelete}
          useAdvancedFilter={true}
          filterFields={filterFields}
          onFilter={handleFilter}
          onResetFilter={handleResetFilter}
        />
      </Spin>

      <Modal
        title={isReceptionist ? "Cập nhật lịch hẹn" : t("appointment.modal.title")}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setSelectedAppointment(null);
          setSelectedDate(null);
        }}
        centered
        destroyOnClose
        width={isReceptionist ? 700 : 520}
        confirmLoading={updateStatusMutation.isPending || updateByReceptionistMutation.isPending}
      >
        <Form form={form} layout="vertical">
          <Form.Item label={t("appointment.form.appointment_id")} name="appointment_id">
            <Input disabled />
          </Form.Item>

          {isReceptionist ? (
            <>
              {/* Thông tin bệnh nhân */}
              <div>
                <h4 className="font-semibold mb-3">Thông tin bệnh nhân</h4>
                <Form.Item
                  label="Tên bệnh nhân"
                  name="patient_full_name"
                  rules={[{ required: true, message: "Vui lòng nhập tên bệnh nhân" }]}
                >
                  <Input placeholder="Nhập tên bệnh nhân" />
                </Form.Item>
                <Form.Item
                  label="Số điện thoại"
                  name="patient_phone"
                  rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="patient_email"
                  rules={[{ type: "email", message: "Email không hợp lệ" }, { required: false }]}
                >
                  <Input placeholder="Nhập email (tùy chọn)" />
                </Form.Item>
              </div>

              {/* Thời gian hẹn */}
              <div>
                <h4 className="font-semibold mb-3">Dời lịch hẹn</h4>
                <Form.Item
                  label="Bác sĩ"
                  name="doctor_id"
                  rules={[{ required: true, message: "Vui lòng chọn bác sĩ" }]}
                >
                  <Select
                    placeholder="Chọn bác sĩ"
                    onChange={handleDoctorChange}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                    }
                    options={doctorData?.data?.map((doctor) => ({
                      label: doctor.full_name,
                      value: doctor.doctor_id,
                    }))}
                  />
                </Form.Item>
                <Form.Item
                  label="Ngày hẹn"
                  name="date"
                  tooltip="Chọn ngày để lọc ca khám (tùy chọn, có thể để trống để xem tất cả)"
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    value={selectedDate}
                    onChange={handleDateChange}
                    placeholder="Chọn ngày để lọc (tùy chọn)"
                    allowClear
                    disabledDate={(current) => current && current < dayjs().startOf("day")}
                  />
                </Form.Item>
                <Form.Item
                  label="Ca khám"
                  name="new_slot_id"
                  rules={[{ required: true, message: "Vui lòng chọn ca khám" }]}
                  tooltip="Chọn ca khám mới để dời lịch hẹn"
                >
                  <Select
                    placeholder="Chọn ca khám"
                    disabled={!selectedDoctorId}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                      const label = String(option?.children || "");
                      return label.toLowerCase().includes(input.toLowerCase());
                    }}
                  >
                    {availableTimeSlots.map((slot) => {
                      const startTime = dayjs(slot.start_time).format("HH:mm");
                      const endTime = dayjs(slot.end_time).format("HH:mm");
                      const slotLabel = `${startTime} - ${endTime}`;
                      return (
                        <Select.Option key={slot.slot_id} value={slot.slot_id}>
                          {slotLabel}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </div>

              {/* Trạng thái và ghi chú */}
              <div>
                <h4 className="font-semibold mb-3">Trạng thái và ghi chú</h4>
                <Form.Item
                  label="Trạng thái lịch hẹn"
                  name="status"
                  rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                >
                  <Select placeholder="Chọn trạng thái">
                    {Object.entries(AppointmentStatus)
                      .filter(
                        ([key]) =>
                          key !== "COMPLETED" && key !== "COMPLETED_ONLINE" && key !== "CANCELED",
                      )
                      .map(([key, value]) => (
                        <Select.Option key={key} value={key}>
                          {t(`appointment.status.${key.toLowerCase()}`)}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Ghi chú chung"
                  name="notes"
                  tooltip="Ghi chú chung về lịch hẹn (bệnh nhân có thể thấy)"
                >
                  <Input.TextArea rows={2} placeholder="Ví dụ: Bệnh nhân muốn gặp bác sĩ X" />
                </Form.Item>
                {/* <Form.Item
                  label="Ghi chú nội bộ"
                  name="internal_notes"
                  tooltip="Ghi chú nội bộ chỉ dành cho nhân viên (sẽ tự động có prefix [LỄ TÂN])"
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="Ví dụ: Yêu cầu đặc biệt, nhắc nhở chuẩn bị hồ sơ..."
                  />
                </Form.Item> */}
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </Form>
      </Modal>

      {/* Modal tạo appointment mới */}
      <Modal
        title="Tạo lịch hẹn mới"
        open={isCreateModalOpen}
        onOk={handleCreateSubmit}
        onCancel={() => {
          setIsCreateModalOpen(false);
          createForm.resetFields();
          setCreateDate(null);
        }}
        centered
        destroyOnClose
        width={900}
        confirmLoading={createBookingMutation.isPending}
      >
        <Form form={createForm} layout="vertical">
          {/* Thông tin cơ bản */}
          <div>
            <h4 className="font-semibold mb-3">Thông tin cơ bản</h4>
            <Form.Item
              label="Bệnh nhân"
              name="patient_id"
              rules={[{ required: true, message: "Vui lòng chọn bệnh nhân" }]}
            >
              <Select
                placeholder="Chọn bệnh nhân"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={patientsData?.data?.map((patient) => ({
                  label: `${patient.full_name} - ${patient.phone || ""}`,
                  value: patient.patient_id,
                }))}
              />
            </Form.Item>
            <Form.Item
              label="Bác sĩ"
              name="doctor_id"
              rules={[{ required: true, message: "Vui lòng chọn bác sĩ" }]}
            >
              <Select
                placeholder="Chọn bác sĩ"
                onChange={handleCreateDoctorChange}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={doctorData?.data?.map((doctor) => ({
                  label: doctor.full_name,
                  value: doctor.doctor_id,
                }))}
              />
            </Form.Item>
            {role === "admin" && (
              <Form.Item
                label="Bệnh viện"
                name="hospital_id"
                rules={[{ required: true, message: "Vui lòng chọn bệnh viện" }]}
              >
                <Select
                  placeholder="Chọn bệnh viện"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                  }
                  options={hospitalData?.data?.map((hospital) => ({
                    label: hospital.name,
                    value: hospital.hospital_id,
                  }))}
                />
              </Form.Item>
            )}
            {role !== "admin" && (
              <Form.Item name="hospital_id" hidden>
                <Input />
              </Form.Item>
            )}
            <Form.Item name="book_user_id" hidden>
              <Input />
            </Form.Item>
          </div>

          {/* Thời gian hẹn */}
          <div className="mt-4">
            <h4 className="font-semibold mb-3">Thời gian hẹn</h4>
            <Form.Item label="Ngày hẹn" name="date">
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                value={createDate}
                onChange={handleCreateDateChange}
                placeholder="Chọn ngày"
                allowClear
                disabledDate={(current) => current && current < dayjs().startOf("day")}
              />
            </Form.Item>
            <Form.Item
              label="Ca khám"
              name="slot_id"
              rules={[{ required: true, message: "Vui lòng chọn ca khám" }]}
            >
              <Select
                placeholder="Chọn ca khám"
                disabled={!createDoctorId}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => {
                  const label = String(option?.children || "");
                  return label.toLowerCase().includes(input.toLowerCase());
                }}
              >
                {availableCreateTimeSlots.map((slot) => {
                  const startTime = dayjs(slot.start_time).format("HH:mm");
                  const endTime = dayjs(slot.end_time).format("HH:mm");
                  return (
                    <Select.Option key={slot.slot_id} value={slot.slot_id}>
                      {startTime} - {endTime}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </div>

          {/* Dịch vụ và thanh toán */}
          <div className="mt-4">
            <h4 className="font-semibold mb-3">Dịch vụ và thanh toán</h4>
            <Form.Item
              label="Dịch vụ"
              name="service_id"
              tooltip="Chọn dịch vụ của bác sĩ (hiển thị sau khi chọn bác sĩ)"
            >
              <Select
                placeholder="Chọn dịch vụ (tùy chọn)"
                disabled={!createDoctorId}
                allowClear
                onChange={handleServiceChange}
                showSearch
                optionFilterProp="children"
                options={doctorServicesData?.data?.map((service) => ({
                  label: `${service.name} - ${service.price?.toLocaleString("vi-VN") || 0} VNĐ`,
                  value: service.service_id,
                }))}
              />
            </Form.Item>
            <Form.Item name="service_name" hidden>
              <Input />
            </Form.Item>
            {/* Lưu order_items vào form values - không cần Input, chỉ cần Form.Item với name */}
            <Form.Item name="order_items" initialValue={[]} style={{ display: "none" }}>
              <div />
            </Form.Item>
            {/* Hiển thị order_items đã chọn */}
            <Form.Item
              label="Đơn hàng"
              shouldUpdate={(prevValues, curValues) =>
                prevValues.order_items !== curValues.order_items
              }
            >
              {() => {
                const orderItems = createForm.getFieldValue("order_items") || [];
                if (orderItems.length === 0) {
                  return <div className="text-gray-400 text-sm">Chưa có đơn hàng nào</div>;
                }
                return (
                  <div className="space-y-2">
                    {orderItems.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{item.item_name}</p>
                          <p className="text-sm text-gray-500">
                            Số lượng: {item.quantity} x {item.price?.toLocaleString("vi-VN") || 0}{" "}
                            VNĐ = {(item.quantity * item.price)?.toLocaleString("vi-VN") || 0} VNĐ
                          </p>
                        </div>
                        <Button
                          type="text"
                          danger
                          icon={<CloseOutlined />}
                          size="small"
                          onClick={() => {
                            createForm.setFieldsValue({
                              order_items: [],
                              service_id: undefined,
                              service_name: undefined,
                            });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                );
              }}
            </Form.Item>
            <Form.Item
              label="Trạng thái thanh toán"
              name="payment_status"
              initialValue={PaymentStatus.PENDING}
            >
              <Select placeholder="Chọn trạng thái thanh toán">
                {Object.entries(PaymentStatus).map(([key, value]) => (
                  <Select.Option key={key} value={value}>
                    {PaymentStatusLabel[value]}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Ghi chú" name="notes">
              <Input.TextArea rows={2} placeholder="Ghi chú về lịch hẹn (tùy chọn)" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
}
