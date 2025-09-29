import React, { useState, useMemo } from "react";
import { Table, DatePicker, Typography, Button, Space, Modal, Descriptions, Avatar } from "antd";
import { LeftOutlined, RightOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/vi";
import { capitalize, getGenderLabel } from "../../shares/utils/helper";
import { AppointmentStatusLabel } from "../../modules/appointments/enums/appointment-status";
import { AlarmClock, Printer } from "lucide-react";

dayjs.extend(isoWeek);
dayjs.extend(isBetween);
dayjs.locale("vi");

const { Title } = Typography;

interface Doctor {
  doctor_id: string;
  full_name: string;
  phone: string;
  email: string;
  image: string;
  specialty: string;
}

interface Patient {
  full_name: string;
  dob: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  image: string;
}

interface Appointment {
  appointment_id: string;
  appointment_code: string;
  status: string;
  notes: string;
  patient: Patient;
  timeSlot: {
    start_time: string;
    end_time: string;
    capacity: number;
  };
}

interface Slot {
  slot_id: string;
  doctor_id: string;
  start_time: string;
  end_time: string;
  capacity: number; // 0 = booked, 1 = free
  doctor: Doctor;
  appointment?: Appointment;
}

// ---- Mock doctor ----
const doctorSample: Doctor = {
  doctor_id: "doc-001",
  full_name: "Nguyễn Quang Vinh",
  phone: "0908899001",
  email: "vinh.nguyen@europeaneyecenter.com",
  image:
    "https://deepeyex-admin.s3.ap-southeast-1.amazonaws.com/doctors/fbbe4d8e-b086-41c5-ae9c-05af9841c0e8.jpg",
  specialty: "Nhãn khoa",
};

// ---- Mock appointment ----
const appointmentSample: Appointment = {
  appointment_id: "appt-001",
  appointment_code: "APPT-1759077480769614000-7897",
  status: "PENDING",
  notes: "Ghi chú khám thử",
  patient: {
    full_name: "Văn Công Thành Đạt",
    dob: "2003-09-21T07:00:00+07:00",
    gender: "male",
    address: "Bình Dương",
    phone: "0367306158",
    email: "tiktok.2192003@gmail.com",
    image:
      "https://deepeyex-admin.s3.ap-southeast-1.amazonaws.com/avatars/da152b70-d6c3-4add-a8c3-16d4724b4598.jpg",
  },
  timeSlot: {
    start_time: "2025-09-29T08:00:00+07:00",
    end_time: "2025-09-29T08:15:00+07:00",
    capacity: 0,
  },
};

// ---- Tạo 30 slot 15 phút trong 1 ngày, xen kẽ booked/free ----
const generateSlots = (date: string) => {
  const slots: Slot[] = [];
  let hour = 8;
  let minute = 0;
  for (let i = 0; i < 30; i++) {
    const startTime = dayjs(
      `${date}T${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00`,
    );
    const endTime = startTime.add(15, "minute");

    // mock: đặt slot 0, trống 1-2 slot sau đó lặp lại
    const capacity = i % 5 === 3 || i % 5 === 4 ? 1 : 0;

    slots.push({
      slot_id: `slot-${i}`,
      doctor_id: doctorSample.doctor_id,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      capacity,
      doctor: doctorSample,
      appointment: capacity === 0 ? appointmentSample : undefined,
    });

    minute += 15;
    if (minute >= 60) {
      hour += 1;
      minute = 0;
    }
  }
  return slots;
};

// ---- Các ca khám ----
const caKham = [
  { key: "morning", label: "Sáng", start: "06:00", end: "12:00" },
  { key: "afternoon", label: "Chiều", start: "13:00", end: "17:30" },
  { key: "evening", label: "Tối", start: "18:00", end: "22:00" },
];

const WeeklyScheduleWithModal: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs("2025-09-29"));
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const startOfWeek = selectedDate.isoWeekday(1);
  const endOfWeek = startOfWeek.add(6, "day");

  const weeklySlots: Slot[] = useMemo(() => {
    return generateSlots(startOfWeek.format("YYYY-MM-DD"));
  }, [selectedDate]);

  const dataSource = useMemo(() => {
    return caKham.map((ca) => {
      const row: Record<string, any> = { ca: ca.label };
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

  const dayColumns = [];
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
      render: (slots: Slot[]) => {
        const now = dayjs();

        const bookedSlots = slots.filter((s) => s.capacity === 0);
        const freeSlots = slots.filter((s) => s.capacity > 0);

        const freeBlocks: { slots: Slot[] }[] = [];
        let tempBlock: { slots: Slot[] } | null = null;

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
                    backgroundColor: isPast ? "#d4ffe4" : "#ffedef",
                    color: isPast ? "#003763" : "#003763",
                  }}
                >
                  <div className="flex flex-col items-start gap-1 text-center w-full border-l-2 border-[#e35750]">
                    <div className="text-xs font-bold pl-2">Nguyễn Văn A</div>
                    <div className="text-xs font-bold pl-2">DV: Khám mắt</div>

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
                          if (slot.appointment) {
                            setSelectedAppointment(slot.appointment);
                            setModalVisible(true);
                          }
                        }}
                      >
                        Xem chi tiết
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
                    <div className="text-xs font-bold">Trống</div>
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
      title: "Ca Khám",
      dataIndex: "ca",
      key: "ca",
      width: "8%",
      render: (text: string) => <b className="text-[#1da1f2]">{text}</b>,
    },
    ...dayColumns,
  ];

  return (
    <div className="p-4 flex flex-col gap-3">
      <Title level={3}>Lịch khám bệnh (Tuần)</Title>
      <div className="flex justify-between items-center mb-2">
        <div className="text-gray-600">
          Tuần từ <b>{startOfWeek.format("DD/MM/YYYY")}</b> đến{" "}
          <b>{endOfWeek.format("DD/MM/YYYY")}</b>
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
              Hiện tại
            </Button>
            <Button type="primary" onClick={() => window.print()}>
              <Printer size={14} />
              In Lịch
            </Button>
          </div>
        </Space>
      </div>

      <Table
        bordered
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        className="schedule-table"
        scroll={{ x: "max-content" }}
        rowKey="ca"
        rowClassName={(record) => {
          if (record.ca === "Sáng") return "row-morning";
          if (record.ca === "Chiều") return "row-afternoon";
          if (record.ca === "Tối") return "row-evening";
          return "";
        }}
        footer={() => (
          <div className="text-sm text-gray-600 flex flex-row gap-3 items-center">
            <b>Ghi chú:</b>
            <div>
              <span className="inline-block w-3 h-3 bg-[#f14f3f] border mx-1"></span>Đã đặt
            </div>
            <div>
              <span className="inline-block w-3 h-3 bg-[#e7ecf0] border mx-1"></span>Trống
            </div>
          </div>
        )}
      />

      {/* Modal hiển thị chi tiết appointment */}
      <Modal
        title="Thông tin chi tiết appointment"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {selectedAppointment && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Mã appointment">
              {selectedAppointment.appointment_code}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {AppointmentStatusLabel[
                selectedAppointment.status as keyof typeof AppointmentStatusLabel
              ].toUpperCase()}
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú">{selectedAppointment.notes}</Descriptions.Item>
            <Descriptions.Item label="Thời gian slot">
              {dayjs(selectedAppointment.timeSlot.start_time).format("HH:mm")} -{" "}
              {dayjs(selectedAppointment.timeSlot.end_time).format("HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Bệnh nhân">
              <div className="flex items-center gap-2">
                <Avatar src={selectedAppointment.patient.image} />
                <div>
                  <div>{selectedAppointment.patient.full_name}</div>
                  <div>
                    Ngày sinh: {dayjs(selectedAppointment.patient.dob).format("DD/MM/YYYY")}
                  </div>
                  <div>Giới tính: {getGenderLabel(selectedAppointment.patient.gender)}</div>
                  <div>Địa chỉ: {selectedAppointment.patient.address}</div>
                  <div>Phone: {selectedAppointment.patient.phone}</div>
                  <div>Email: {selectedAppointment.patient.email}</div>
                </div>
              </div>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default WeeklyScheduleWithModal;
