import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../shares/stores";
import DoctorDashboard from "./DoctorDashboard";
import { useGetStatisticsQuery } from "../../modules/statistics/hooks/queries/use-get-statistics.query";

const COLORS = ["#4F46E5", "#06B6D4", "#F97316", "#10B981", "#EF4444"];

// Helper function để format số tiền VNĐ
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Helper function để format ngày
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
};

export default function DashboardAnalytics() {
  const { t } = useTranslation();
  const { role } = useSelector((state: RootState) => state.auth);
  const isDoctor = role === "doctor";

  const { data: statisticsData, isLoading, isError } = useGetStatisticsQuery();

  // Map appointment_timeline để dùng cho AreaChart
  const visitorsData = useMemo(() => {
    if (!statisticsData?.data?.appointment_timeline) return [];
    return statisticsData.data.appointment_timeline.map((item) => ({
      date: formatDate(item.date),
      visitors: item.count,
    }));
  }, [statisticsData]);

  // Map order_status_stats để dùng cho PieChart
  const statusData = useMemo(() => {
    if (!statisticsData?.data?.order_status_stats) return [];
    return statisticsData.data.order_status_stats.map((item) => ({
      name: item.status.toLowerCase(),
      value: item.count,
      label: t(`order.status.${item.status}`),
    }));
  }, [statisticsData, t]);

  // Map revenue_by_service để dùng cho BarChart
  const revenueData = useMemo(() => {
    if (!statisticsData?.data?.revenue_by_service) return [];
    return statisticsData.data.revenue_by_service.map((item) => ({
      name:
        item.service_name.length > 20
          ? item.service_name.substring(0, 20) + "..."
          : item.service_name,
      revenue: item.revenue,
      fullName: item.service_name,
    }));
  }, [statisticsData]);

  // Tính completion rate
  const completionRate = useMemo(() => {
    if (!statisticsData?.data?.total_bookings || statisticsData.data.total_bookings === 0) return 0;
    return Math.round(
      (statisticsData.data.completed_appointments / statisticsData.data.total_bookings) * 100,
    );
  }, [statisticsData]);

  if (isDoctor) {
    return <DoctorDashboard />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-500">{t("common.loading")}</div>
      </div>
    );
  }

  if (isError || !statisticsData?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{t("common.error")}</div>
      </div>
    );
  }

  const stats = statisticsData.data;

  return (
    <div className="min-h-screen">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">{t("dashboard.title")}</h1>
            <p className="text-sm text-slate-500">{t("dashboard.subtitle")}</p>
          </div>
          {/* <div className="flex items-center gap-3">
            <button className="px-3 py-2 bg-white border rounded-md shadow-sm text-sm hover:shadow">
              {t("dashboard.export")}
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm hover:opacity-95">
              {t("dashboard.createReport")}
            </button>
          </div> */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-white rounded-lg shadow-sm border">
            <div className="text-sm text-slate-500">{t("dashboard.metrics.visitors")}</div>
            <div className="mt-2 text-2xl font-bold text-slate-800">
              {stats.total_bookings.toLocaleString("vi-VN")}
            </div>
            <div className="text-xs text-green-600 mt-1">
              {t("dashboard.metrics.totalBookings")}
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg shadow-sm border">
            <div className="text-sm text-slate-500">{t("dashboard.metrics.revenue")}</div>
            <div className="mt-2 text-2xl font-bold text-slate-800">
              {formatCurrency(stats.total_revenue)}
            </div>
            <div className="text-xs text-slate-500 mt-1">{t("dashboard.metrics.totalRevenue")}</div>
          </div>

          <div className="p-4 bg-white rounded-lg shadow-sm border">
            <div className="text-sm text-slate-500">{t("dashboard.metrics.orders")}</div>
            <div className="mt-2 text-2xl font-bold text-slate-800">
              {stats.total_orders.toLocaleString("vi-VN")}
            </div>
            <div className="text-xs text-green-600 mt-1">{t("dashboard.metrics.totalOrders")}</div>
          </div>

          <div className="p-4 bg-white rounded-lg shadow-sm border">
            <div className="text-sm text-slate-500">{t("dashboard.metrics.completionRate")}</div>
            <div className="mt-2 text-2xl font-bold text-slate-800">{completionRate}%</div>
            <div className="text-xs text-slate-500 mt-1">
              {stats.completed_appointments} {t("dashboard.metrics.completed")}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-medium text-slate-700">
                  {t("dashboard.charts.traffic.title")}
                </h3>
                <p className="text-xs text-slate-500">{t("dashboard.charts.traffic.subtitle")}</p>
              </div>
              <div className="text-xs text-slate-500">{t("dashboard.charts.traffic.thisWeek")}</div>
            </div>

            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <AreaChart
                  data={visitorsData}
                  margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#4F46E5"
                    fillOpacity={1}
                    fill="url(#colorVisitors)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-md">
                <div className="text-xs text-slate-500">
                  {t("dashboard.charts.traffic.avgSession")}
                </div>
                <div className="text-lg font-semibold">
                  {stats.total_bookings > 0
                    ? Math.round(stats.total_bookings / (visitorsData.length || 1))
                    : 0}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-md">
                <div className="text-xs text-slate-500">
                  {t("dashboard.charts.traffic.bounceRate")}
                </div>
                <div className="text-lg font-semibold">{completionRate}%</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-medium text-slate-700">
                  {t("dashboard.charts.orderStatus.title")}
                </h3>
                <p className="text-xs text-slate-500">
                  {t("dashboard.charts.orderStatus.subtitle")}
                </p>
              </div>
              <div className="text-xs text-slate-500">
                {t("dashboard.charts.orderStatus.month")}
              </div>
            </div>

            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => value}
                    labelFormatter={(label: string) => label}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4">
              {statusData.map((s, i) => (
                <div key={s.name} className="flex items-center justify-between text-sm py-1">
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        background: COLORS[i % COLORS.length],
                        borderRadius: 3,
                      }}
                    />
                    <div>{s.label || s.name}</div>
                  </div>
                  <div className="text-slate-600">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-medium text-slate-700">
                  {t("dashboard.charts.revenueByService.title")}
                </h3>
                <p className="text-xs text-slate-500">
                  {t("dashboard.charts.revenueByService.subtitle")}
                </p>
              </div>
              <div className="text-xs text-slate-500">
                {t("dashboard.charts.orderStatus.month")}
              </div>
            </div>

            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label: string) => {
                      const item = revenueData.find((d) => d.name === label);
                      return item?.fullName || label;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#06B6D4" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 text-sm text-slate-500">
              {t("dashboard.charts.revenueByService.hint")}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="mb-3">
              <h3 className="text-sm font-medium text-slate-700">
                {t("dashboard.charts.recentActivity.title")}
              </h3>
              <p className="text-xs text-slate-500">
                {t("dashboard.charts.recentActivity.subtitle")}
              </p>
            </div>

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div>
                  <div className="font-medium">
                    {t("dashboard.activities.orderCompleted", { id: 2345 })}
                  </div>
                  <div className="text-slate-500 text-xs">{t("dashboard.time.twoHoursAgo")}</div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2" />
                <div>
                  <div className="font-medium">
                    {t("dashboard.activities.doctorAdded", { name: "A" })}
                  </div>
                  <div className="text-slate-500 text-xs">{t("dashboard.time.yesterday")}</div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2" />
                <div>
                  <div className="font-medium">{t("dashboard.activities.backupCompleted")}</div>
                  <div className="text-slate-500 text-xs">{t("dashboard.time.threeDaysAgo")}</div>
                </div>
              </li>
            </ul>

            <div className="mt-4 text-xs text-slate-500">
              {t("dashboard.charts.recentActivity.viewMore")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
