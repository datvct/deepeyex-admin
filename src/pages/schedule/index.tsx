import React, { useState, useMemo } from "react";
import {
  Table,
  DatePicker,
  Typography,
  Button,
  Space,
  Modal,
  Descriptions,
  Avatar,
  Spin,
  notification,
} from "antd";
import {
  LeftOutlined,
  RightOutlined,
  CalendarOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import dayjs, { Dayjs } from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/vi";
import { capitalize, getGenderLabel } from "../../shares/utils/helper";
import {
  AppointmentStatusLabel,
  AppointmentStatus,
} from "../../modules/appointments/enums/appointment-status";
import { AlarmClock, Printer } from "lucide-react";
import { RootState } from "../../shares/stores";
import { useSelector } from "react-redux";
import { useGetTimeSlotsByDoctorIdAndDateRangeQuery } from "../../modules/time-slots/hooks/queries/use-get-time-slots-by-doctor-id-and-date-range.query";
import { TimeSlot } from "../../modules/time-slots/types/time-slot";
import { useGetAppointmentsByDoctorIdQuery } from "../../modules/appointments/hooks/queries/use-get-appointments-by-doctor-id.query";
import { Appointment } from "../../modules/appointments/types/appointment";
import { useCancelAppointmentMutation } from "../../modules/appointments/hooks/mutations/use-cancel-appointment.mutation";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../shares/enums/queryKey";

dayjs.extend(isoWeek);
dayjs.extend(isBetween);
dayjs.locale("vi");

const { Title } = Typography;

interface TableColumn {
  title: React.ReactNode;
  dataIndex: string;
  key: string;
  width: string;
  render: (slots: TimeSlot[]) => React.ReactNode;
}

const WeeklyScheduleWithModal: React.FC = () => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const { doctor } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();

  // ---- Các ca khám ----
  const caKham = [
    { key: "morning", label: t("schedule.shifts.morning"), start: "06:00", end: "12:00" },
    { key: "afternoon", label: t("schedule.shifts.afternoon"), start: "13:00", end: "17:30" },
    { key: "evening", label: t("schedule.shifts.evening"), start: "18:00", end: "22:00" },
  ];

  const startOfWeek = useMemo(() => selectedDate.isoWeekday(1), [selectedDate]);
  const endOfWeek = useMemo(() => startOfWeek.add(6, "day"), [startOfWeek]);

  const { data, isFetching } = useGetTimeSlotsByDoctorIdAndDateRangeQuery(
    doctor?.doctor_id || "",
    startOfWeek.format("YYYY-MM-DD"),
    endOfWeek.format("YYYY-MM-DD"),
  );

  const { data: appointmentData } = useGetAppointmentsByDoctorIdQuery(doctor?.doctor_id || "");

  const cancelAppointmentMutation = useCancelAppointmentMutation({
    onSuccess: () => {
      notification.success({
        message: t("schedule.cancelSuccess"),
        description: t("schedule.cancelSuccessDescription"),
      });
      setCancelModalVisible(false);
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.TimeSlot, "doctor", doctor?.doctor_id],
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || error?.message || t("schedule.cancelErrorMessage");

      notification.error({
        message: t("schedule.cancelError"),
        description: errorMessage,
      });
    },
  });

  const handleCancelAppointment = () => {
    if (!selectedAppointment) return;
    cancelAppointmentMutation.mutate(selectedAppointment.appointment_id);
  };

  // Tạo map slotId -> appointment
  const appointmentMap = useMemo(() => {
    if (!appointmentData?.data) return {};
    const map: Record<string, any> = {};
    appointmentData.data.forEach((appt) => {
      if (Array.isArray(appt.time_slots)) {
        appt.time_slots.forEach((slot: TimeSlot) => {
          map[slot.slot_id] = {
            ...appt,
            slotInfo: slot,
          };
        });
      }
    });
    return map;
  }, [appointmentData]);

  // Merge appointment vào slot
  const weeklySlots: TimeSlot[] = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((slot) => {
      const appointment = appointmentMap[slot.slot_id];
      return {
        ...slot,
        appointment: appointment || null, // thêm field appointment
      };
    });
  }, [data, appointmentMap]);

  // Nhóm slot theo ca khám + ngày
  const dataSource = useMemo(() => {
    return caKham.map((ca) => {
      const row: Record<string, TimeSlot[] | string> = { ca: ca.label };
      for (let i = 0; i < 7; i++) {
        const currentDay = startOfWeek.add(i, "day");
        const dayKey = currentDay.format("YYYY-MM-DD");
        row[dayKey] = weeklySlots.filter((slot) => {
          const time = dayjs(slot.start_time).format("HH:mm");
          return slot.start_time.startsWith(dayKey) && time >= ca.start && time <= ca.end;
        });
      }
      return row;
    });
  }, [weeklySlots, selectedDate]);

  // Tạo cột cho từng ngày
  const dayColumns: TableColumn[] = [];
  for (let i = 0; i < 7; i++) {
    const currentDay = startOfWeek.add(i, "day");
    const dayKey = currentDay.format("YYYY-MM-DD");

    dayColumns.push({
      title: (
        <div className="text-center">
          <div className="font-bold">{capitalize(currentDay.format("dddd"))}</div>
          <div>{currentDay.format("DD/MM/YYYY")}</div>
        </div>
      ),
      dataIndex: dayKey,
      key: dayKey,
      width: "12%",
      render: (slots: TimeSlot[]) => {
        const now = dayjs();
        if (!slots || slots.length === 0) {
          return <div className="text-gray-400 text-xs">{t("schedule.noSchedule")}</div>;
        }

        const bookedSlots = slots.filter((s) => s.appointment_id);
        const freeSlots = slots.filter((s) => !s.appointment_id);

        // Gom slot trống liên tiếp thành block
        const freeBlocks: { slots: TimeSlot[] }[] = [];
        let tempBlock: { slots: TimeSlot[] } | null = null;

        freeSlots.forEach((slot) => {
          if (!tempBlock) {
            tempBlock = { slots: [slot] };
            freeBlocks.push(tempBlock);
          } else {
            const lastSlot = tempBlock.slots[tempBlock.slots.length - 1];
            if (dayjs(slot.start_time).isSame(dayjs(lastSlot.end_time))) {
              tempBlock.slots.push(slot);
            } else {
              tempBlock = { slots: [slot] };
              freeBlocks.push(tempBlock);
            }
          }
        });

        return (
          <div className="flex flex-col gap-2 justify-center items-center">
            {bookedSlots.map((slot) => {
              const slotEnd = dayjs(slot.end_time);
              const isPast = slotEnd.isBefore(now);
              return (
                <div
                  key={slot.slot_id}
                  className="rounded-lg w-full py-3"
                  style={{
                    backgroundColor: "#ffedef",
                    color: isPast ? "#003763" : "#003763",
                  }}
                >
                  <div className="flex flex-col items-start gap-1 text-center w-full border-l-2 border-[#e35750]">
                    <div className="text-xs font-bold pl-2">
                      {slot.appointment?.patient.full_name || t("schedule.unknown")}
                    </div>
                    <div className="text-xs text-left font-bold pl-2">
                      {t("schedule.service")}{" "}
                      {slot.appointment?.service_name || t("schedule.generalCheckup")}{" "}
                    </div>

                    <div className="font-semibold text-xs flex flex-row gap-1 items-center pl-2">
                      <AlarmClock size={12} />
                      <span>
                        {dayjs(slot.start_time).format("HH:mm")} -{" "}
                        {dayjs(slot.end_time).format("HH:mm")}
                      </span>
                    </div>
                    <div className="w-full flex justify-start pl-2 items-center mt-1">
                      <Button
                        size="small"
                        type="primary"
                        style={{
                          backgroundColor: "#53748f",
                          borderColor: "#53748f",
                          color: "#fff",
                          padding: "2px 8px",
                          fontSize: "10px",
                        }}
                        onClick={() => {
                          if (slot.appointment_id) {
                            setSelectedAppointment(slot.appointment || null);
                            setModalVisible(true);
                          }
                        }}
                      >
                        {t("schedule.viewDetails")}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            {freeBlocks.map((block, idx) => {
              const firstSlot = block.slots[0];
              const lastSlot = block.slots[block.slots.length - 1];
              return (
                <div
                  key={`free-${idx}`}
                  className="rounded-lg w-full py-4 text-center"
                  style={{
                    backgroundColor: "#d4ffe4",
                    color: "#003763",
                    fontSize: "10px",
                  }}
                >
                  <div className="flex flex-col items-start pl-2 justify-start gap-1 h-10 text-center w-full border-l-2 border-[#10c66c]">
                    <div className="font-semibold text-xs flex flex-row gap-1 items-center justify-start">
                      <AlarmClock size={12} />
                      {dayjs(firstSlot.start_time).format("HH:mm")} -{" "}
                      {dayjs(lastSlot.end_time).format("HH:mm")}
                    </div>
                    <div className="text-xs font-bold">{t("schedule.empty")}</div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      },
    });
  }

  const columns = [
    {
      title: t("schedule.shift"),
      dataIndex: "ca",
      key: "ca",
      width: "8%",
      render: (text: string) => <b className="text-[#1da1f2]">{text}</b>,
    },
    ...dayColumns,
  ];

  return (
    <div className="p-4 flex flex-col gap-3">
      <Title level={3}>{t("schedule.title")}</Title>
      <div className="flex justify-between items-center mb-2">
        <div className="text-gray-600">
          {t("schedule.weekRange")} <b>{startOfWeek.format("DD/MM/YYYY")}</b>{" "}
          {t("schedule.weekRangeTo")} <b>{endOfWeek.format("DD/MM/YYYY")}</b>
        </div>
        <Space>
          <Button
            icon={<LeftOutlined />}
            onClick={() => setSelectedDate(selectedDate.subtract(1, "week"))}
          />
          <DatePicker
            value={selectedDate}
            onChange={(v) => setSelectedDate(v || dayjs())}
            picker="date"
            suffixIcon={<CalendarOutlined />}
          />
          <Button
            icon={<RightOutlined />}
            onClick={() => setSelectedDate(selectedDate.add(1, "week"))}
          />
          <div>
            <Button
              onClick={() => setSelectedDate(dayjs())}
              type="default"
              style={{ marginRight: 8 }}
            >
              <CalendarOutlined />
              {t("schedule.current")}
            </Button>
            <Button type="primary" onClick={() => window.print()}>
              <Printer size={14} />
              {t("schedule.print")}
            </Button>
          </div>
        </Space>
      </div>

      {isFetching ? (
        <Spin tip={t("schedule.loading")} />
      ) : (
        <Table
          bordered
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          className="schedule-table"
          scroll={{ x: "max-content" }}
          rowKey="ca"
          rowClassName={(record) => {
            if (record.ca === t("schedule.shifts.morning")) return "row-morning";
            if (record.ca === t("schedule.shifts.afternoon")) return "row-afternoon";
            if (record.ca === t("schedule.shifts.evening")) return "row-evening";
            return "";
          }}
          footer={() => (
            <div className="text-sm text-gray-600 flex flex-row gap-3 items-center">
              <b>{t("schedule.note")}</b>
              <div>
                <span className="inline-block w-3 h-3 bg-[#f14f3f] border mx-1"></span>
                {t("schedule.booked")}
              </div>
              <div>
                <span className="inline-block w-3 h-3 bg-[#d4ffe4] border mx-1"></span>
                {t("schedule.empty")}
              </div>
            </div>
          )}
        />
      )}

      {/* Modal hiển thị chi tiết appointment */}
      <Modal
        title={t("schedule.appointmentDetails")}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedAppointment(null);
        }}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            {t("schedule.close")}
          </Button>,
          selectedAppointment &&
            (selectedAppointment.status === AppointmentStatus.PENDING ||
              selectedAppointment.status === AppointmentStatus.CONFIRMED) && (
              <Button
                key="cancel"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => setCancelModalVisible(true)}
              >
                {t("schedule.cancelAppointment")}
              </Button>
            ),
        ]}
      >
        {selectedAppointment && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label={t("schedule.appointmentCode")}>
              {selectedAppointment.appointment_code}
            </Descriptions.Item>
            <Descriptions.Item label={t("schedule.status")}>
              {
                AppointmentStatusLabel[
                  selectedAppointment.status as keyof typeof AppointmentStatusLabel
                ]
              }
            </Descriptions.Item>
            <Descriptions.Item label={t("schedule.notes")}>
              {selectedAppointment.notes || t("schedule.none")}
            </Descriptions.Item>
            <Descriptions.Item label={t("schedule.slotTime")}>
              {dayjs(selectedAppointment.time_slots[0].start_time).format("HH:mm")} -{" "}
              {dayjs(selectedAppointment.time_slots[0].end_time).format("HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label={t("schedule.patient")}>
              <div className="flex items-center gap-2">
                <Avatar src={selectedAppointment.patient.image} />
                <div>
                  <div>{selectedAppointment.patient.full_name}</div>
                  <div>
                    {t("schedule.dob")}{" "}
                    {dayjs(selectedAppointment.patient.dob).format("DD/MM/YYYY")}
                  </div>
                  <div>
                    {t("schedule.gender")} {getGenderLabel(selectedAppointment.patient.gender)}
                  </div>
                  <div>
                    {t("schedule.address")} {selectedAppointment.patient.address}
                  </div>
                  <div>
                    {t("schedule.phone")} {selectedAppointment.patient.phone}
                  </div>
                  <div>
                    {t("schedule.email")} {selectedAppointment.patient.email}
                  </div>
                </div>
              </div>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Modal xác nhận hủy lịch */}
      <Modal
        title={t("schedule.confirmCancel")}
        open={cancelModalVisible}
        onOk={handleCancelAppointment}
        onCancel={() => setCancelModalVisible(false)}
        okText={t("schedule.confirmCancelButton")}
        cancelText={t("schedule.cancel")}
        okButtonProps={{ danger: true, loading: cancelAppointmentMutation.isPending }}
        centered
      >
        <p>
          {t("schedule.confirmCancelMessage")}{" "}
          <strong>{selectedAppointment?.patient?.full_name}</strong>?
        </p>
      </Modal>
    </div>
  );
};

export default WeeklyScheduleWithModal;
