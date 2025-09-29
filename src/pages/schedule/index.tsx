import React, { useState, useMemo } from "react";
import { Table, Card, DatePicker, Typography, Avatar, Tag, Button, Space } from "antd";
import { LeftOutlined, RightOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/vi";
import { capitalize } from "../../shares/utils/helper";

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

interface Slot {
  slot_id: string;
  doctor_id: string;
  start_time: string;
  end_time: string;
  capacity: number;
  doctor: Doctor;
  booked?: boolean; // true nếu slot đã đặt
}

// ---- Dữ liệu mẫu ----
const sampleSlots: Slot[] = [
  {
    slot_id: "fea32d6d-2f26-4b82-b5b4-8a04a43b28cf",
    doctor_id: "22e99d2f-f15c-4a4f-bf5e-3abf82536cad",
    start_time: "2025-09-29T08:00:00+07:00", // Thứ 2
    end_time: "2025-09-29T08:20:00+07:00",
    capacity: 0,
    doctor: {
      doctor_id: "22e99d2f-f15c-4a4f-bf5e-3abf82536cad",
      full_name: "Nguyễn Quang Vinh",
      phone: "0908899001",
      email: "vinh.nguyen@europeaneyecenter.com",
      image:
        "https://deepeyex-admin.s3.ap-southeast-1.amazonaws.com/doctors/fbbe4d8e-b086-41c5-ae9c-05af9841c0e8.jpg",
      specialty: "Nhãn khoa",
    },
  },
  {
    slot_id: "fea32d6d-2f26-4b82-b5b4-8a04a43b28cf",
    doctor_id: "22e99d2f-f15c-4a4f-bf5e-3abf82536cad",
    start_time: "2025-09-29T09:00:00+07:00", // Thứ 2
    end_time: "2025-09-29T09:20:00+07:00",
    capacity: 1,
    doctor: {
      doctor_id: "22e99d2f-f15c-4a4f-bf5e-3abf82536cad",
      full_name: "Nguyễn Quang Vinh",
      phone: "0908899001",
      email: "vinh.nguyen@europeaneyecenter.com",
      image:
        "https://deepeyex-admin.s3.ap-southeast-1.amazonaws.com/doctors/fbbe4d8e-b086-41c5-ae9c-05af9841c0e8.jpg",
      specialty: "Nhãn khoa",
    },
  },
  {
    slot_id: "48d5c432-353f-4d25-b94b-39f5ab69fad6",
    doctor_id: "22e99d2f-f15c-4a4f-bf5e-3abf82536cad",
    start_time: "2025-09-30T10:00:00+07:00", // Thứ 3
    end_time: "2025-09-30T10:20:00+07:00",
    capacity: 1,
    doctor: {
      doctor_id: "22e99d2f-f15c-4a4f-bf5e-3abf82536cad",
      full_name: "Nguyễn Quang Vinh",
      phone: "0908899001",
      email: "vinh.nguyen@europeaneyecenter.com",
      image:
        "https://deepeyex-admin.s3.ap-southeast-1.amazonaws.com/doctors/fbbe4d8e-b086-41c5-ae9c-05af9841c0e8.jpg",
      specialty: "Nhãn khoa",
    },
  },
  {
    slot_id: "16a679e8-8d19-4171-8719-8a6a58413bc0",
    doctor_id: "22e99d2f-f15c-4a4f-bf5e-3abf82536cad",
    start_time: "2025-10-01T14:00:00+07:00", // Thứ 4
    end_time: "2025-10-01T14:20:00+07:00",
    capacity: 1,
    doctor: {
      doctor_id: "22e99d2f-f15c-4a4f-bf5e-3abf82536cad",
      full_name: "Nguyễn Quang Vinh",
      phone: "0908899001",
      email: "vinh.nguyen@europeaneyecenter.com",
      image:
        "https://deepeyex-admin.s3.ap-southeast-1.amazonaws.com/doctors/fbbe4d8e-b086-41c5-ae9c-05af9841c0e8.jpg",
      specialty: "Nhãn khoa",
    },
  },
];

const caHoc = [
  { key: "morning", label: "Sáng", start: "06:00", end: "12:00" },
  { key: "afternoon", label: "Chiều", start: "13:00", end: "17:30" },
  { key: "evening", label: "Tối", start: "18:00", end: "22:00" },
];

const WeeklySchedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  // Lấy ra Thứ Hai của tuần chứa selectedDate
  const startOfWeek = selectedDate.isoWeekday(1); // Luôn là Thứ Hai
  const endOfWeek = startOfWeek.add(6, "day"); // Chủ Nhật

  // Lọc slot trong tuần
  const weeklySlots = useMemo(() => {
    return sampleSlots.filter((slot) => {
      const slotDate = dayjs(slot.start_time);
      return slotDate.isBetween(startOfWeek, endOfWeek, "day", "[]");
    });
  }, [selectedDate]);

  // Điều hướng tuần
  const goToPrevWeek = () => setSelectedDate((prev) => prev.subtract(1, "week"));
  const goToNextWeek = () => setSelectedDate((prev) => prev.add(1, "week"));

  // Gom slot theo ca học
  const dataSource = useMemo(() => {
    return caHoc.map((ca) => {
      const row: Record<string, any> = { ca: ca.label };

      for (let i = 0; i < 7; i++) {
        const currentDay = startOfWeek.add(i, "day");
        const dayKey = currentDay.format("YYYY-MM-DD");

        row[dayKey] = weeklySlots.filter((slot) => {
          const slotDate = dayjs(slot.start_time);
          const time = slotDate.format("HH:mm");
          return slotDate.format("YYYY-MM-DD") === dayKey && time >= ca.start && time <= ca.end;
        });
      }

      return row;
    });
  }, [weeklySlots, selectedDate]);

  // Columns: Thứ Hai -> Chủ Nhật
  const dayColumns = [];
  for (let i = 0; i < 7; i++) {
    const currentDay = startOfWeek.add(i, "day");
    const dayKey = currentDay.format("YYYY-MM-DD");

    dayColumns.push({
      title: (
        <div className="text-center">
          <div className="font-bold">{capitalize(currentDay.format("dddd"))}</div>
          <div>{currentDay.format("DD/MM")}</div>
        </div>
      ),
      dataIndex: dayKey,
      key: dayKey,
      width: "10%",
      render: (slots: Slot[]) => (
        <div className="flex flex-col gap-2 justify-center items-center">
          {slots?.map((slot) => {
            const now = dayjs();
            const slotEnd = dayjs(slot.end_time);
            const isPast = slotEnd.isBefore(now);

            return (
              <Card
                key={slot.slot_id}
                size="small"
                className="rounded-lg w-full shadow border"
                style={{
                  backgroundColor: isPast
                    ? "#D1D5DB" // gray-300
                    : slot.capacity === 0
                    ? "#f14f3f" // red-500
                    : "#e7ecf0",
                  color: isPast ? "#4B5563" : slot.capacity === 0 ? "#003763" : "#003763",
                }}
              >
                <div className="flex flex-col items-center gap-1 text-center w-full">
                  <div className="font-semibold text-xs">
                    {dayjs(slot.start_time).format("HH:mm")} -{" "}
                    {dayjs(slot.end_time).format("HH:mm")}
                  </div>

                  {slot.capacity === 0 && (
                    <>
                      <div className="text-xs">Nguyễn Văn A - Khám mắt</div>
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
                        onClick={() => console.log("Xem chi tiết slot", slot)}
                      >
                        Xem chi tiết
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ),
    });
  }

  const columns = [
    {
      title: "Ca Khám",
      dataIndex: "ca",
      key: "ca",
      width: "8%",
      render: (text: string) => <b className="flex flex-col items-center text-[#1da1f2]">{text}</b>,
    },
    ...dayColumns,
  ];

  return (
    <div className="p-4 flex flex-col gap-3">
      <Title level={3}>Lịch khám bệnh (Tuần)</Title>
      <div className="flex justify-between items-center">
        <div className="text-gray-600">
          Tuần từ <b>{startOfWeek.format("DD/MM/YYYY")}</b> đến{" "}
          <b>{endOfWeek.format("DD/MM/YYYY")}</b>
        </div>
        <Space>
          <Button icon={<LeftOutlined />} onClick={goToPrevWeek} />
          <DatePicker
            value={selectedDate}
            onChange={(value) => setSelectedDate(value || dayjs())}
            picker="date"
            suffixIcon={<CalendarOutlined />}
          />
          <Button icon={<RightOutlined />} onClick={goToNextWeek} />
        </Space>
      </div>

      {/* Table hiển thị lịch */}
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
          <div className="text-sm text-gray-600">
            <b>Ghi chú:</b>
            <span className="inline-block w-3 h-3 bg-[#f14f3f] border mx-1"></span>
            Đã đặt lịch
            <span className="inline-block w-3 h-3 bg-[#e7ecf0] border mx-1"></span>
            Lịch trống
          </div>
        )}
      />
    </div>
  );
};

export default WeeklySchedule;
