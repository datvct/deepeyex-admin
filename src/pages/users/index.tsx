import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input, Modal, Select, Space, Spin, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import CrudTable from "../../shares/components/CrudTable.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "../../modules/users/types/user.ts";
import { useListUsersQuery } from "../../modules/users/hooks/queries/use-get-users.query.ts";
import { useDeleteUserMutation } from "../../modules/users/hooks/mutations/use-delete-user.mutation.ts";
import { toast } from "react-toastify";
import { QueryKeyEnum } from "../../shares/enums/queryKey.ts";
import { Role, RoleLabel } from "../../modules/users/enums/role.ts";
const { Option } = Select;

export default function UserPage() {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const { data, isLoading, isError } = useListUsersQuery();

  const roleColors: Record<Role, string> = {
    [Role.Patient]: "green",
    [Role.Doctor]: "blue",
    [Role.Admin]: "red",
  };

  const deleteUser = useDeleteUserMutation({
    onSuccess: (data) => {
      toast.success(data.message || "Xóa tài khoản thành công");

      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.User] });
    },
    onError: (error) => {
      toast.error(error.message || "Xóa tài khoản thất bại");
    },
  });

  useEffect(() => {
    if (data?.data) {
      setUsers(data.data);
    }
  }, [data]);

  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        console.log("Update user:", { ...editingUser, ...values });
      } else {
        console.log("Create new user:", values);
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (err) {
      console.log("Validate Failed:", err);
    }
  };

  const handleDelete = (user: User) => {
    deleteUser.mutate(user.id);
  };

  // cột bảng
  const columns: ColumnsType<User> = [
    { title: "ID", dataIndex: "id", key: "id", width: "10%" },
    { title: "Tài khoản", dataIndex: "username", key: "username", width: "20%" },
    { title: "Email", dataIndex: "email", key: "email", width: "15%" },
    { title: "FireBase UID", dataIndex: "firebase_uid", key: "firebase_uid", width: "10%" },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: "25%",
      render: (role: Role) => <Tag color={roleColors[role]}>{RoleLabel[role]}</Tag>,
    },
    {
      title: "Thời gian",
      dataIndex: "created_at",
      key: "time",
      width: "20%",
    },
  ];

  return (
    <>
      {isError && (
        <Alert
          message="Lỗi tải dữ liệu"
          description="Không thể lấy danh sách tài khoản. Vui lòng thử lại sau."
          type="error"
          showIcon
          className="mb-4"
        />
      )}
      <Spin spinning={isLoading}>
        <CrudTable
          title="Quản lý người dùng"
          subtitle="Danh sách người dùng"
          rowKey="id"
          columns={columns}
          dataSource={users}
          addButtonText="Thêm người dùng"
          onAdd={handleAddUser}
          onEdit={handleEditUser}
          onDelete={handleDelete}
        />
      </Spin>

      <Modal
        title={editingUser ? "Sửa người dùng" : "Thêm người dùng"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Tài khoản"
            rules={[{ required: true, message: "Tài khoản không được để trống" }]}
          >
            <Input placeholder="Nhập tài khoản người dùng" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
          >
            <Select placeholder="Chọn vai trò">
              <Option value="admin">Admin</Option>
              <Option value="customer">Bệnh nhân</Option>
              <Option value="doctor">Bác sĩ</Option>
            </Select>
          </Form.Item>

          {!editingUser && (
            <>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  { required: true, message: "Mật khẩu không được để trống" },
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Nhập lại mật khẩu"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Vui lòng nhập lại mật khẩu" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Mật khẩu nhập lại không khớp!"));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Nhập lại mật khẩu" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </>
  );
}
