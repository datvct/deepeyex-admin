import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input, Modal, Select, Space, Spin, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CrudTable from "../../shares/components/CrudTable.tsx";
import AdvancedFilter, { FilterField } from "../../shares/components/AdvancedFilter.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "../../modules/users/types/user.ts";
import { useListUsersQuery } from "../../modules/users/hooks/queries/use-get-users.query.ts";
import { useDeleteUserMutation } from "../../modules/users/hooks/mutations/use-delete-user.mutation.ts";
import { toast } from "react-toastify";
import { QueryKeyEnum } from "../../shares/enums/queryKey.ts";
import { Role } from "../../modules/users/enums/role.ts";
import { useCreateUserMutation } from "../../modules/users/hooks/mutations/use-create-user.mutation.ts";
import { useUpdateUserMutation } from "../../modules/users/hooks/mutations/use-update-user.mutation.ts";
import z from "zod";

const { Option } = Select;

export default function UserPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [filterParams, setFilterParams] = useState<Record<string, any>>({});

  const { data, isLoading, isError } = useListUsersQuery({ filters: filterParams });

  const roleColors: Record<Role, string> = {
    [Role.Patient]: "green",
    [Role.Doctor]: "blue",
    [Role.Admin]: "red",
    [Role.Hospital]: "purple",
    [Role.Receptionist]: "orange",
  };

  // ---- Mutation: Delete
  const deleteUser = useDeleteUserMutation({
    onSuccess: (data) => {
      toast.success(t("user.messages.delete_success"));
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.User] });
    },
    onError: (error) => {
      toast.error(t("user.messages.delete_error"));
    },
  });

  // ---- Mutation: Create ----
  const createUser = useCreateUserMutation({
    onSuccess: (data) => {
      toast.success(t("user.messages.create_success"));
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.User] });
    },
    onError: (error) => {
      toast.error(t("user.messages.create_error"));
    },
  });

  // ---- Mutation: Update ----
  const updateUser = useUpdateUserMutation({
    onSuccess: (data) => {
      toast.success(t("user.messages.update_success"));
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.User] });
    },
    onError: (error) => {
      toast.error(t("user.messages.update_error"));
    },
  });

  useEffect(() => {
    if (data?.data) {
      setUsers(data.data);
    }
  }, [data]);

  // Filter fields cho User
  const userFilterFields: FilterField[] = [
    {
      name: "search",
      label: t("user.filter.search"),
      type: "text",
      placeholder: t("user.filter.searchPlaceholder"),
      width: "100%",
    },
    {
      name: "role",
      label: t("user.filter.role"),
      type: "select",
      width: "100%",
      options: [
        { label: t("user.roles.admin"), value: Role.Admin },
        { label: t("user.roles.doctor"), value: Role.Doctor },
        { label: t("user.roles.patient"), value: Role.Patient },
        { label: t("user.roles.hospital"), value: Role.Hospital },
      ],
    },
  ];

  const handleFilter = (filterValues: Record<string, any>) => {
    // Gửi filter params lên API
    setFilterParams(filterValues);
  };

  const handleResetFilter = () => {
    // Reset filter params
    setFilterParams({});
  };

  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      role: user.role,
      firebase_uid: user.firebase_uid,
      password: user.password,
      confirmPassword: user.password,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        updateUser.mutate({ id: editingUser.id, body: values });
      } else {
        createUser.mutate(values);
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

  const handleDelete = (user: User) => {
    deleteUser.mutate(user.id);
  };

  // ---- Columns ----
  const columns: ColumnsType<User> = [
    { title: t("user.columns.id"), dataIndex: "id", key: "id", width: "10%" },
    { title: t("user.columns.username"), dataIndex: "username", key: "username", width: "20%" },
    { title: t("user.columns.email"), dataIndex: "email", key: "email", width: "15%" },
    {
      title: t("user.columns.firebase_uid"),
      dataIndex: "firebase_uid",
      key: "firebase_uid",
      width: "10%",
    },
    {
      title: t("user.columns.role"),
      dataIndex: "role",
      key: "role",
      width: "25%",
      render: (role: Role) => (
        <Tag color={roleColors[role]}>{t(`user.roles.${role.toLowerCase()}`)}</Tag>
      ),
    },
    {
      title: t("user.columns.time"),
      dataIndex: "created_at",
      key: "time",
      width: "20%",
    },
  ];

  return (
    <>
      {isError && (
        <Alert
          message={t("user.error.title")}
          description={t("user.messages.load_error")}
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      <Spin spinning={isLoading}>
        <CrudTable
          title={t("user.title")}
          subtitle={t("user.subtitle")}
          rowKey="id"
          columns={columns}
          dataSource={users}
          addButtonText={t("user.addButtonText")}
          onAdd={handleAddUser}
          onEdit={handleEditUser}
          onDelete={handleDelete}
          useAdvancedFilter={true}
          filterFields={userFilterFields}
          onFilter={handleFilter}
          onResetFilter={handleResetFilter}
        />
      </Spin>

      <Modal
        title={editingUser ? t("user.modal.editTitle") : t("user.modal.addTitle")}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label={t("user.form.username")}
            rules={[
              { required: true, message: t("user.form.username_required") },
              { min: 3, message: t("user.form.username_min") },
            ]}
          >
            <Input placeholder={t("user.form.username_placeholder")} />
          </Form.Item>

          <Form.Item
            name="role"
            label={t("user.form.role")}
            rules={[{ required: true, message: t("user.form.role_required") }]}
          >
            <Select placeholder={t("user.form.role_placeholder")}>
              {Object.values(Role).map((role) => (
                <Option key={role} value={role}>
                  {t(`user.roles.${role.toLowerCase()}`)}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="email"
            label={t("user.form.email")}
            rules={[
              { required: true, message: t("user.form.email_required") },
              { type: "email", message: t("user.form.email_invalid") },
            ]}
          >
            <Input placeholder={t("user.form.email_placeholder")} />
          </Form.Item>

          <Form.Item
            name="firebase_uid"
            label={t("user.form.firebase_uid")}
            rules={[
              { required: true, message: t("user.form.firebase_uid_required") },
              { min: 6, message: t("user.form.firebase_uid_min") },
            ]}
          >
            <Input placeholder={t("user.form.firebase_uid_placeholder")} />
          </Form.Item>

          <Form.Item
            name="password"
            label={t("user.form.password")}
            rules={[
              { required: true, message: t("user.form.password_required") },
              { min: 6, message: t("user.form.password_min") },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
                message: t("user.form.password_pattern"),
              },
            ]}
            hasFeedback
          >
            <Input.Password placeholder={t("user.form.password_placeholder")} />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={t("user.form.confirmPassword")}
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: t("user.form.confirmPassword_required") },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t("user.form.confirmPassword_mismatch")));
                },
              }),
            ]}
          >
            <Input.Password placeholder={t("user.form.confirmPassword_placeholder")} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
