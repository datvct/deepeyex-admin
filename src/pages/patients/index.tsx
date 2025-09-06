import { useState, useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select, Alert, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import CrudTable from "../../shares/components/CrudTable";
import { useListPatientsQuery } from "../../modules/patients/hooks/queries/use-get-patients.query";
import { Patient } from "../../modules/patients/types/patient";

const { Option } = Select;

export default function PatientsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [form] = Form.useForm();

  const { data, isLoading, isError } = useListPatientsQuery();
  const [patients, setPatients] = useState<Patient[]>([]);

  // Cập nhật patients khi data thay đổi
  useEffect(() => {
    if (data?.data) {
      setPatients(data.data);
    }
  }, [data]);

  // ---- Thêm bệnh nhân ----
  const handleAdd = () => {
    setEditingPatient(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // ---- Sửa thông tin bệnh nhân ----
  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    form.setFieldsValue({
      full_name: patient.fullName,
      dob: patient.dob ? dayjs(patient.dob) : null,
      gender: patient.gender,
      address: patient.address,
      phone: patient.phone,
      email: patient.email,
    });
    setIsModalOpen(true);
  };

  // ---- Submit form ----
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formattedValues = {
        ...values,
        dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
      };

      if (editingPatient) {
        console.log("Update patient:", {
          ...editingPatient,
          ...formattedValues,
        });
        // TODO: call update API
      } else {
        console.log("Create patient:", formattedValues);
        // TODO: call create API
      }

      setIsModalOpen(false);
      form.resetFields();
    } catch (err) {
      console.log("Validation failed:", err);
    }
  };

  // ---- Table Columns ----
  const columns: ColumnsType<Patient> = [
    { title: "ID", dataIndex: "patient_id", key: "patient_id", width: 80 },
    { title: "Hình ảnh", dataIndex: "avatar", key: "avatar", width: 100 },
    {
      title: "Họ và tên",
      dataIndex: "full_name",
      key: "full_name",
      width: 200,
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
      width: 150,
      render: (dob: string) => (dob ? dayjs(dob).format("DD/MM/YYYY") : ""),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      render: (gender: string) => {
        switch (gender) {
          case "male":
            return "Nam";
          case "female":
            return "Nữ";
          default:
            return "Khác";
        }
      },
    },
    { title: "Địa chỉ", dataIndex: "address", key: "address", width: 250 },
    { title: "SĐT", dataIndex: "phone", key: "phone", width: 150 },
    { title: "Email", dataIndex: "email", key: "email", width: 220 },
  ];

  return (
    <>
      {isError && (
        <Alert
          message="Lỗi tải dữ liệu"
          description="Không thể lấy danh sách bệnh nhân. Vui lòng thử lại sau."
          type="error"
          showIcon
          className="mb-4"
        />
      )}
      <Spin spinning={isLoading}>
        <CrudTable
          title="Quản lý Bệnh nhân"
          subtitle="Danh sách Bệnh nhân"
          rowKey="patient_id"
          columns={columns}
          dataSource={patients}
          addButtonText="Thêm Bệnh nhân"
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={(record) => console.log("Delete patient", record)}
        />
      </Spin>

      <Modal
        title={editingPatient ? "Sửa Bệnh nhân" : "Thêm Bệnh nhân"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          {/* Họ và tên */}
          <Form.Item
            name="full_name"
            label="Họ và tên"
            rules={[{ required: true, message: "Họ và tên không được để trống" }]}
          >
            <Input placeholder="Nhập họ và tên bệnh nhân" />
          </Form.Item>

          {/* Ngày sinh */}
          <Form.Item
            name="dob"
            label="Ngày sinh"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>

          {/* Giới tính */}
          <Form.Item
            name="gender"
            label="Giới tính"
            rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
          >
            <Select placeholder="Chọn giới tính">
              <Option value="male">Nam</Option>
              <Option value="female">Nữ</Option>
              <Option value="other">Khác</Option>
            </Select>
          </Form.Item>

          {/* Địa chỉ */}
          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: "Địa chỉ không được để trống" }]}
          >
            <Input placeholder="Nhập địa chỉ" />
          </Form.Item>

          {/* Số điện thoại */}
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: "Số điện thoại không được để trống" }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          {/* Email */}
          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: "email", message: "Email không hợp lệ" }]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
