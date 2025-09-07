import { Alert, Form, Input, Modal, Spin } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import CrudTable from "../../shares/components/CrudTable";
import { useListHospitalsQuery } from "../../modules/hospitals/hooks/queries/use-get-hospitals.query";
import { Hospital } from "../../modules/hospitals/types/hospital";
import { useDeleteHospitalMutation } from "../../modules/hospitals/hooks/mutations/use-delete-hospital.mutation";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../shares/enums/queryKey";

export default function HospitalsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useListHospitalsQuery();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);

  const deleteHospital = useDeleteHospitalMutation({
    onSuccess: (data) => {
      toast.success(data.message || "Xóa bệnh viện thành công");

      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Hospital] });
    },
    onError: (error) => {
      toast.error(error.message || "Xóa bệnh viện thất bại");
    },
  });

  useEffect(() => {
    if (data?.data) {
      setHospitals(data.data);
    }
  }, [data]);

  const handleAdd = () => {
    setEditingHospital(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (hospital: Hospital) => {
    setEditingHospital(hospital);
    form.setFieldsValue({
      name: hospital.name,
      address: hospital.address,
      phone: hospital.phone,
      email: hospital.email,
    });
    setIsModalOpen(true);
  };

  // ---- Submit form ----
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formattedValues = {
        ...values,
      };

      if (editingHospital) {
        console.log("Update hospital:", {
          ...editingHospital,
          ...formattedValues,
        });
        // TODO: call update API
      } else {
        console.log("Create hospital:", formattedValues);
        // TODO: call create API
      }

      setIsModalOpen(false);
      form.resetFields();
    } catch (err) {
      console.log("Validation failed:", err);
    }
  };

  // ----- Delete hospital -----
  const handleDelete = (hospital: Hospital) => {
    deleteHospital.mutate(hospital.hospital_id);
  };

  const hospitalColumns = [
    { title: "ID", dataIndex: "hospital_id", key: "hospital_id", width: "10%" },
    { title: "Hình ảnh", dataIndex: "logo_", key: "avatar", width: "10%" },
    { title: "Tên", dataIndex: "name", key: "name", width: "25%" },
    { title: "Địa chỉ", dataIndex: "address", key: "address", width: "20%" },
    { title: "SĐT", dataIndex: "phone", key: "phone", width: "10%" },
    { title: "Email", dataIndex: "email", key: "email", width: "10%" },
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
        title="Thêm / Sửa Bệnh viện"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên bệnh viện" rules={[{ required: true }]}>
            <Input placeholder="Nhập tên bệnh viện" />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input placeholder="Nhập địa chỉ bệnh viện" />
          </Form.Item>
          <Form.Item name="phone" label="SĐT">
            <Input placeholder="Nhập số điện thoại của bệnh viện" />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input placeholder="Nhập gmail của bệnh viện" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
