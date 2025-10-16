// VÍ DỤ SỬ DỤNG ADVANCED FILTER COMPONENT
// File này chỉ để tham khảo, không import vào production

import React, { useState } from "react";
import AdvancedFilter, { FilterField } from "./AdvancedFilter";

// ========================================
// VÍ DỤ 1: Filter cho trang BỆNH NHÂN
// ========================================
const PatientFilterExample = () => {
  const [filteredData, setFilteredData] = useState([]);

  const patientFilterFields: FilterField[] = [
    {
      name: "search",
      label: "Tìm kiếm",
      type: "text",
      placeholder: "Tìm theo tên, số điện thoại, email...",
    },
    {
      name: "gender",
      label: "Giới tính",
      type: "select",
      options: [
        { label: "Nam", value: "male" },
        { label: "Nữ", value: "female" },
        { label: "Khác", value: "other" },
      ],
    },
    {
      name: "age_range",
      label: "Độ tuổi",
      type: "number",
      placeholder: "Từ tuổi",
    },
    {
      name: "created_date",
      label: "Ngày tạo",
      type: "date-range",
    },
  ];

  const handleFilter = (values: Record<string, any>) => {
    console.log("Filter values:", values);
    // Gọi API với filter params
    // api.getPatients(values);
  };

  return (
    <AdvancedFilter
      fields={patientFilterFields}
      onFilter={handleFilter}
      cols={3}
      cardTitle="Lọc bệnh nhân"
    />
  );
};

// ========================================
// VÍ DỤ 2: Filter cho trang ĐƠN THUỐC
// ========================================
const OrderFilterExample = () => {
  const orderFilterFields: FilterField[] = [
    {
      name: "order_code",
      label: "Mã đơn hàng",
      type: "text",
      placeholder: "Nhập mã đơn hàng",
    },
    {
      name: "status",
      label: "Trạng thái",
      type: "select-multiple",
      options: [
        { label: "Chờ xử lý", value: "PENDING" },
        { label: "Đã thanh toán", value: "PAID" },
        { label: "Đã giao", value: "DELIVERED" },
        { label: "Đã hủy", value: "CANCELED" },
      ],
    },
    {
      name: "price_min",
      label: "Giá tối thiểu",
      type: "number",
      placeholder: "0",
      min: 0,
    },
    {
      name: "price_max",
      label: "Giá tối đa",
      type: "number",
      placeholder: "10000000",
      min: 0,
    },
    {
      name: "order_date",
      label: "Ngày đặt hàng",
      type: "date-range",
    },
  ];

  const handleFilter = (values: Record<string, any>) => {
    console.log("Order filter:", values);
    // Gọi API với filter
  };

  return (
    <AdvancedFilter
      fields={orderFilterFields}
      onFilter={handleFilter}
      cols={3}
      cardTitle="Lọc đơn hàng"
      submitText="Lọc đơn hàng"
    />
  );
};

// ========================================
// VÍ DỤ 3: Filter cho trang BÁC SĨ
// ========================================
const DoctorFilterExample = () => {
  const doctorFilterFields: FilterField[] = [
    {
      name: "search",
      label: "Tìm kiếm",
      type: "text",
      placeholder: "Tìm theo tên, email, số điện thoại...",
    },
    {
      name: "specialty",
      label: "Chuyên khoa",
      type: "select",
      options: [
        { label: "Tim mạch", value: "cardiology" },
        { label: "Nhãn khoa", value: "ophthalmology" },
        { label: "Da liễu", value: "dermatology" },
        { label: "Nhi khoa", value: "pediatrics" },
      ],
    },
    {
      name: "hospital_id",
      label: "Bệnh viện",
      type: "select",
      options: [
        { label: "Bệnh viện Chợ Rẫy", value: "hospital_1" },
        { label: "Bệnh viện Bạch Mai", value: "hospital_2" },
      ],
    },
  ];

  const handleFilter = (values: Record<string, any>) => {
    console.log("Doctor filter:", values);
  };

  return (
    <AdvancedFilter
      fields={doctorFilterFields}
      onFilter={handleFilter}
      cols={3}
      cardTitle="Lọc bác sĩ"
    />
  );
};

// ========================================
// VÍ DỤ 4: Filter KHÔNG DÙNG CARD (Inline)
// ========================================
const InlineFilterExample = () => {
  const fields: FilterField[] = [
    {
      name: "search",
      label: "Tìm kiếm",
      type: "text",
    },
    {
      name: "status",
      label: "Trạng thái",
      type: "select",
      options: [
        { label: "Hoạt động", value: "active" },
        { label: "Không hoạt động", value: "inactive" },
      ],
    },
  ];

  return (
    <AdvancedFilter
      fields={fields}
      onFilter={(values) => console.log(values)}
      showCard={false}
      cols={2}
    />
  );
};

// ========================================
// VÍ DỤ 5: Filter cho LỊCH KHÁM
// ========================================
const AppointmentFilterExample = () => {
  const appointmentFields: FilterField[] = [
    {
      name: "patient_name",
      label: "Tên bệnh nhân",
      type: "text",
      placeholder: "Nhập tên bệnh nhân",
    },
    {
      name: "doctor_id",
      label: "Bác sĩ",
      type: "select",
      options: [
        { label: "BS. Nguyễn Văn A", value: "doctor_1" },
        { label: "BS. Trần Thị B", value: "doctor_2" },
      ],
    },
    {
      name: "status",
      label: "Trạng thái",
      type: "select-multiple",
      options: [
        { label: "Chờ xác nhận", value: "PENDING" },
        { label: "Đã xác nhận", value: "CONFIRMED" },
        { label: "Đang khám", value: "IN_PROGRESS" },
        { label: "Hoàn thành", value: "COMPLETED" },
        { label: "Đã hủy", value: "CANCELED" },
      ],
    },
    {
      name: "appointment_date",
      label: "Ngày khám",
      type: "date-range",
    },
  ];

  const handleFilter = (values: Record<string, any>) => {
    console.log("Appointment filter:", values);
    // API call: getAppointments(values)
  };

  return (
    <AdvancedFilter
      fields={appointmentFields}
      onFilter={handleFilter}
      cols={2}
      cardTitle="Lọc lịch khám"
    />
  );
};

export {
  PatientFilterExample,
  OrderFilterExample,
  DoctorFilterExample,
  InlineFilterExample,
  AppointmentFilterExample,
};
