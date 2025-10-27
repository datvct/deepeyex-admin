export interface PathItem {
  [k: string]: {
    PATH: string;
    LABEL: string;
    BREADCRUMB?: { title: string; href: string }[];
  };
}

export const LOGIN: PathItem = {
  DETAIL: { PATH: "/login", LABEL: "Đăng nhập" },
};

export const RESET_PASSWORD: PathItem = {
  DETAIL: { PATH: "/reset-password", LABEL: "Thay đổi mật khẩu" },
};

export const DASHBOARD: PathItem = {
  DETAIL: {
    PATH: "/",
    LABEL: "Trang chủ",
    BREADCRUMB: [{ title: "Dashboard", href: "/" }],
  },
};

export const USERS: PathItem = {
  DETAIL: {
    PATH: "/users",
    LABEL: "Tài khoản",
    BREADCRUMB: [{ title: "Tài khoản", href: "/users" }],
  },
};

export const DOCTORS: PathItem = {
  DETAIL: {
    PATH: "/doctors",
    LABEL: "Bác sĩ",
    BREADCRUMB: [{ title: "Bác sĩ", href: "/doctors" }],
  },
};

export const PATIENTS: PathItem = {
  DETAIL: {
    PATH: "/patients",
    LABEL: "Bệnh nhân",
    BREADCRUMB: [{ title: "Bệnh nhân", href: "/patients" }],
  },
};

export const HOSPITALS: PathItem = {
  DETAIL: {
    PATH: "/hospitals",
    LABEL: "Bệnh viện",
    BREADCRUMB: [{ title: "Bệnh viện", href: "/hospitals" }],
  },
};

export const DRUGS: PathItem = {
  DETAIL: {
    PATH: "/drugs",
    LABEL: "Bệnh viện",
    BREADCRUMB: [{ title: "Bệnh viện", href: "/drugs" }],
  },
};

export const VIDEOCHAT: PathItem = {
  DETAIL: {
    PATH: "/video-chat",
    LABEL: "Bệnh viện",
    BREADCRUMB: [{ title: "Cuộc hội thoại", href: "/video-chat" }],
  },
};

export const TIMESLOTS: PathItem = {
  DETAIL: {
    PATH: "/timeslots",
    LABEL: "Bệnh viện",
    BREADCRUMB: [{ title: "Bệnh viện", href: "/timeslots" }],
  },
};

export const ORDERS: PathItem = {
  DETAIL: {
    PATH: "/orders",
    LABEL: "Đơn đặt thuốc",
    BREADCRUMB: [{ title: "Đơn đặt thuốc", href: "/orders" }],
  },
};

export const APPOINTMENTS: PathItem = {
  DETAIL: {
    PATH: "/appointments",
    LABEL: "Bệnh viện",
    BREADCRUMB: [{ title: "Bệnh viện", href: "/appointments" }],
  },
};

export const SCHEDULE: PathItem = {
  DETAIL: {
    PATH: "/schedule",
    LABEL: "Lịch khám",
    BREADCRUMB: [{ title: "Lịch khám", href: "/schedule" }],
  },
};

export const GENERATE_TIME_SLOT: PathItem = {
  DETAIL: {
    PATH: "/generate-time-slot",
    LABEL: "Tạo lịch khám theo bệnh viện",
    BREADCRUMB: [{ title: "Tạo lịch khám theo bệnh viện", href: "/generate-time-slot" }],
  },
};

export const PROFILE: PathItem = {
  DETAIL: {
    PATH: "/profile",
    LABEL: "Thông tin tài khoản",
    BREADCRUMB: [{ title: "Thông tin tài khoản", href: "/profile" }],
  },
  CHANGE_PASSWORD: {
    PATH: "/profile/change-password",
    LABEL: "Thay đổi mật khẩu",
    BREADCRUMB: [
      { title: "Thông tin tài khoản", href: "/profile" },
      { title: "Thay đổi mật khẩu", href: "/profile/change-password" },
    ],
  },
};

export const SERVICES: PathItem = {
  DETAIL: {
    PATH: "/services",
    LABEL: "Dịch vụ",
    BREADCRUMB: [{ title: "Dịch vụ", href: "/services" }],
  },
};

export const DOCTOR_CONSULTATION: PathItem = {
  DETAIL: {
    PATH: "/doctor-consultation",
    LABEL: "Khám bệnh",
    BREADCRUMB: [{ title: "Khám bệnh", href: "/doctor-consultation" }],
  },
};

export const AI_DIAGNOSIS: PathItem = {
  DETAIL: {
    PATH: "/ai-diagnosis",
    LABEL: "Chẩn đoán AI Nhãn khoa",
    BREADCRUMB: [{ title: "Chẩn đoán AI Nhãn khoa", href: "/ai-diagnosis" }],
  },
};

export const EYE_DIAGNOSIS: PathItem = {
  DETAIL: {
    PATH: "/eye-diagnosis",
    LABEL: "Chẩn đoán bằng hình ảnh",
    BREADCRUMB: [{ title: "Chẩn đoán bằng hình ảnh", href: "/eye-diagnosis" }],
  },
};

export const CREATE_FOLLOW_UP: PathItem = {
  DETAIL: {
    PATH: "/appointments/create-follow-up",
    LABEL: "Tạo lịch tái khám",
    BREADCRUMB: [{ title: "Tạo lịch tái khám", href: "/appointments/create-follow-up" }],
  },
};

// export const DASHBOARD_DOCTOR: PathItem = {
//   DETAIL: {
//     PATH: "/dashboard-doctor",
//     LABEL: "Bảng điều khiển",
//     BREADCRUMB: [{ title: "Bảng điều khiển", href: "/dashboard-doctor" }],
//   },
// };

export * as Paths from "./path-routers";
