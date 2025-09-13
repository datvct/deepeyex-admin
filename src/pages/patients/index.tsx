import { useState, useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select, Alert, Spin, Tag, Upload, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import CrudTable from "../../shares/components/CrudTable";
import { useListPatientsQuery } from "../../modules/patients/hooks/queries/use-get-patients.query";
import { Patient } from "../../modules/patients/types/patient";
import { useDeletePatientMutation } from "../../modules/patients/hooks/mutations/use-delete-patient.mutation";
import { useCreatePatientMutation } from "../../modules/patients/hooks/mutations/use-create-patient.mutation";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../shares/enums/queryKey";
import { createPatientSchema } from "../../modules/patients/schemas/createPatient.schema";
import z from "zod";
import React from "react";
import { useUpdatePatientMutation } from "../../modules/patients/hooks/mutations/use-update-patient.mutation";
import { userData } from "../../shares/constants/mockApiUser";

const { Option } = Select;

export default function PatientsPage() {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useListPatientsQuery();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);

  // ---- Mutation: Delete
  const deletePatient = useDeletePatientMutation({
    onSuccess: (data) => {
      toast.success(data.message || "Xóa bệnh nhân thành công");
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Patient] });
    },
    onError: (error) => {
      toast.error(error.message || "Xóa bệnh nhân thất bại");
    },
  });

  // ---- Mutation: Create
  const createPatient = useCreatePatientMutation({
    onSuccess: (data) => {
      toast.success(data.message || "Thêm bệnh nhân thành công");
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Patient] });
    },
    onError: (error) => {
      toast.error(error.message || "Thêm bệnh nhân thất bại");
    },
  });

  // ---- Mutation: Update ----
  const updatePatient = useUpdatePatientMutation({
    onSuccess: (data) => {
      toast.success(data.message || "Cập nhật bệnh nhân thành công");
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Patient] });
    },
    onError: (error) => {
      toast.error(error.message || "Cập nhật bệnh nhân thất bại");
    },
  });

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
      full_name: patient.full_name,
      dob: patient.dob ? dayjs(patient.dob) : null,
      gender: patient.gender,
      address: patient.address,
      phone: patient.phone,
      email: patient.email,
      user_id: patient.user_id,
      avatar: patient.image
        ? [
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              url: patient.image,
            },
          ]
        : [],
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

      const parsed = createPatientSchema.parse(formattedValues);

      if (editingPatient) {
        updatePatient.mutate({
          patient_id: editingPatient.patient_id,
          ...parsed,
        });
      } else {
        createPatient.mutate(parsed);
      }

      setIsModalOpen(false);
      form.resetFields();
    } catch (err) {
      if (err instanceof z.ZodError) {
        form.setFields(
          err.issues.map((e) => ({
            name: e.path.join("."),
            errors: [e.message],
          })),
        );
      }
    }
  };

  const handleDelete = (patient: Patient) => {
    deletePatient.mutate(patient.patient_id);
  };

  // ---- Table Columns ----
  const columns: ColumnsType<Patient> = [
    { title: "ID", dataIndex: "patient_id", key: "patient_id", width: "10%" },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: "10%",
      render: (image: string) =>
        image ? (
          <img src={image} alt="image" style={{ width: 50, height: 50, objectFit: "cover" }} />
        ) : (
          "-"
        ),
    },
    { title: "Họ và tên", dataIndex: "full_name", key: "full_name", width: "25%" },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
      width: "5%",
      render: (dob: string) => (dob ? dayjs(dob).format("DD/MM/YYYY") : ""),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: "5%",
      render: (gender: string) => {
        let color = "";
        let text = "";

        switch (gender) {
          case "male":
            color = "blue";
            text = "Nam";
            break;
          case "female":
            color = "pink";
            text = "Nữ";
            break;
          default:
            color = "default";
            text = "Khác";
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    { title: "Địa chỉ", dataIndex: "address", key: "address", width: "10%" },
    { title: "SĐT", dataIndex: "phone", key: "phone", width: "5%" },
    { title: "Email", dataIndex: "email", key: "email", width: "10%" },
    { title: "User ID", dataIndex: "user_id", key: "user_id", width: "5%" },
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
          onDelete={handleDelete}
        />
      </Spin>

      <Modal
        title={editingPatient ? "Sửa Bệnh nhân" : "Thêm Bệnh nhân"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        confirmLoading={createPatient.isPending}
        destroyOnClose
        centered
        width={800}
      >
        <Form form={form} layout="vertical">
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                name="full_name"
                label="Họ và tên"
                rules={[{ required: true, message: "Họ và tên không được để trống" }]}
              >
                <Input placeholder="Nhập họ và tên bệnh nhân" />
              </Form.Item>

              <Form.Item
                name="dob"
                label="Ngày sinh"
                rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
              >
                <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name="gender"
                label="Giới tính"
                rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
              >
                <Select placeholder="Chọn giới tính">
                  <Option value="male">Nam</Option>
                  <Option value="female">Nữ</Option>
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
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: "Số điện thoại không được để trống" }]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[{ type: "email", message: "Email không hợp lệ" }]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>

              <Form.Item
                name="avatar"
                label="Ảnh đại diện"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
              >
                <Upload listType="picture-card" beforeUpload={() => false} maxCount={1}>
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>

              <Form.Item
                name="user_id"
                label="Tài khoản"
                rules={[{ required: true, message: "Vui lòng chọn user" }]}
              >
                <Select placeholder="Chọn user" allowClear>
                  {userData?.data
                    ?.filter((user) => user.role === "patient")
                    .map((user) => (
                      <Option key={user.user_id} value={user.user_id}>
                        {user.username || user.email || user.user_id}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
