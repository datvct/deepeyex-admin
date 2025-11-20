import React, { useState } from "react";
import {
  Layout,
  Tabs,
  Card,
  DatePicker,
  Button,
  Upload,
  Table,
  Checkbox,
  Select,
  UploadFile,
} from "antd";
import { UploadOutlined, CalendarOutlined, UserOutlined } from "@ant-design/icons";
import { Dayjs } from "dayjs";
import { useCreateMultiTimeSlotMutation } from "../../modules/time-slots/hooks/mutations/use-create-multi-time-slot.mutation";
import { useImportDayOffMutation } from "../../modules/time-slots/hooks/mutations/use-import-day-off.mutation";
import { useGetDoctorsByHospitalIdQuery } from "../../modules/doctors/hooks/queries/use-get-doctor-by-hospital-id.query";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../shares/stores";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../shares/enums/queryKey";

const { Content } = Layout;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Option } = Select;

export default function HospitalScheduleManager() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  // Lấy hospital ID từ auth slice - khi role là "hospital" thì userId chính là hospital ID
  const { doctor } = useSelector((state: RootState) => state.auth);

  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [weekTemplate, setWeekTemplate] = useState<any>({});
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { data } = useGetDoctorsByHospitalIdQuery({
    hospitalId: doctor?.hospital_id || "",
    enabled: !!doctor?.hospital_id,
  });

  const weekdays = [
    { key: "mon", label: t("timeSlots.generate.weekdays.mon") },
    { key: "tue", label: t("timeSlots.generate.weekdays.tue") },
    { key: "wed", label: t("timeSlots.generate.weekdays.wed") },
    { key: "thu", label: t("timeSlots.generate.weekdays.thu") },
    { key: "fri", label: t("timeSlots.generate.weekdays.fri") },
    { key: "sat", label: t("timeSlots.generate.weekdays.sat") },
    { key: "sun", label: t("timeSlots.generate.weekdays.sun") },
  ];

  const shifts = [
    { key: "morning", label: t("timeSlots.generate.shifts.morning") },
    { key: "afternoon", label: t("timeSlots.generate.shifts.afternoon") },
    { key: "evening", label: t("timeSlots.generate.shifts.evening") },
  ];

  // Tick từng ca trong tuần
  const handleTemplateChange = (dayKey: string, shiftKey: string, checked: boolean) => {
    setWeekTemplate((prev: any) => {
      const newDay = { ...(prev[dayKey] || {}) };
      if (checked) {
        newDay[shiftKey] = true;
      } else {
        delete newDay[shiftKey];
      }
      return { ...prev, [dayKey]: newDay };
    });
  };

  // Chọn tất cả ca trong 1 ngày
  const handleSelectAll = (dayKey: string, checked: boolean) => {
    setWeekTemplate((prev: any) => {
      if (checked) {
        const allShifts: any = {};
        shifts.forEach((s) => (allShifts[s.key] = true));
        return { ...prev, [dayKey]: allShifts };
      } else {
        const newTemplate = { ...prev };
        delete newTemplate[dayKey];
        return newTemplate;
      }
    });
  };

  // Convert tuần template + khoảng ngày thành body API (luôn coi thứ 2 là đầu tuần)
  const buildScheduleBody = () => {
    if (!doctorId || !dateRange) return null;

    const [start, end] = dateRange;
    const shiftsArr: any[] = [];
    const weekdayMap = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]; // Mon = 0

    for (let d = start.clone(); d.isBefore(end) || d.isSame(end, "day"); d = d.add(1, "day")) {
      const weekdayKey = weekdayMap[(d.day() + 6) % 7]; // shift Sunday về cuối
      const selectedShifts = weekTemplate[weekdayKey];
      if (selectedShifts) {
        shiftsArr.push({
          date: d.format("YYYY-MM-DD"),
          slots: Object.keys(selectedShifts),
        });
      }
    }

    return {
      doctor_id: doctorId,
      shifts: shiftsArr,
    };
  };

  //--- Mutation: Create
  const createMultiShiftTimeSlot = useCreateMultiTimeSlotMutation({
    onSuccess: () => {
      toast.success(t("timeSlots.generate.messages.createSuccess"));
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.TimeSlot] });
    },
    onError: () => toast.error(t("timeSlots.generate.messages.createError")),
  });

  // --- Mutation: Import
  const importDayOffTimeSlot = useImportDayOffMutation({
    onSuccess: () => {
      toast.success(t("timeSlots.generate.messages.importSuccess"));
    },
    onError: () => toast.error(t("timeSlots.generate.messages.importError")),
  });

  const handleGenerateDoctorSchedule = async () => {
    if (!doctorId) {
      toast.error(t("timeSlots.generate.messages.doctorRequired"));
      return;
    }
    if (!dateRange) {
      toast.error(t("timeSlots.generate.messages.dateRangeRequired"));
      return;
    }

    const body = buildScheduleBody();
    if (!body || body.shifts.length === 0) {
      toast.error(t("timeSlots.generate.messages.noShiftsSelected"));
      return;
    }

    try {
      await createMultiShiftTimeSlot.mutateAsync(body);

      //tạo xog clear state
      setDoctorId(null);
      setDateRange(null);
      setWeekTemplate({});
    } catch (err: any) {
      toast.error(t("timeSlots.generate.messages.createScheduleError"));
    }
  };

  const handleImportSubmit = async () => {
    if (fileList.length === 0) {
      toast.error(t("timeSlots.generate.messages.fileRequired"));
      return;
    }

    try {
      const res = await importDayOffTimeSlot.mutateAsync(fileList[0] as any);
      toast.success(res.message || t("timeSlots.generate.messages.importFileSuccess"));

      // ✅ clear luôn fileList => Upload UI sẽ biến mất file
      setFileList([]);
    } catch (err) {
      toast.error(t("timeSlots.generate.messages.importFileError"));
    }
  };

  const handleFileSelect = (file: UploadFile) => {
    setFileList([file]); // chỉ cho chọn 1 file
    return false; // ngăn AntD auto upload
  };

  return (
    <div className="min-h-screen">
      <Content>
        <Card className="rounded-2xl h-full shadow-lg">
          <Tabs defaultActiveKey="1" size="large">
            {/* Tab 1: Tạo lịch thủ công */}
            <TabPane
              tab={
                <span>
                  <UserOutlined />
                  {t("timeSlots.generate.manualTab")}
                </span>
              }
              key="1"
            >
              {/* chọn bác sĩ + khoảng ngày */}
              <div className="flex flex-row gap-4">
                <div className="flex items-center gap-4 mb-6">
                  <span>{t("timeSlots.generate.selectDoctor")}</span>

                  <Select
                    style={{ width: 300 }}
                    placeholder={t("timeSlots.generate.selectDoctorPlaceholder")}
                    value={doctorId}
                    onChange={(val) => setDoctorId(val)}
                    showSearch
                    optionFilterProp="label"
                    filterOption={(input, option) =>
                      (option?.label as string).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {data?.data?.map((doctor) => (
                      <Option
                        key={doctor.doctor_id}
                        value={doctor.doctor_id}
                        label={`${doctor.full_name} - ${doctor.doctor_id}`}
                      >
                        {doctor.full_name} - {doctor.doctor_id}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <span>{t("timeSlots.generate.timeRange")}</span>
                  <RangePicker
                    value={dateRange}
                    onChange={(val) => setDateRange(val as [Dayjs, Dayjs])}
                    format="DD/MM/YYYY"
                  />
                </div>
              </div>

              {/* chọn ca làm việc */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {weekdays.map((d) => (
                  <Card key={d.key} size="small" className="rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">{d.label}</p>
                      <Checkbox
                        onChange={(e) => handleSelectAll(d.key, e.target.checked)}
                        checked={
                          weekTemplate[d.key] &&
                          Object.keys(weekTemplate[d.key]).length === shifts.length
                        }
                      >
                        {t("timeSlots.generate.selectAll")}
                      </Checkbox>
                    </div>
                    <div className="flex flex-col gap-2">
                      {shifts.map((s) => (
                        <Checkbox
                          key={s.key}
                          checked={!!weekTemplate[d.key]?.[s.key]}
                          onChange={(e) => handleTemplateChange(d.key, s.key, e.target.checked)}
                        >
                          {s.label}
                        </Checkbox>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Button type="primary" size="large" onClick={handleGenerateDoctorSchedule}>
                  {t("timeSlots.generate.createScheduleButton")}
                </Button>
              </div>
            </TabPane>

            {/* Tab 2: Import ngày nghỉ */}
            <TabPane
              tab={
                <span>
                  <CalendarOutlined /> {t("timeSlots.generate.importTab")}
                </span>
              }
              className="flex flex-col gap-4"
              key="2"
            >
              {/* Upload file */}
              <div className="flex flex-row gap-4">
                <Upload
                  beforeUpload={handleFileSelect}
                  fileList={fileList}
                  onRemove={() => setFileList([])} // xoá khi user nhấn nút remove
                  showUploadList={true}
                  maxCount={1}
                  className="w-1/3"
                >
                  <Button icon={<UploadOutlined />} className="w-[300px]">
                    {t("timeSlots.generate.selectExcelFile")}
                  </Button>
                </Upload>

                <Button
                  type="primary"
                  onClick={handleImportSubmit}
                  loading={importDayOffTimeSlot.isPending}
                  disabled={fileList.length === 0}
                >
                  {t("timeSlots.generate.importButton")}
                </Button>
              </div>

              {/* Hướng dẫn người dùng */}
              <Card className="mb-4 p-4 bg-gray-50">
                <h3 className="font-semibold mb-2">{t("timeSlots.generate.instructions.title")}</h3>
                <ol className="list-decimal list-inside space-y-1">
                  <li>{t("timeSlots.generate.instructions.step1")}</li>
                  <li>{t("timeSlots.generate.instructions.step2")}</li>
                  <li>{t("timeSlots.generate.instructions.step3")}</li>
                  <li>{t("timeSlots.generate.instructions.step4")}</li>
                </ol>
                <a
                  href="/mau_ngay_nghi.xlsx" // <-- link tới file mẫu trên server/public
                  download
                  className="inline-block mt-2 text-blue-600 underline"
                >
                  {t("timeSlots.generate.instructions.downloadTemplate")}
                </a>
              </Card>
            </TabPane>
          </Tabs>
        </Card>
      </Content>
    </div>
  );
}
