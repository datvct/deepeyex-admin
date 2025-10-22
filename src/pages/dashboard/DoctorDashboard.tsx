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

const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { doctor } = useSelector((state: RootState) => state.auth);
  const doctorId = doctor?.doctor_id || "";

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
      .sort((a, b) => dayjs(b.created_at).unix() - dayjs(a.created_at).unix())
      .slice(0, 5);

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
    };
  }, [todayAppointments, allAppointments, medicalRecords]);

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
      PENDING: "Đang chờ",
      CONFIRMED: "Đã xác nhận",
      COMPLETED: "Hoàn thành",
      CANCELED: "Đã hủy",
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
                  Chào mừng, Bác sĩ {doctor?.full_name}
                </h1>
                <p className="text-gray-600">
                  Chuyên khoa:{" "}
                  <Tag color="blue">
                    {doctor?.specialty === "ophthalmology" ? "Nhãn khoa" : doctor?.specialty}
                  </Tag>
                </p>
                <Space size="small" className="mt-2">
                  <Tag color="success" icon={<CheckCircleOutlined />}>
                    Đang trực
                  </Tag>
                  <span className="text-gray-500 text-sm">
                    {dayjs().format("dddd, DD/MM/YYYY")}
                  </span>
                </Space>
              </div>
            </div>
            <div className="text-right">
              <Button type="primary" onClick={() => navigate("/doctors")}>
                Chỉnh sửa hồ sơ
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
              title="Lịch khám hôm nay"
              value={stats.today.total}
              prefix={<CalendarOutlined className="text-blue-600" />}
              valueStyle={{ color: "#1890ff" }}
            />
            <Progress
              percent={stats.today.completionRate}
              size="small"
              status="active"
              format={(percent) => `${percent?.toFixed(0)}% hoàn thành`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="!h-full shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Tổng bệnh nhân"
              value={stats.patients.total}
              prefix={<TeamOutlined className="text-cyan-600" />}
              suffix="bệnh nhân"
              valueStyle={{ color: "#13c2c2" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="!h-full shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Tuần này"
              value={stats.week.total}
              prefix={<LineChartOutlined className="text-purple-600" />}
              suffix="lịch khám"
              valueStyle={{ color: "#722ed1" }}
            />
            <div className="text-sm text-gray-500 mt-2">
              Trung bình {stats.week.perDay} lịch/ngày
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="!h-full shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Hồ sơ bệnh án"
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
                Lịch khám hôm nay
              </span>
            }
            extra={
              <Button type="link" onClick={() => navigate("/doctor-consultation")}>
                Xem tất cả
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
                            {appointment.patient?.full_name || "Không có tên"}
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
                            {appointment.service_name || "Khám tổng quát"}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="Không có lịch khám hôm nay" />
            )}
          </Card>
        </Col>

        {/* Recent Medical Records */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <FileTextOutlined className="mr-2" />
                Hồ sơ bệnh án gần đây
              </span>
            }
            extra={
              <Button type="link" onClick={() => navigate("/patients")}>
                Xem tất cả
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
                          <MedicineBoxOutlined /> {record.prescriptions.length} toa thuốc
                        </Tag>
                      )}
                    </div>
                  ),
                }))}
              />
            ) : (
              <Empty description="Chưa có hồ sơ bệnh án" />
            )}
          </Card>
        </Col>

        {/* Appointment Status Breakdown */}
        <Col xs={12} lg={12}>
          <Card
            title={
              <span>
                <RiseOutlined className="mr-2" />
                Thống kê trạng thái
              </span>
            }
            className="shadow-sm"
          >
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Hoàn thành</span>
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
                  <span className="text-gray-600">Đã xác nhận</span>
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
                  <span className="text-gray-600">Đang chờ</span>
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
                Hoạt động gần đây
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
                      <div className="text-sm font-medium">Đã hoàn thành lịch khám</div>
                      <div className="text-xs text-gray-500">{dayjs().format("HH:mm")}</div>
                    </div>
                  ),
                },
                {
                  color: "blue",
                  children: (
                    <div>
                      <div className="text-sm font-medium">Đã kê toa thuốc</div>
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
                      <div className="text-sm font-medium">Cập nhật hồ sơ bệnh án</div>
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
      </Row>
    </div>
  );
};

export default DoctorDashboard;
