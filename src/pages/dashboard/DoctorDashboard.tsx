// src/pages/dashboard/DoctorDashboard.tsx
import React, { useMemo } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Avatar,
  Badge,
  Tag,
  List,
  Progress,
  Divider,
  Button,
  Empty,
  Space,
  Timeline,
  Radio,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  BellOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ExperimentOutlined,
  LineChartOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../shares/stores";
import { useGetAppointmentsTodayByDoctorIdQuery } from "../../modules/appointments/hooks/queries/use-get-appointments-today-by-doctor.query";
import { useGetAppointmentsByDoctorIdQuery } from "../../modules/appointments/hooks/queries/use-get-appointments-by-doctor-id.query";
import { useGetMedicalRecordsQuery } from "../../modules/medical-records/hooks/queries/use-get-medical-records.query";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { Appointment } from "../../modules/appointments/types/appointment";
import { useTranslation } from "react-i18next";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DoctorDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { doctor } = useSelector((state: RootState) => state.auth);
  const doctorId = doctor?.doctor_id || "";
  const [timeRange, setTimeRange] = React.useState<"day" | "week" | "month">("week");

  // Fetch data
  const { data: todayAppointments, isLoading: loadingToday } =
    useGetAppointmentsTodayByDoctorIdQuery(doctorId);
  const { data: allAppointments, isLoading: loadingAll } =
    useGetAppointmentsByDoctorIdQuery(doctorId);
  const { data: medicalRecords, isLoading: loadingRecords } = useGetMedicalRecordsQuery();

  // Calculate statistics
  const stats = useMemo(() => {
    const today = todayAppointments?.data || [];
    const all = allAppointments?.data || [];
    const records = medicalRecords?.data || [];

    // Today's appointments by status
    const completed = today.filter((a) => a.status === "COMPLETED").length;
    const pending = today.filter((a) => a.status === "PENDING").length;
    const confirmed = today.filter((a) => a.status === "CONFIRMED").length;

    // Last 7 days appointments
    const last7Days = all.filter((a) => {
      const appointmentDate = dayjs(a.created_at);
      return appointmentDate.isAfter(dayjs().subtract(7, "day"));
    });

    // Calculate unique patients from all appointments
    const uniquePatients = new Set(
      all.map((appointment) => appointment.patient_id).filter(Boolean),
    );

    // Recent medical records (last 5)
    const recentRecords = records
      .sort(
        (a, b) =>
          dayjs(b.created_at || b.CreatedAt || 0).unix() -
          dayjs(a.created_at || a.CreatedAt || 0).unix(),
      )
      .slice(0, 5);

    // Data for charts - Dynamic based on timeRange
    let chartData: Array<{ [key: string]: string | number }> = [];

    if (timeRange === "day") {
      // Last 7 days by hour
      chartData = Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, "0");
        const appointmentsForHour = today.filter((a) => {
          if (!a.time_slots[0]?.start_time) return false;
          const hourTime = dayjs(a.time_slots[0].start_time).format("HH");
          return hourTime === hour;
        });
        return {
          time: `${hour}:00`,
          count: appointmentsForHour.length,
        };
      });
    } else if (timeRange === "week") {
      // Last 7 days
      chartData = Array.from({ length: 7 }, (_, i) => {
        const date = dayjs().subtract(6 - i, "day");
        const dateStr = date.format("DD/MM");
        const appointmentsForDay = all.filter((a) => {
          const appointmentDate = dayjs(a.created_at);
          return appointmentDate.isSame(date, "day");
        });
        return {
          date: dateStr,
          count: appointmentsForDay.length,
        };
      });
    } else if (timeRange === "month") {
      // Last 6 months
      chartData = Array.from({ length: 6 }, (_, i) => {
        const month = dayjs().subtract(5 - i, "month");
        const monthStr = month.format("MM/YYYY");
        const appointmentsForMonth = all.filter((a) => {
          const appointmentDate = dayjs(a.created_at);
          return appointmentDate.isSame(month, "month") && appointmentDate.isSame(month, "year");
        });
        return {
          date: monthStr,
          count: appointmentsForMonth.length,
        };
      });
    }

    // Status breakdown data for pie chart
    const statusData = [
      { name: t("dashboard.doctorDashboard.completed"), value: completed, color: "#52c41a" },
      { name: t("dashboard.doctorDashboard.confirmed"), value: confirmed, color: "#1890ff" },
      { name: t("dashboard.doctorDashboard.pending"), value: pending, color: "#fa8c16" },
    ];

    return {
      today: {
        total: today.length,
        completed,
        pending,
        confirmed,
        completionRate: today.length > 0 ? (completed / today.length) * 100 : 0,
      },
      week: {
        total: last7Days.length,
        perDay: (last7Days.length / 7).toFixed(1),
      },
      records: {
        total: records.length,
        recent: recentRecords,
      },
      patients: {
        total: uniquePatients.size,
      },
      chartData: {
        appointments: chartData,
        status: statusData,
        timeRange,
      },
    };
  }, [todayAppointments, allAppointments, medicalRecords, timeRange]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "orange",
      CONFIRMED: "blue",
      COMPLETED: "green",
      CANCELED: "red",
    };
    return colors[status] || "default";
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      PENDING: t("dashboard.doctorDashboard.pending"),
      CONFIRMED: t("dashboard.doctorDashboard.confirmed"),
      COMPLETED: t("dashboard.doctorDashboard.completed"),
      CANCELED: t("dashboard.doctorDashboard.canceled"),
    };
    return texts[status] || status;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <Card className="shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge status="success" dot offset={[-5, 45]}>
                <Avatar size={64} src={doctor?.image} icon={<UserOutlined />} />
              </Badge>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                  {t("dashboard.doctorDashboard.welcome")} {doctor?.full_name}
                </h1>
                <p className="text-gray-600">
                  {t("dashboard.doctorDashboard.specialty")}{" "}
                  <Tag color="blue">
                    {doctor?.specialty === "ophthalmology"
                      ? t("dashboard.doctorDashboard.ophthalmology")
                      : doctor?.specialty}
                  </Tag>
                </p>
                <Space size="small" className="mt-2">
                  <Tag color="success" icon={<CheckCircleOutlined />}>
                    {t("dashboard.doctorDashboard.onDuty")}
                  </Tag>
                  <span className="text-gray-500 text-sm">
                    {dayjs().format("dddd, DD/MM/YYYY")}
                  </span>
                </Space>
              </div>
            </div>
            <div className="text-right">
              <Button type="primary" onClick={() => navigate("/doctors")}>
                {t("dashboard.doctorDashboard.editProfile")}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="!h-full shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={t("dashboard.doctorDashboard.todayAppointments")}
              value={stats.today.total}
              prefix={<CalendarOutlined className="text-blue-600" />}
              valueStyle={{ color: "#1890ff" }}
            />
            <Progress
              percent={stats.today.completionRate}
              size="small"
              status="active"
              format={(percent) =>
                `${percent?.toFixed(0)}${t("dashboard.doctorDashboard.completionRate")}`
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="!h-full shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={t("dashboard.doctorDashboard.totalPatients")}
              value={stats.patients.total}
              prefix={<TeamOutlined className="text-cyan-600" />}
              suffix={t("dashboard.doctorDashboard.patients")}
              valueStyle={{ color: "#13c2c2" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="!h-full shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={t("dashboard.doctorDashboard.thisWeek")}
              value={stats.week.total}
              prefix={<LineChartOutlined className="text-purple-600" />}
              suffix={t("dashboard.doctorDashboard.appointments")}
              valueStyle={{ color: "#722ed1" }}
            />
            <div className="text-sm text-gray-500 mt-2">
              {t("dashboard.doctorDashboard.averagePerDay", { perDay: stats.week.perDay })}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="!h-full shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={t("dashboard.doctorDashboard.medicalRecords")}
              value={stats.records.total}
              prefix={<FileTextOutlined className="text-orange-600" />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Today's Appointments */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <CalendarOutlined className="mr-2" />
                {t("dashboard.doctorDashboard.todayAppointments")}
              </span>
            }
            extra={
              <Button type="link" onClick={() => navigate("/doctor-consultation")}>
                {t("dashboard.doctorDashboard.viewAll")}
              </Button>
            }
            className="shadow-sm"
            style={{ height: "100%" }}
          >
            {loadingToday ? (
              <div className="text-center py-8">
                <SyncOutlined spin className="text-4xl text-blue-600" />
              </div>
            ) : todayAppointments?.data && todayAppointments.data.length > 0 ? (
              <List
                dataSource={todayAppointments.data.slice(0, 5)}
                renderItem={(appointment: Appointment) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={appointment.patient?.image}
                          icon={<UserOutlined />}
                          size={40}
                        />
                      }
                      title={
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {appointment.patient?.full_name ||
                              t("dashboard.doctorDashboard.noName")}
                          </span>
                          <Tag color={getStatusColor(appointment.status)}>
                            {getStatusText(appointment.status)}
                          </Tag>
                        </div>
                      }
                      description={
                        <div>
                          <div className="text-sm text-gray-600">
                            <ClockCircleOutlined className="mr-1" />
                            {appointment.time_slots[0]?.start_time
                              ? dayjs(appointment.time_slots[0].start_time).format("HH:mm")
                              : ""}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.service_name ||
                              t("dashboard.doctorDashboard.generalCheckup")}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description={t("dashboard.doctorDashboard.noAppointmentsToday")} />
            )}
          </Card>
        </Col>

        {/* Recent Medical Records */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <FileTextOutlined className="mr-2" />
                {t("dashboard.doctorDashboard.recentMedicalRecords")}
              </span>
            }
            extra={
              <Button type="link" onClick={() => navigate("/patients")}>
                {t("dashboard.doctorDashboard.viewAll")}
              </Button>
            }
            className="shadow-sm"
            style={{ height: "100%" }}
          >
            {loadingRecords ? (
              <div className="text-center py-8">
                <SyncOutlined spin className="text-4xl text-blue-600" />
              </div>
            ) : stats.records.recent.length > 0 ? (
              <Timeline
                items={stats.records.recent.map((record) => ({
                  color: "blue",
                  children: (
                    <div>
                      <div className="font-medium text-gray-800">{record.diagnosis}</div>
                      <div className="text-sm text-gray-500">
                        {dayjs(record.created_at).format("DD/MM/YYYY HH:mm")}
                      </div>
                      {record.prescriptions && record.prescriptions.length > 0 && (
                        <Tag color="green" className="mt-1">
                          <MedicineBoxOutlined /> {record.prescriptions.length}{" "}
                          {t("dashboard.doctorDashboard.prescriptions")}
                        </Tag>
                      )}
                    </div>
                  ),
                }))}
              />
            ) : (
              <Empty description={t("dashboard.doctorDashboard.noMedicalRecords")} />
            )}
          </Card>
        </Col>

        {/* Appointment Status Breakdown */}
        <Col xs={12} lg={12}>
          <Card
            title={
              <span>
                <RiseOutlined className="mr-2" />
                {t("dashboard.doctorDashboard.statusStatistics")}
              </span>
            }
            className="shadow-sm"
          >
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">{t("dashboard.doctorDashboard.completed")}</span>
                  <span className="font-semibold text-green-600">{stats.today.completed}</span>
                </div>
                <Progress
                  percent={
                    stats.today.total > 0 ? (stats.today.completed / stats.today.total) * 100 : 0
                  }
                  strokeColor="#52c41a"
                  showInfo={false}
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">{t("dashboard.doctorDashboard.confirmed")}</span>
                  <span className="font-semibold text-blue-600">{stats.today.confirmed}</span>
                </div>
                <Progress
                  percent={
                    stats.today.total > 0 ? (stats.today.confirmed / stats.today.total) * 100 : 0
                  }
                  strokeColor="#1890ff"
                  showInfo={false}
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">{t("dashboard.doctorDashboard.pending")}</span>
                  <span className="font-semibold text-orange-600">{stats.today.pending}</span>
                </div>
                <Progress
                  percent={
                    stats.today.total > 0 ? (stats.today.pending / stats.today.total) * 100 : 0
                  }
                  strokeColor="#fa8c16"
                  showInfo={false}
                />
              </div>
            </div>
          </Card>
        </Col>

        {/* Activity Timeline */}
        <Col xs={12} lg={12}>
          <Card
            title={
              <span>
                <ClockCircleOutlined className="mr-2" />
                {t("dashboard.doctorDashboard.recentActivity")}
              </span>
            }
            className="shadow-sm"
          >
            <Timeline
              items={[
                {
                  color: "green",
                  children: (
                    <div>
                      <div className="text-sm font-medium">
                        {t("dashboard.doctorDashboard.completedAppointment")}
                      </div>
                      <div className="text-xs text-gray-500">{dayjs().format("HH:mm")}</div>
                    </div>
                  ),
                },
                {
                  color: "blue",
                  children: (
                    <div>
                      <div className="text-sm font-medium">
                        {t("dashboard.doctorDashboard.prescribedMedicine")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {dayjs().subtract(30, "minute").format("HH:mm")}
                      </div>
                    </div>
                  ),
                },
                {
                  color: "orange",
                  children: (
                    <div>
                      <div className="text-sm font-medium">
                        {t("dashboard.doctorDashboard.updatedMedicalRecord")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {dayjs().subtract(1, "hour").format("HH:mm")}
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>

        {/* Unified Chart with Time Range Selector */}
        <Col xs={24}>
          <Card
            title={
              <div className="flex items-center justify-between">
                <span>
                  <LineChartOutlined className="mr-2" />
                  {t("dashboard.doctorDashboard.appointmentStatistics")}
                </span>
                <Radio.Group
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  buttonStyle="solid"
                  size="small"
                >
                  <Radio.Button value="day">{t("dashboard.doctorDashboard.day")}</Radio.Button>
                  <Radio.Button value="week">{t("dashboard.doctorDashboard.week")}</Radio.Button>
                  <Radio.Button value="month">{t("dashboard.doctorDashboard.month")}</Radio.Button>
                </Radio.Group>
              </div>
            }
            className="shadow-sm"
          >
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={stats.chartData.appointments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={timeRange === "day" ? "time" : "date"} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#1890ff"
                  name={t("dashboard.doctorDashboard.appointmentCount")}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DoctorDashboard;
