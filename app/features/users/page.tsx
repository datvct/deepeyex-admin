import { useState } from "react";
import { Button, Space, Typography, Modal, Form, Input, Select } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import CrudTable from "~/shared/components/CrudTable";

const { Title, Text } = Typography;
const { Option } = Select;

interface User {
  id: number;
  username: string;
  role: string;
  createdAt?: string;
}

export default function ListUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // mở modal thêm user
  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // mở modal sửa user
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalOpen(true);
  };

  // submit form
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

  // cột bảng
  const columns: ColumnsType<User> = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "Tài khoản", dataIndex: "username", key: "username", width: 200 },
    { title: "Vai trò", dataIndex: "role", key: "role", width: 150 },
    { title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt", width: 180 },
    {
      title: "Hành động",
      key: "actions",
      width: 160,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
          >
            Sửa
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />}>
            Xoá
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <CrudTable
        title="Quản lý người dùng"
        subtitle="Danh sách người dùng"
        rowKey="id"
        columns={columns}
        dataSource={users}
        addButtonText="Thêm người dùng"
        onAdd={handleAddUser}
        onEdit={handleEditUser}
        onDelete={(record) => console.log("Delete user", record)}
      />

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
            rules={[
              { required: true, message: "Tài khoản không được để trống" },
            ]}
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
                      return Promise.reject(
                        new Error("Mật khẩu nhập lại không khớp!")
                      );
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
