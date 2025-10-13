import { Alert, Button, Form, Input, InputNumber, Modal, Select, Spin, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import CrudTable from "../../shares/components/CrudTable";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../shares/enums/queryKey";
import { useGetServicesQuery } from "../../modules/services/hooks/queries/use-get-services.query";
import { Service } from "../../modules/services/types/service";
import { useDeleteServiceMutation } from "../../modules/services/hooks/mutations/use-delete-service.mutation";
import { useCreateServiceMutation } from "../../modules/services/hooks/mutations/use-create-service.mutation";
import { useUpdateServiceMutation } from "../../modules/services/hooks/mutations/use-update-service.mutation";
import { useAssignServiceMutation } from "../../modules/services/hooks/mutations/use-assign-service.mutation";
import { useTranslation } from "react-i18next";
import { useListDoctorsQuery } from "../../modules/doctors/hooks/queries/use-get-doctors.query";
import { UserAddOutlined } from "@ant-design/icons";

export default function ServicesPage() {
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [assignForm] = Form.useForm();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useGetServicesQuery();
  const { data: doctorsData } = useListDoctorsQuery();
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Mutation: Delete
  const deleteServiceMutation = useDeleteServiceMutation({
    onSuccess: () => {
      toast.success(t("service.deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Service] });
    },
    onError: () => {
      toast.error(t("service.deleteError"));
    },
  });

  // Mutation: Create
  const createServiceMutation = useCreateServiceMutation({
    onSuccess: () => {
      toast.success(t("service.createSuccess"));
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Service] });
      setIsModalOpen(false);
      form.resetFields();
    },
    onError: () => {
      toast.error(t("service.createError"));
    },
  });

  // Mutation: Update
  const updateServiceMutation = useUpdateServiceMutation({
    onSuccess: () => {
      toast.success(t("service.updateSuccess"));
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Service] });
      setIsModalOpen(false);
      form.resetFields();
    },
    onError: () => {
      toast.error(t("service.updateError"));
    },
  });

  // Mutation: Assign
  const assignServiceMutation = useAssignServiceMutation({
    onSuccess: () => {
      toast.success(t("service.assignSuccess"));
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Service] });
      setIsAssignModalOpen(false);
      assignForm.resetFields();
    },
    onError: () => {
      toast.error(t("service.assignError"));
    },
  });

  // Load dữ liệu vào state
  useEffect(() => {
    if (data?.data) {
      setServices(data.data);
    }
  }, [data]);

  // Thêm mới
  const handleAdd = () => {
    setEditingService(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Gán service cho doctor
  const handleAssign = () => {
    assignForm.resetFields();
    setIsAssignModalOpen(true);
  };

  // Submit assign form
  const handleAssignSubmit = async () => {
    try {
      const values = await assignForm.validateFields();
      assignServiceMutation.mutate(values);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  // Sửa
  const handleEdit = (record: unknown) => {
    const service = record as Service;
    setEditingService(service);
    form.setFieldsValue({
      name: service.name,
      duration: service.duration,
      price: service.price,
    });
    setIsModalOpen(true);
  };

  // Submit form
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingService) {
        // Update
        updateServiceMutation.mutate({
          serviceId: editingService.service_id,
          body: values,
        });
      } else {
        // Create
        createServiceMutation.mutate(values);
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  // Xóa
  const handleDelete = (record: unknown) => {
    const service = record as Service;
    deleteServiceMutation.mutate(service.service_id);
  };

  // Định nghĩa columns cho table
  const columns = [
    {
      title: t("service.columns.name"),
      dataIndex: "name",
      key: "name",
      width: "30%",
      sorter: (a: Service, b: Service) => a.name.localeCompare(b.name),
    },
    {
      title: t("service.columns.duration"),
      dataIndex: "duration",
      key: "duration",
      width: "15%",
      render: (duration: number) => `${duration} phút`,
      sorter: (a: Service, b: Service) => a.duration - b.duration,
    },
    {
      title: t("service.columns.price"),
      dataIndex: "price",
      key: "price",
      width: "20%",
      render: (price: number) => `${price.toLocaleString("vi-VN")} ₫`,
      sorter: (a: Service, b: Service) => a.price - b.price,
    },
    {
      title: t("service.columns.createdAt"),
      dataIndex: "created_at",
      key: "created_at",
      width: "20%",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
      sorter: (a: Service, b: Service) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        type="error"
        message={t("service.error.loadTitle")}
        description={t("service.error.loadDescription")}
        showIcon
        className="m-4"
      />
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-end items-center">
        {/* <div>
          <h2 className="text-2xl font-bold">{t("service.title")}</h2>
          <p className="text-gray-500">{t("service.subtitle")}</p>
        </div> */}
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={handleAssign}
          size="large"
          className="bg-green-600 hover:bg-green-700"
        >
          Gán dịch vụ cho bác sĩ
        </Button>
      </div>

      <CrudTable
        title={t("service.title")}
        subtitle={t("service.subtitle")}
        dataSource={services}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        rowKey="service_id"
        addButtonText={t("service.add")}
      />

      <Modal
        title={editingService ? t("service.edit") : t("service.add")}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        okText={editingService ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
        confirmLoading={createServiceMutation.isPending || updateServiceMutation.isPending}
        width={600}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            label={t("service.form.name")}
            name="name"
            rules={[{ required: true, message: t("service.form.validation.name") }]}
          >
            <Input placeholder={t("service.form.placeholder.name")} size="large" />
          </Form.Item>

          <Form.Item
            label={t("service.form.duration")}
            name="duration"
            rules={[{ required: true, message: t("service.form.validation.duration") }]}
          >
            <InputNumber
              placeholder={t("service.form.placeholder.duration")}
              size="large"
              min={1}
              max={480}
              className="w-full"
              addonAfter="phút"
            />
          </Form.Item>

          <Form.Item
            label={t("service.form.price")}
            name="price"
            rules={[{ required: true, message: t("service.form.validation.price") }]}
          >
            <InputNumber
              placeholder={t("service.form.placeholder.price")}
              size="large"
              min={0}
              className="w-full"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => {
                const parsed = Number(value?.replace(/,/g, ""));
                return (isNaN(parsed) ? 0 : parsed) as 0;
              }}
              addonAfter="₫"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal gán service cho doctor */}
      <Modal
        title="Gán dịch vụ cho bác sĩ"
        open={isAssignModalOpen}
        onOk={handleAssignSubmit}
        onCancel={() => {
          setIsAssignModalOpen(false);
          assignForm.resetFields();
        }}
        okText="Gán"
        cancelText="Hủy"
        confirmLoading={assignServiceMutation.isPending}
        width={500}
      >
        <Form form={assignForm} layout="vertical" className="mt-4">
          <Form.Item
            label="Chọn bác sĩ"
            name="doctor_id"
            rules={[{ required: true, message: "Vui lòng chọn bác sĩ" }]}
          >
            <Select
              placeholder="Chọn bác sĩ"
              size="large"
              showSearch
              filterOption={(input, option) =>
                String(option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={doctorsData?.data?.map((doctor) => ({
                label: doctor.full_name,
                value: doctor.doctor_id,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Chọn dịch vụ"
            name="service_id"
            rules={[{ required: true, message: "Vui lòng chọn dịch vụ" }]}
          >
            <Select
              placeholder="Chọn dịch vụ"
              size="large"
              showSearch
              filterOption={(input, option) =>
                String(option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={services.map((service) => ({
                label: `${service.name} - ${service.price.toLocaleString("vi-VN")} ₫ (${
                  service.duration
                } phút)`,
                value: service.service_id,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
