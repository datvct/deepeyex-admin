import React from "react";
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

// Mock data (replace with your real API data)
const visitorsData = [
  { date: "2025-09-01", visitors: 320 },
  { date: "2025-09-02", visitors: 450 },
  { date: "2025-09-03", visitors: 380 },
  { date: "2025-09-04", visitors: 520 },
  { date: "2025-09-05", visitors: 610 },
  { date: "2025-09-06", visitors: 700 },
  { date: "2025-09-07", visitors: 660 },
];

const revenueData = [
  { name: "Dịch vụ A", revenue: 4000 },
  { name: "Dịch vụ B", revenue: 3000 },
  { name: "Dịch vụ C", revenue: 2000 },
  { name: "Dịch vụ D", revenue: 2780 },
  { name: "Dịch vụ E", revenue: 1890 },
];

const statusData = [
  { name: "Hoàn thành", value: 400 },
  { name: "Đang xử lý", value: 300 },
  { name: "Hủy", value: 100 },
];

const COLORS = ["#4F46E5", "#06B6D4", "#F97316"];

export default function DashboardAnalytics() {
  return (
    <div className="min-h-screen">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Bảng điều khiển</h1>
            <p className="text-sm text-slate-500">Tổng quan hoạt động và số liệu chính</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-3 py-2 bg-white border rounded-md shadow-sm text-sm hover:shadow">
              Export
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm hover:opacity-95">
              Tạo báo cáo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-white rounded-lg shadow-sm border">
            <div className="text-sm text-slate-500">Người truy cập (7 ngày)</div>
            <div className="mt-2 text-2xl font-bold text-slate-800">4,120</div>
            <div className="text-xs text-green-600 mt-1">+12.4% so với tuần trước</div>
          </div>

          <div className="p-4 bg-white rounded-lg shadow-sm border">
            <div className="text-sm text-slate-500">Doanh thu (tháng)</div>
            <div className="mt-2 text-2xl font-bold text-slate-800">₫186,400,000</div>
            <div className="text-xs text-red-500 mt-1">-3.2% so với tháng trước</div>
          </div>

          <div className="p-4 bg-white rounded-lg shadow-sm border">
            <div className="text-sm text-slate-500">Đơn hàng</div>
            <div className="mt-2 text-2xl font-bold text-slate-800">1,240</div>
            <div className="text-xs text-green-600 mt-1">+8.1% so với tuần trước</div>
          </div>

          <div className="p-4 bg-white rounded-lg shadow-sm border">
            <div className="text-sm text-slate-500">Tỷ lệ hoàn thành</div>
            <div className="mt-2 text-2xl font-bold text-slate-800">78%</div>
            <div className="text-xs text-green-600 mt-1">Ổn định</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-medium text-slate-700">Lưu lượng truy cập</h3>
                <p className="text-xs text-slate-500">Biểu đồ lượt truy cập theo ngày</p>
              </div>
              <div className="text-xs text-slate-500">Tuần này</div>
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
                <div className="text-xs text-slate-500">Avg. Session</div>
                <div className="text-lg font-semibold">00:03:25</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-md">
                <div className="text-xs text-slate-500">Bounce Rate</div>
                <div className="text-lg font-semibold">28%</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-medium text-slate-700">Trạng thái đơn</h3>
                <p className="text-xs text-slate-500">Tổng quan theo trạng thái</p>
              </div>
              <div className="text-xs text-slate-500">Tháng</div>
            </div>

            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
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
                    <div>{s.name}</div>
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
                <h3 className="text-sm font-medium text-slate-700">Doanh thu theo dịch vụ</h3>
                <p className="text-xs text-slate-500">Top dịch vụ theo doanh thu</p>
              </div>
              <div className="text-xs text-slate-500">Tháng</div>
            </div>

            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#06B6D4" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 text-sm text-slate-500">
              Gợi ý: click từng cột để xem chi tiết.
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="mb-3">
              <h3 className="text-sm font-medium text-slate-700">Hoạt động gần đây</h3>
              <p className="text-xs text-slate-500">Các sự kiện quan trọng</p>
            </div>

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div>
                  <div className="font-medium">Đơn hàng #2345 đã hoàn thành</div>
                  <div className="text-slate-500 text-xs">2 giờ trước</div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2" />
                <div>
                  <div className="font-medium">Bác sĩ A đã được thêm vào hệ thống</div>
                  <div className="text-slate-500 text-xs">Hôm qua</div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2" />
                <div>
                  <div className="font-medium">Hệ thống backup hoàn tất</div>
                  <div className="text-slate-500 text-xs">3 ngày trước</div>
                </div>
              </li>
            </ul>

            <div className="mt-4 text-xs text-slate-500">
              Xem thêm lịch sử hoạt động trong trang quản trị.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
