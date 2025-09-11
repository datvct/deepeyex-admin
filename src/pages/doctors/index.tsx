import { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Alert, Spin, Tag, Upload } from "antd";
import type { ColumnsType } from "antd/es/table";
import CrudTable from "../../shares/components/CrudTable";
import React from "react";
import { Doctor } from "../../modules/doctors/types/doctor";
import { useListDoctorsQuery } from "../../modules/doctors/hooks/queries/use-get-doctors.query";
import { useDeleteDoctorMutation } from "../../modules/doctors/hooks/mutations/use-delete-doctor.mutation";
import { toast } from "react-toastify";
import { QueryKeyEnum } from "../../shares/enums/queryKey";
import { useQueryClient } from "@tanstack/react-query";
import { Specialty, SpecialtyLabel } from "../../modules/doctors/enums/specialty";
import { useListHospitalsQuery } from "../../modules/hospitals/hooks/queries/use-get-hospitals.query";
import { PlusOutlined } from "@ant-design/icons";
import { useCreateDoctorMutation } from "../../modules/doctors/hooks/mutations/use-create-doctor.mutation";
import { useUpdateDoctorMutation } from "../../modules/doctors/hooks/mutations/use-update-doctor.mutation";
import { createDoctorSchema } from "../../modules/doctors/schemas/createDoctor.schema";
import { userData } from "../../shares/constants/mockApiUser";
import z from "zod";

export default function DoctorsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const { data, isLoading, isError } = useListDoctorsQuery();

  const {
    data: hospitalData,
    isLoading: isLoadingHospitals,
    isError: isErrorHospitals,
  } = useListHospitalsQuery();

  //---- Mutation: Delete
  const deleteDoctor = useDeleteDoctorMutation({
    onSuccess: (data) => {
      toast.success(data.message || "Xóa bác sĩ thành công");

      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Doctor] });
    },
    onError: (error) => {
      toast.error(error.message || "Xóa bác sĩ thất bại");
    },
  });

  //--- Mutation: Create
  const createDoctor = useCreateDoctorMutation({
    onSuccess: (data) => {
      toast.success(data.message || "Thêm bác sĩ thành công");
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Doctor] });
    },
    onError: (error) => {
      toast.error(error.message || "Thêm bác sĩ thất bại");
    },
  });

  // --- Mutation: Update
  const updateDoctor = useUpdateDoctorMutation({
    onSuccess: (data) => {
      toast.success(data.message || "Cập nhật bác sĩ thành công");
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Doctor] });
    },
    onError: (error) => {
      toast.error(error.message || "Cập nhật bác sĩ thất bại");
    },
  });

  useEffect(() => {
    if (data?.data) {
      setDoctors(data.data);
    }
  }, [data]);

  const handleAdd = () => {
    setEditingDoctor(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    form.setFieldsValue({
      full_name: doctor.full_name,
      specialty: doctor.specialty,
      hospital_id: doctor.hospital_id,
      email: doctor.email,
      phone: doctor.phone,
      avatar: doctor.image
        ? [
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              url: doctor.image,
            },
          ]
        : [],
      user_id: doctor.user_id,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formattedValues = {
        ...values,
        avatar: values.avatar || [],
      };

      const parsed = createDoctorSchema.parse(formattedValues);
      if (editingDoctor) {
        updateDoctor.mutate({
          doctor_id: editingDoctor.doctor_id,
          ...parsed,
        });
      } else {
        createDoctor.mutate(parsed);
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

  const handleDelete = (doctor: Doctor) => {
    deleteDoctor.mutate(doctor.doctor_id);
  };

  const columns: ColumnsType<Doctor> = [
    { title: "ID", dataIndex: "doctor_id", key: "doctor_id", width: "8%" },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: "5%",
      render: (image: string) =>
        image ? (
          <img src={image} alt="hospital" style={{ width: 50, height: 50, objectFit: "cover" }} />
        ) : (
          "-"
        ),
    },
    { title: "Tên", dataIndex: "full_name", key: "full_name", width: "10%" },
    {
      title: "Chuyên khoa",
      dataIndex: "specialty",
      key: "specialty",
      width: "8%",
      render: (specialty: Specialty) => {
        let color = "";

        switch (specialty) {
          case Specialty.Ophthalmology:
            color = "blue";
            break;
          case Specialty.InternalMedicine:
            color = "green";
            break;
          case Specialty.Neurology:
            color = "purple";
            break;
          case Specialty.Endocrinology:
            color = "orange";
            break;
          case Specialty.Pediatrics:
            color = "pink";
            break;
          default:
            color = "default";
        }

        return <Tag color={color}>{SpecialtyLabel[specialty]}</Tag>;
      },
    },
    {
      title: "Bệnh viện",
      dataIndex: "hospital_id",
      key: "hospital_id",
      width: "15%",
      render: (hospital_id: string) => {
        const hospital = hospitalData?.data?.find((h) => h.hospital_id === hospital_id);
        return hospital ? hospital.name : "Không xác định";
      },
    },
    { title: "Email", dataIndex: "email", key: "email", width: "10%" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone", width: "10%" },
  ];

  return (
    <>
      {isError && (
        <Alert
          message="Lỗi tải dữ liệu"
          description="Không thể lấy danh sách bác sĩ. Vui lòng thử lại sau."
          type="error"
          showIcon
          className="mb-4"
        />
      )}
      <Spin spinning={isLoading}>
        <CrudTable
          title="Quản lý Bác sĩ"
          subtitle="Danh sách Bác sĩ"
          rowKey="doctor_id"
          columns={columns}
          dataSource={doctors}
          addButtonText="Thêm Bác sĩ"
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Spin>

      <Modal
        title={editingDoctor ? "Sửa Bác sĩ" : "Thêm Bác sĩ"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        centered
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="full_name"
            label="Tên bác sĩ"
            rules={[
              { required: true, message: "Tên không được để trống" },
              {
                pattern: /^[\p{L}\s.'-]+$/u,
                message: "Họ và tên không được chứa ký tự đặc biệt",
              },
            ]}
          >
            <Input placeholder="Nhập tên bác sĩ" />
          </Form.Item>

          {/* Chuyên khoa */}
          <Form.Item
            name="specialty"
            label="Chuyên khoa"
            rules={[{ required: true, message: "Chuyên khoa không được để trống" }]}
          >
            <Select placeholder="Chọn chuyên khoa">
              {Object.values(Specialty).map((specialty) => (
                <Select.Option key={specialty} value={specialty}>
                  {SpecialtyLabel[specialty]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="hospital_id"
            label="Bệnh viện"
            rules={[{ required: true, message: "Vui lòng chọn bệnh viện" }]}
          >
            <Select placeholder="Chọn bệnh viện" loading={isLoadingHospitals} allowClear>
              {hospitalData?.data?.map((hospital) => (
                <Select.Option key={hospital.hospital_id} value={hospital.hospital_id}>
                  {hospital.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: "email", message: "Email không hợp lệ" }]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="SĐT"
            rules={[
              {
                pattern: /^[0-9]{8,15}$/,
                message: "Số điện thoại phải là số và có từ 8 đến 15 chữ số",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="user_id"
            label="Người dùng"
            rules={[{ required: true, message: "Vui lòng chọn user" }]}
          >
            <Select placeholder="Chọn user" allowClear>
              {userData?.data
                ?.filter((user) => user.role === "doctor")
                .map((user) => (
                  <Select.Option key={user.user_id} value={user.user_id}>
                    {user.username || user.email || user.user_id}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="avatar"
            label="Ảnh bệnh viện"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
          >
            <Upload listType="picture-card" beforeUpload={() => false} maxCount={1}>
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải Ảnh</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
