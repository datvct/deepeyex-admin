import { useState } from "react";
import { Modal, Form, Input, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import CrudTable from "../../shares/components/CrudTable";
import React from "react";

const { Option } = Select;

interface Doctor {
  doctor_id: number;
  full_name: string;
  specialty: string;
  hospital: string;
  email: string;
  phone?: string;
  image?: string;
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingDoctor(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    form.setFieldsValue(doctor);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingDoctor) {
        console.log("Update doctor:", { ...editingDoctor, ...values });
      } else {
        console.log("Create doctor:", values);
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (err) {
      console.log("Validation failed:", err);
    }
  };

  const columns: ColumnsType<Doctor> = [
    { title: "ID", dataIndex: "doctor_id", key: "doctor_id", width: 80 },
    { title: "Hình ảnh", dataIndex: "image", key: "image", width: 200 },
    { title: "Tên", dataIndex: "full_name", key: "full_name", width: 180 },
    {
      title: "Chuyên khoa",
      dataIndex: "specialty",
      key: "specialty",
      width: 150,
    },
    { title: "Bệnh viện", dataIndex: "hospital", key: "hospital", width: 200 },
    { title: "Email", dataIndex: "email", key: "email", width: 220 },
    // {
    //   title: "Hành động",
    //   key: "actions",
    //   width: 160,
    //   render: (_, record) => (
    //     <Space>
    //       <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
    //         Sửa
    //       </Button>
    //       <Button type="link" danger icon={<DeleteOutlined />}>
    //         Xoá
    //       </Button>
    //     </Space>
    //   ),
    // },
  ];

  return (
    <>
      <CrudTable
        title="Quản lý Bác sĩ"
        subtitle="Danh sách Bác sĩ"
        rowKey="doctor_id"
        columns={columns}
        dataSource={doctors.map((doctor) => ({
          ...doctor,
          id: doctor.doctor_id,
        }))}
        addButtonText="Thêm Bác sĩ"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={(record) => console.log("Delete doctor", record)}
      />

      <Modal
        title={editingDoctor ? "Sửa Bác sĩ" : "Thêm Bác sĩ"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="full_name"
            label="Tên bác sĩ"
            rules={[{ required: true, message: "Tên không được để trống" }]}
          >
            <Input placeholder="Nhập tên bác sĩ" />
          </Form.Item>

          <Form.Item
            name="specialty"
            label="Chuyên khoa"
            rules={[
              { required: true, message: "Chuyên khoa không được để trống" },
            ]}
          >
            <Select placeholder="Chọn chuyên khoa">
              <Option value="Nội khoa">Nội khoa</Option>
              <Option value="Ngoại khoa">Ngoại khoa</Option>
              <Option value="Nhãn khoa">Nhãn khoa</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="hospital"
            label="Bệnh viện"
            rules={[{ required: true, message: "Vui lòng chọn bệnh viện" }]}
          >
            <Select placeholder="Chọn bệnh viện">{/* load từ API */}</Select>
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: "email", message: "Email không hợp lệ" }]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item name="phone" label="SĐT">
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
