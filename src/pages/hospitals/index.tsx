import { Alert, Form, Input, Modal, Spin, Upload } from "antd";
import React, { useEffect, useState } from "react";
import CrudTable from "../../shares/components/CrudTable";
import { useListHospitalsQuery } from "../../modules/hospitals/hooks/queries/use-get-hospitals.query";
import { Hospital } from "../../modules/hospitals/types/hospital";
import { useDeleteHospitalMutation } from "../../modules/hospitals/hooks/mutations/use-delete-hospital.mutation";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../shares/enums/queryKey";
import { useCreateHospitalMutation } from "../../modules/hospitals/hooks/mutations/use-create-hospital.mutation";
import { createHospitalSchema } from "../../modules/hospitals/schemas/createHospital.schema";
import z from "zod";
import { PlusOutlined } from "@ant-design/icons";
import { useUpdateHospitalMutation } from "../../modules/hospitals/hooks/mutations/use-update-hospital.mutation";

export default function HospitalsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useListHospitalsQuery();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);

  // ---- Mutation: Delete
  const deleteHospital = useDeleteHospitalMutation({
    onSuccess: (data) => {
      toast.success(data.message || "Xóa bệnh viện thành công");
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Hospital] });
    },
    onError: (error) => {
      toast.error(error.message || "Xóa bệnh viện thất bại");
    },
  });

  // ---- Mutation: Create
  const createHospital = useCreateHospitalMutation({
    onSuccess: (data) => {
      toast.success(data.message || "Thêm bệnh viện thành công");
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Hospital] });
    },
    onError: (error) => {
      toast.error(error.message || "Thêm bệnh viện thất bại");
    },
  });

  // ---- Mutation: Update
  const updateHospital = useUpdateHospitalMutation({
    onSuccess: (data) => {
      toast.success(data.message || "Cập nhật bệnh viện thành công");
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Hospital] });
    },
    onError: (error) => {
      toast.error(error.message || "Cập nhật bệnh viện thất bại");
    },
  });

  // Load dữ liệu vào state
  useEffect(() => {
    if (data?.data) {
      setHospitals(data.data);
    }
  }, [data]);

  // ---- Thêm mới ----
  const handleAdd = () => {
    setEditingHospital(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // ---- Sửa ----
  const handleEdit = (hospital: Hospital) => {
    setEditingHospital(hospital);
    console.log(hospital);
    form.setFieldsValue({
      name: hospital.name,
      address: hospital.address,
      phone: hospital.phone,
      email: hospital.email,
      logo: hospital.image
        ? [
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              url: hospital.image,
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
        logo: values.logo || [],
      };
      const parsed = createHospitalSchema.parse(formattedValues);

      if (editingHospital) {
        updateHospital.mutate({
          hospital_id: editingHospital.hospital_id,
          ...parsed,
        });
      } else {
        createHospital.mutate(parsed);
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

  // ----- Xóa bệnh viện -----
  const handleDelete = (hospital: Hospital) => {
    deleteHospital.mutate(hospital.hospital_id);
  };

  // ---- Cấu hình cột bảng ----
  const hospitalColumns = [
    { title: "ID", dataIndex: "hospital_id", key: "hospital_id", width: "10%" },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: "10%",
      render: (image: string) =>
        image ? (
          <img src={image} alt="hospital" style={{ width: 50, height: 50, objectFit: "cover" }} />
        ) : (
          "-"
        ),
    },
    { title: "Tên", dataIndex: "name", key: "name", width: "25%" },
    { title: "Địa chỉ", dataIndex: "address", key: "address", width: "20%" },
    { title: "SĐT", dataIndex: "phone", key: "phone", width: "10%" },
    { title: "Email", dataIndex: "email", key: "email", width: "15%" },
  ];

  return (
    <>
      {isError && (
        <Alert
          message="Lỗi tải dữ liệu"
          description="Không thể lấy danh sách bệnh viện. Vui lòng thử lại sau."
          type="error"
          showIcon
          className="mb-4"
        />
      )}
      <Spin spinning={isLoading}>
        <CrudTable
          title="Quản lý Bệnh viện"
          subtitle="Danh sách bệnh viện"
          rowKey="hospital_id"
          columns={hospitalColumns}
          dataSource={hospitals}
          addButtonText="Thêm bệnh viện"
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Spin>

      <Modal
        title={editingHospital ? "Sửa Bệnh viện" : "Thêm Bệnh viện"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        centered
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên bệnh viện"
            rules={[{ required: true, message: "Vui lòng nhập tên bệnh viện" }]}
          >
            <Input placeholder="Nhập tên bệnh viện" />
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ">
            <Input placeholder="Nhập địa chỉ bệnh viện" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              {
                pattern: /^[0-9]{8,15}$/,
                message: "Số điện thoại không hợp lệ (8-15 chữ số)",
              },
            ]}
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
            name="logo"
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
