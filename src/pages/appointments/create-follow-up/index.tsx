import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  message,
  Steps,
  Space,
  Descriptions,
  Avatar,
  Spin,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "../../../shares/stores";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../shares/enums/queryKey";
import { useNavigate } from "react-router-dom";
import { useListDoctorsQuery } from "../../../modules/doctors/hooks/queries/use-get-doctors.query";
import { useCreatePendingFollowUpMutation } from "../../../modules/appointments/hooks/mutations/use-create-pending-follow-up.mutation";
import { useListPatientsQuery } from "../../../modules/patients/hooks/queries/use-get-patients.query";
import { useGetServiceByIdQuery } from "../../../modules/services/hooks/queries/use-get-service-by-id.query";
import { useGetAvailableSlotsByDateQuery } from "../../../modules/time-slots/hooks/queries/use-get-available-slots-by-date.query";

const { Option } = Select;
const { TextArea } = Input;

const CreateFollowUpPage: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { doctor, userId } = useSelector((state: RootState) => state.auth);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctor?.doctor_id || "");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [appointmentData, setAppointmentData] = useState<any>(null);

  // Fetch doctors
  const { data: doctorsData, isLoading: loadingDoctors } = useListDoctorsQuery({
    filters: { specialty: "ophthalmology" },
  });

  // Fetch patients
  const { data: patientsData, isLoading: loadingPatients } = useListPatientsQuery();

  // Fetch services by doctor_id
  const DEFAULT_SERVICE_ID = "23026186-21ff-4d1d-91af-0bb7cad6a691";
  const { data: serviceData, isLoading: loadingServices } =
    useGetServiceByIdQuery(DEFAULT_SERVICE_ID);

  // Set default service name when modal opens and service data is loaded
  React.useEffect(() => {
    if (serviceData?.data) {
      form.setFieldsValue({
        service_name: serviceData.data.name,
      });
    }
  }, [serviceData, form]);

  // Fetch available time slots by date range (use same date for start and end to filter by single date)
  const { data: timeSlotsData, isLoading: isLoadingSlots } = useGetAvailableSlotsByDateQuery({
    doctorId: selectedDoctorId,
    date: selectedDate,
    options: {
      enabled: !!selectedDate && !!selectedDoctorId,
    },
  });

  const createPendingFollowUpMutation = useCreatePendingFollowUpMutation({
    onSuccess: (data) => {
      message.success(t("createFollowUp.messages.success"));
      setAppointmentData(data.data);
      setCurrentStep(2);
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.Appointment],
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || error?.message || t("createFollowUp.messages.error");
      message.error(errorMessage);
    },
  });

  const steps = [
    {
      title: t("createFollowUp.steps.selectInfo"),
      icon: <UserOutlined />,
    },
    {
      title: t("createFollowUp.steps.confirm"),
      icon: <CalendarOutlined />,
    },
    {
      title: t("createFollowUp.steps.complete"),
      icon: <CheckCircleOutlined />,
    },
  ];

  const onFinishStep1 = async (values: any) => {
    setSelectedDoctorId(values.doctor_id);
    setCurrentStep(1);
  };

  // Filter available slots
  const availableSlots =
    timeSlotsData?.data?.filter((slot) => {
      const slotDate = new Date(slot.start_time).toISOString().split("T")[0];
      const isCorrectDate = slotDate === selectedDate;
      const isAvailable = !slot.appointment_id;
      return isCorrectDate && isAvailable;
    }) || [];

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setSelectedDate(date.format("YYYY-MM-DD"));
      form.setFieldsValue({ slot_ids: undefined });
    } else {
      setSelectedDate("");
    }
  };

  const handleConfirm = async () => {
    // Validate form trước
    try {
      const values = await form.validateFields([
        "patient_id",
        "doctor_id",
        "service_name",
        "slot_ids",
        "reason",
      ]);

      // Lọc slot_ids để loại bỏ null
      const slotIds = Array.isArray(values.slot_ids)
        ? values.slot_ids.filter((id) => id != null)
        : values.slot_ids
        ? [values.slot_ids].filter((id) => id != null)
        : [];

      // Lấy hospital_id từ doctor
      const selectedDoctor = doctorsData?.data?.find((d) => d.doctor_id === selectedDoctorId);

      const payload: any = {
        patient_id: values.patient_id,
        doctor_id: selectedDoctorId,
        hospital_id: selectedDoctor?.hospital_id || "",
        notes: values.reason
          ? values.notes
            ? `${values.reason}\n\n${t("createFollowUp.defaultValues.notesLabel")} ${values.notes}`
            : values.reason
          : values.notes || "",
        service_name: values.service_name || t("createFollowUp.defaultValues.serviceName"),
        slot_ids: slotIds,
      };

      // Thêm related_record_id nếu có
      if (values.related_record_id) {
        payload.related_record_id = values.related_record_id;
      }

      createPendingFollowUpMutation.mutate(payload);
    } catch (error) {
      console.error("Validation error:", error);
      message.error(t("createFollowUp.messages.validationError"));
    }
  };

  return (
    <div>
      <Card className="shadow-md">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t("createFollowUp.title")}</h1>
          <p className="text-gray-600 text-lg">{t("createFollowUp.subtitle")}</p>
        </div>

        <Steps current={currentStep} items={steps} className="mb-10" />

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinishStep1}
          initialValues={{
            doctor_id: doctor?.doctor_id,
          }}
        >
          {/* Step 1: Chọn thông tin */}
          {currentStep === 0 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <Form.Item
                name="patient_id"
                label={t("createFollowUp.form.patient")}
                rules={[{ required: true, message: t("createFollowUp.form.patientRequired") }]}
              >
                <Select
                  placeholder={t("createFollowUp.form.patientPlaceholder")}
                  size="large"
                  loading={loadingPatients}
                  showSearch
                  filterOption={(input, option) =>
                    String(option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {patientsData?.data?.map((patient) => (
                    <Option key={patient.patient_id} value={patient.patient_id}>
                      <div className="flex items-center gap-2">
                        <span>{patient.full_name}</span>
                        <span className="text-gray-500 text-xs">({patient.phone})</span>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="doctor_id"
                label={t("createFollowUp.form.doctor")}
                rules={[{ required: true, message: t("createFollowUp.form.doctorRequired") }]}
              >
                <Select
                  placeholder={t("createFollowUp.form.doctorPlaceholder")}
                  size="large"
                  loading={loadingDoctors}
                  onChange={setSelectedDoctorId}
                >
                  {doctorsData?.data?.map((doctor) => (
                    <Option key={doctor.doctor_id} value={doctor.doctor_id}>
                      <div className="flex items-center gap-2">
                        {doctor.image ? (
                          <img
                            src={doctor.image}
                            alt={doctor.full_name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <UserOutlined className="text-gray-400" />
                        )}
                        <span>{doctor.full_name}</span>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="service_name"
                label={t("createFollowUp.form.service")}
                rules={[{ required: true, message: t("createFollowUp.form.serviceRequired") }]}
              >
                <Select
                  placeholder={t("createFollowUp.form.servicePlaceholder")}
                  size="large"
                  loading={loadingServices}
                  disabled={!selectedDoctorId}
                >
                  <Option key={serviceData?.data?.service_id} value={serviceData?.data?.name}>
                    {serviceData?.data?.name} - {serviceData?.data?.price?.toLocaleString("vi-VN")}{" "}
                    VNĐ
                  </Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="follow_up_date"
                label={t("createFollowUp.form.followUpDate")}
                rules={[{ required: true, message: t("createFollowUp.form.followUpDateRequired") }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  placeholder={t("createFollowUp.form.followUpDatePlaceholder")}
                  disabledDate={(current) => current && current < dayjs().startOf("day")}
                  onChange={handleDateChange}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="slot_ids"
                label={t("createFollowUp.form.timeSlot")}
                rules={[
                  { required: true, message: t("createFollowUp.form.timeSlotRequired") },
                  {
                    validator: (_, value) => {
                      if (!value || (Array.isArray(value) && value.length === 0)) {
                        return Promise.reject(
                          new Error(t("createFollowUp.form.timeSlotAtLeastOne")),
                        );
                      }
                      if (Array.isArray(value) && value.includes(null)) {
                        return Promise.reject(new Error(t("createFollowUp.form.timeSlotValid")));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder={t("createFollowUp.form.timeSlotPlaceholder")}
                  loading={isLoadingSlots}
                  disabled={!selectedDate || !selectedDoctorId}
                  size="large"
                >
                  {isLoadingSlots ? (
                    <Option value="loading" disabled>
                      <Spin size="small" /> {t("createFollowUp.messages.loading")}
                    </Option>
                  ) : availableSlots.length === 0 ? (
                    <Option value="empty" disabled>
                      {t("createFollowUp.messages.noSlotsAvailable")}
                    </Option>
                  ) : (
                    availableSlots.map((slot) => (
                      <Option key={slot.slot_id} value={slot.slot_id}>
                        {new Date(slot.start_time).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {new Date(slot.end_time).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Option>
                    ))
                  )}
                </Select>
              </Form.Item>

              <Form.Item
                name="reason"
                label={t("createFollowUp.form.reason")}
                rules={[{ required: true, message: t("createFollowUp.form.reasonRequired") }]}
              >
                <TextArea rows={3} placeholder={t("createFollowUp.form.reasonPlaceholder")} />
              </Form.Item>

              <Form.Item name="notes" label={t("createFollowUp.form.notes")}>
                <TextArea rows={2} placeholder={t("createFollowUp.form.notesPlaceholder")} />
              </Form.Item>

              <Form.Item name="related_record_id" label={t("createFollowUp.form.relatedRecordId")}>
                <Input
                  placeholder={t("createFollowUp.form.relatedRecordIdPlaceholder")}
                  size="large"
                />
              </Form.Item>

              <div className="flex justify-end pt-4">
                <Button type="primary" htmlType="submit" size="large" className="px-8">
                  {t("createFollowUp.buttons.next")}
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Xác nhận */}
          {currentStep === 1 && (
            <div className="space-y-6 max-w-3xl mx-auto mt-3">
              <Descriptions bordered column={1}>
                <Descriptions.Item label={t("createFollowUp.confirm.patient")}>
                  {patientsData?.data?.find(
                    (p) => p.patient_id === form.getFieldValue("patient_id"),
                  )?.full_name || form.getFieldValue("patient_id")}
                </Descriptions.Item>
                <Descriptions.Item label={t("createFollowUp.confirm.doctor")}>
                  {doctorsData?.data?.find((d) => d.doctor_id === selectedDoctorId)?.full_name}
                </Descriptions.Item>
                <Descriptions.Item label={t("createFollowUp.confirm.service")}>
                  {form.getFieldValue("service_name") ||
                    t("createFollowUp.defaultValues.serviceName")}
                </Descriptions.Item>
                <Descriptions.Item label={t("createFollowUp.confirm.date")}>
                  {form.getFieldValue("follow_up_date")?.format("DD/MM/YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label={t("createFollowUp.confirm.timeSlot")}>
                  {(() => {
                    const slotIds = form.getFieldValue("slot_ids");
                    if (!slotIds || (Array.isArray(slotIds) && slotIds.length === 0)) {
                      return t("createFollowUp.confirm.notSelected");
                    }
                    const selectedSlots = Array.isArray(slotIds)
                      ? slotIds
                          .map((id) => availableSlots.find((s) => s.slot_id === id))
                          .filter((slot) => slot != null)
                      : [availableSlots.find((s) => s.slot_id === slotIds)].filter(
                          (slot) => slot != null,
                        );

                    if (selectedSlots.length === 0) return t("createFollowUp.confirm.notSelected");

                    return selectedSlots
                      .map(
                        (slot: any) =>
                          `${new Date(slot.start_time).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })} - ${new Date(slot.end_time).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`,
                      )
                      .join(", ");
                  })()}
                </Descriptions.Item>
                <Descriptions.Item label={t("createFollowUp.confirm.reason")}>
                  {form.getFieldValue("reason") || t("createFollowUp.confirm.none")}
                </Descriptions.Item>
                <Descriptions.Item label={t("createFollowUp.confirm.notes")}>
                  {form.getFieldValue("notes") || t("createFollowUp.confirm.none")}
                </Descriptions.Item>
              </Descriptions>

              <div className="flex justify-between pt-6">
                <Button onClick={() => setCurrentStep(0)} size="large" className="px-8">
                  {t("createFollowUp.buttons.back")}
                </Button>
                <Button
                  type="primary"
                  onClick={handleConfirm}
                  loading={createPendingFollowUpMutation.isPending}
                  size="large"
                  className="px-8"
                >
                  {t("createFollowUp.buttons.confirm")}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Hoàn thành */}
          {currentStep === 2 && appointmentData && (
            <div className="text-center space-y-8 py-8">
              <CheckCircleOutlined className="!text-green-600 text-6xl" />
              <h2 className="text-2xl font-bold !text-green-600">
                {t("createFollowUp.complete.title")}
              </h2>

              <div className="flex justify-center gap-6 pt-4">
                <Button size="large" onClick={() => window.location.reload()} className="px-8">
                  {t("createFollowUp.buttons.createNew")}
                </Button>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => navigate("/doctor-consultation")}
                  className="px-8"
                >
                  {t("createFollowUp.buttons.backToConsultation")}
                </Button>
              </div>
            </div>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default CreateFollowUpPage;
