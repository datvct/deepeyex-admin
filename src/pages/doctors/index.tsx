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
import { useTranslation } from "react-i18next";

export default function DoctorsPage() {
  const { t } = useTranslation();

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
      toast.success(t("doctor.messages.deleteSuccess"));

      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Doctor] });
    },
    onError: () => toast.error(t("doctor.messages.deleteError")),
  });

  //--- Mutation: Create
  const createDoctor = useCreateDoctorMutation({
    onSuccess: (data) => {
      toast.success(t("doctor.messages.createSuccess"));
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Doctor] });
    },
    onError: () => toast.error(t("doctor.messages.createError")),
  });

  // --- Mutation: Update
  const updateDoctor = useUpdateDoctorMutation({
    onSuccess: (data) => {
      toast.success(t("doctor.messages.updateSuccess"));
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Doctor] });
    },
    onError: () => toast.error(t("doctor.messages.updateError")),
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
      title: t("doctor.form.avatar"),
      dataIndex: "image",
      key: "image",
      width: "5%",
      render: (image: string) =>
        image ? (
          <img src={image} alt="doctor" style={{ width: 50, height: 50, objectFit: "cover" }} />
        ) : (
          "-"
        ),
    },
    { title: t("doctor.form.name"), dataIndex: "full_name", key: "full_name", width: "10%" },
    {
      title: t("doctor.form.specialty"),
      dataIndex: "specialty",
      key: "specialty",
      width: "8%",
      render: (specialty: Specialty) => <Tag>{SpecialtyLabel[specialty]}</Tag>,
    },
    {
      title: t("doctor.form.hospital"),
      dataIndex: "hospital_id",
      key: "hospital_id",
      width: "15%",
      render: (hospital_id: string) => {
        const hospital = hospitalData?.data?.find((h) => h.hospital_id === hospital_id);
        return hospital ? hospital.name : t("doctor.messages.loadErrorTitle");
      },
    },
    { title: t("doctor.form.email"), dataIndex: "email", key: "email", width: "10%" },
    { title: t("doctor.form.phone"), dataIndex: "phone", key: "phone", width: "10%" },
  ];

  return (
    <>
      {isError && (
        <Alert
          message={t("doctor.messages.loadErrorTitle")}
          description={t("doctor.messages.loadErrorDescription")}
          type="error"
          showIcon
          className="mb-4"
        />
      )}
      <Spin spinning={isLoading}>
        <CrudTable
          title={t("doctor.title")}
          subtitle={t("doctor.subtitle")}
          rowKey="doctor_id"
          columns={columns}
          dataSource={doctors}
          addButtonText={t("doctor.addButton")}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Spin>

      <Modal
        title={editingDoctor ? t("doctor.editTitle") : t("doctor.addButton")}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        centered
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="full_name"
            label={t("doctor.form.name")}
            rules={[
              { required: true, message: t("doctor.validation.nameRequired") },
              { pattern: /^[\p{L}\s.'-]+$/u, message: t("doctor.validation.nameInvalid") },
            ]}
          >
            <Input placeholder={t("doctor.form.placeholder.name")} />
          </Form.Item>

          {/* Chuyên khoa */}
          <Form.Item
            name="specialty"
            label={t("doctor.form.specialty")}
            rules={[{ required: true, message: t("doctor.validation.specialtyRequired") }]}
          >
            <Select placeholder={t("doctor.form.placeholder.specialty")}>
              {Object.values(Specialty).map((specialty) => (
                <Select.Option key={specialty} value={specialty}>
                  {SpecialtyLabel[specialty]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="hospital_id"
            label={t("doctor.form.hospital")}
            rules={[{ required: true, message: t("doctor.validation.hospitalRequired") }]}
          >
            <Select
              placeholder={t("doctor.form.placeholder.hospital")}
              loading={isLoadingHospitals}
              allowClear
            >
              {hospitalData?.data?.map((hospital) => (
                <Select.Option key={hospital.hospital_id} value={hospital.hospital_id}>
                  {hospital.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Email */}
          <Form.Item
            name="email"
            label={t("doctor.form.email")}
            rules={[{ type: "email", message: t("doctor.validation.emailInvalid") }]}
          >
            <Input placeholder={t("doctor.form.placeholder.email")} />
          </Form.Item>

          {/* Số điện thoại */}
          <Form.Item
            name="phone"
            label={t("doctor.form.phone")}
            rules={[{ pattern: /^[0-9]{8,15}$/, message: t("doctor.validation.phoneInvalid") }]}
          >
            <Input placeholder={t("doctor.form.placeholder.phone")} />
          </Form.Item>

          {/* User */}
          <Form.Item
            name="user_id"
            label={t("doctor.form.user")}
            rules={[{ required: true, message: t("doctor.validation.userRequired") }]}
          >
            <Select placeholder={t("doctor.form.placeholder.user")} allowClear>
              {userData?.data
                ?.filter((user) => user.role === "doctor")
                .map((user) => (
                  <Select.Option key={user.user_id} value={user.user_id}>
                    {user.username || user.email || user.user_id}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          {/* Avatar */}
          <Form.Item
            name="avatar"
            label={t("doctor.form.avatar")}
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
          >
            <Upload listType="picture-card" beforeUpload={() => false} maxCount={1}>
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>{t("doctor.form.placeholder.avatar")}</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
