import React, { useState, useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select, Alert, Spin, Tag, Upload, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import CrudTable from "../../shares/components/CrudTable";
import { useListPatientsQuery } from "../../modules/patients/hooks/queries/use-get-patients.query";
import { useDeletePatientMutation } from "../../modules/patients/hooks/mutations/use-delete-patient.mutation";
import { useCreatePatientMutation } from "../../modules/patients/hooks/mutations/use-create-patient.mutation";
import { useUpdatePatientMutation } from "../../modules/patients/hooks/mutations/use-update-patient.mutation";
import { Patient } from "../../modules/patients/types/patient";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../shares/enums/queryKey";
import { createPatientSchema } from "../../modules/patients/schemas/createPatient.schema";
import z from "zod";
import { userData } from "../../shares/constants/mockApiUser";
import { FilterField } from "../../shares/components/AdvancedFilter";

const { Option } = Select;

export default function PatientsPage() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<Record<string, any>>({});
  const { data, isLoading, isError } = useListPatientsQuery({ filters });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);

  // Mutation: Delete
  const deletePatient = useDeletePatientMutation({
    onSuccess: (data) => {
      toast.success(t("patient.messages.delete_success"));
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Patient] });
    },
    onError: (error) => {
      toast.error(t("patient.messages.delete_error"));
    },
  });

  // Mutation: Create
  const createPatient = useCreatePatientMutation({
    onSuccess: (data) => {
      toast.success(t("patient.messages.create_success"));
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Patient] });
    },
    onError: (error) => {
      toast.error(t("patient.messages.create_error"));
    },
  });

  // Mutation: Update
  const updatePatient = useUpdatePatientMutation({
    onSuccess: (data) => {
      toast.success(t("patient.messages.update_success"));
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Patient] });
    },
    onError: (error) => {
      toast.error(t("patient.messages.update_error"));
    },
  });

  useEffect(() => {
    if (data?.data) setPatients(data.data);
  }, [data]);

  // Add patient
  const handleAdd = () => {
    setEditingPatient(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Edit patient
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
        ? [{ uid: "-1", name: "image.png", status: "done", url: patient.image }]
        : [],
    });
    setIsModalOpen(true);
  };

  // Submit
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formattedValues = {
        ...values,
        dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
      };

      const parsed = createPatientSchema.parse(formattedValues);

      if (editingPatient) {
        updatePatient.mutate({ patient_id: editingPatient.patient_id, ...parsed });
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

  const handleFilter = (filterValues: Record<string, any>) => {
    setFilters(filterValues);
  };

  const handleResetFilter = () => {
    setFilters({});
  };

  // Cấu hình filter fields
  const filterFields: FilterField[] = [
    {
      name: "full_name",
      label: t("patient.columns.full_name"),
      type: "text",
      placeholder: "Nhập tên bệnh nhân",
      width: 200,
    },
    {
      name: "gender",
      label: t("patient.columns.gender"),
      type: "select",
      placeholder: "Chọn giới tính",
      options: [
        { label: t("patient.gender.male"), value: "male" },
        { label: t("patient.gender.female"), value: "female" },
        { label: t("patient.gender.other"), value: "other" },
      ],
      width: 150,
    },
    {
      name: "birth_date",
      label: "Tháng/Năm sinh",
      type: "month",
      placeholder: "Chọn tháng/năm sinh",
      width: 200,
    },
  ];

  const columns = [
    { title: t("patient.columns.id"), dataIndex: "patient_id", key: "patient_id", width: "10%" },
    {
      title: t("patient.columns.image"),
      dataIndex: "image",
      key: "image",
      width: "10%",
      render: (image: string) =>
        image ? (
          <img src={image} alt="avatar" style={{ width: 50, height: 50, objectFit: "cover" }} />
        ) : (
          "-"
        ),
    },
    {
      title: t("patient.columns.full_name"),
      dataIndex: "full_name",
      key: "full_name",
      width: "25%",
    },
    {
      title: t("patient.columns.dob"),
      dataIndex: "dob",
      key: "dob",
      width: "5%",
      render: (dob: string) => (dob ? dayjs(dob).format("DD/MM/YYYY") : ""),
    },
    {
      title: t("patient.columns.gender"),
      dataIndex: "gender",
      key: "gender",
      width: "5%",
      render: (gender: string) => {
        const genderMap: Record<string, { color: string; text: string }> = {
          male: { color: "blue", text: t("patient.gender.male") },
          female: { color: "pink", text: t("patient.gender.female") },
          other: { color: "default", text: t("patient.gender.other") },
        };
        return <Tag color={genderMap[gender]?.color}>{genderMap[gender]?.text}</Tag>;
      },
    },
    { title: t("patient.columns.address"), dataIndex: "address", key: "address", width: "10%" },
    { title: t("patient.columns.phone"), dataIndex: "phone", key: "phone", width: "5%" },
    { title: t("patient.columns.email"), dataIndex: "email", key: "email", width: "10%" },
    { title: t("patient.columns.user_id"), dataIndex: "user_id", key: "user_id", width: "5%" },
  ];

  return (
    <>
      {isError && (
        <Alert message={t("patient.messages.load_error")} type="error" showIcon className="mb-4" />
      )}
      <Spin spinning={isLoading}>
        <CrudTable
          title={t("patient.title")}
          subtitle={t("patient.subtitle")}
          rowKey="patient_id"
          columns={columns}
          dataSource={patients}
          addButtonText={t("patient.addButton")}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={(patient) => deletePatient.mutate(patient.patient_id)}
          useAdvancedFilter={true}
          filterFields={filterFields}
          onFilter={handleFilter}
          onResetFilter={handleResetFilter}
        />
      </Spin>

      <Modal
        title={editingPatient ? t("patient.editModalTitle") : t("patient.addModalTitle")}
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
                label={t("patient.form.full_name")}
                rules={[{ required: true, message: t("patient.form.placeholder.full_name") }]}
              >
                <Input placeholder={t("patient.form.placeholder.full_name")} />
              </Form.Item>

              <Form.Item
                name="dob"
                label={t("patient.form.dob")}
                rules={[{ required: true, message: t("patient.form.placeholder.dob") }]}
              >
                <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name="gender"
                label={t("patient.form.gender")}
                rules={[{ required: true, message: t("patient.form.placeholder.gender") }]}
              >
                <Select placeholder={t("patient.form.placeholder.gender")}>
                  <Option value="male">{t("patient.gender.male")}</Option>
                  <Option value="female">{t("patient.gender.female")}</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="address"
                label={t("patient.form.address")}
                rules={[{ required: true, message: t("patient.form.placeholder.address") }]}
              >
                <Input placeholder={t("patient.form.placeholder.address")} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label={t("patient.form.phone")}
                rules={[{ required: true, message: t("patient.form.placeholder.phone") }]}
              >
                <Input placeholder={t("patient.form.placeholder.phone")} />
              </Form.Item>

              <Form.Item
                name="email"
                label={t("patient.form.email")}
                rules={[{ type: "email", message: t("patient.form.placeholder.email") }]}
              >
                <Input placeholder={t("patient.form.placeholder.email")} />
              </Form.Item>

              <Form.Item
                name="avatar"
                label={t("patient.form.avatar")}
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
                label={t("patient.form.user")}
                rules={[{ required: true, message: t("patient.form.placeholder.user") }]}
              >
                <Select placeholder={t("patient.form.placeholder.user")} allowClear>
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
