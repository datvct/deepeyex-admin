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
import { useTranslation } from "react-i18next";

export default function HospitalsPage() {
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useListHospitalsQuery();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);

  // ---- Mutation: Delete
  const deleteHospital = useDeleteHospitalMutation({
    onSuccess: (data) => {
      toast.success(t("hospital.messages.deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Hospital] });
    },
    onError: (error) => {
      toast.error(t("hospital.messages.deleteError"));
    },
  });

  // ---- Mutation: Create
  const createHospital = useCreateHospitalMutation({
    onSuccess: (data) => {
      toast.success(t("hospital.messages.createSuccess"));
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Hospital] });
    },
    onError: (error) => {
      toast.error(t("hospital.messages.createError"));
    },
  });

  // ---- Mutation: Update
  const updateHospital = useUpdateHospitalMutation({
    onSuccess: (data) => {
      toast.success(t("hospital.messages.updateSuccess"));
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Hospital] });
    },
    onError: (error) => {
      toast.error(t("hospital.messages.updateError"));
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
      title: t("hospital.form.image"),
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
    { title: t("hospital.form.name"), dataIndex: "name", key: "name", width: "25%" },
    { title: t("hospital.form.address"), dataIndex: "address", key: "address", width: "20%" },
    { title: t("hospital.form.phone"), dataIndex: "phone", key: "phone", width: "10%" },
    { title: t("hospital.form.email"), dataIndex: "email", key: "email", width: "15%" },
  ];

  return (
    <>
      {isError && (
        <Alert
          message={t("hospital.messages.loadErrorTitle")}
          description={t("hospital.messages.loadErrorDescription")}
          type="error"
          showIcon
          className="mb-4"
        />
      )}
      <Spin spinning={isLoading}>
        <CrudTable
          title={t("hospital.title")}
          subtitle={t("hospital.subtitle")}
          rowKey="hospital_id"
          columns={hospitalColumns}
          dataSource={hospitals}
          addButtonText={t("hospital.addButton")}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Spin>

      <Modal
        title={editingHospital ? t("hospital.editTitle") : t("hospital.addTitle")}
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
            label={t("hospital.form.name")}
            rules={[{ required: true, message: t("hospital.form.placeholder.name") }]}
          >
            <Input placeholder={t("hospital.form.placeholder.name")} />
          </Form.Item>

          <Form.Item name="address" label={t("hospital.form.address")}>
            <Input placeholder={t("hospital.form.placeholder.address")} />
          </Form.Item>

          <Form.Item
            name="phone"
            label={t("hospital.form.phone")}
            rules={[
              {
                pattern: /^[0-9]{8,15}$/,
                message: t("hospital.form.placeholder.phone"),
              },
            ]}
          >
            <Input placeholder={t("hospital.form.placeholder.phone")} />
          </Form.Item>

          <Form.Item
            name="email"
            label={t("hospital.form.email")}
            rules={[{ type: "email", message: t("hospital.form.placeholder.email") }]}
          >
            <Input placeholder={t("hospital.form.placeholder.email")} />
          </Form.Item>

          <Form.Item
            name="logo"
            label={t("hospital.form.image")}
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
          >
            <Upload listType="picture-card" beforeUpload={() => false} maxCount={1}>
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>{t("hospital.form.image")}</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
