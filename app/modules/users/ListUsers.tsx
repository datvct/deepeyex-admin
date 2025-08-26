import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Typography,
  message,
  Modal,
  Form,
  Input,
  Select,
  Upload,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleFilled,
  UploadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const { Option } = Select;

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
  createdAt?: string;
}

export default function ListUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  // const fetchUsers = async () => {
  //   try {
  //     setLoading(true);
  //     const data = await getAllUsers();
  //     setUsers(data);
  //     toast.success("Lấy danh sách người dùng thành công");
  //   } catch (error) {
  //     toast.error("Lỗi khi tải danh sách người dùng");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setFileList([]);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setFileList(
      user.avatar
        ? [
            {
              uid: "-1",
              name: "avatar.png",
              status: "done",
              url: user.avatar,
            },
          ]
        : []
    );
    setIsModalOpen(true);
  };

  // const handleDeleteUser = async (id: number) => {
  //   try {
  //     await deleteUser(id);
  //     toast.success("Xóa người dùng thành công");
  //     fetchUsers();
  //   } catch (error) {
  //     toast.error("Lỗi khi xóa người dùng");
  //   }
  // };

  // const handleSubmit = async () => {
  //   try {
  //     const values = await form.validateFields();

  //     const formData = new FormData();
  //     formData.append("fullName", values.fullName);
  //     formData.append("email", values.email);
  //     formData.append("phone", values.phone);
  //     formData.append("role", values.role);

  //     // Nếu có file ảnh, thêm file vào FormData
  //     if (fileList.length > 0) {
  //       const file = fileList[0].originFileObj; // Lấy file thực tế
  //       formData.append("avatar", file); // Key phải là "avatar"
  //     } else if (editingUser?.avatar) {
  //       // Nếu không có file mới, gửi URL avatar cũ
  //       formData.append("avatar", editingUser.avatar);
  //     }

  //     if (!editingUser) {
  //       formData.append("password", values.password);
  //       await createUser(formData);
  //       toast.success("Tạo người dùng thành công");
  //     } else {
  //       await updateUser(editingUser.id.toString(), formData);
  //       toast.success("Cập nhật người dùng thành công");
  //     }

  //     setIsModalOpen(false);
  //     fetchUsers();
  //   } catch (error: any) {
  //     if (error.response?.status === 409) {
  //       const errorMessage = error.response.data.message;

  //       if (
  //         errorMessage.includes("Email") ||
  //         errorMessage.includes("số điện thoại")
  //       ) {
  //         form.setFields([
  //           {
  //             name: "phone",
  //             errors: ["Email hoặc số điện thoại đã tồn tại!"],
  //           },
  //         ]);
  //       }
  //     } else {
  //       toast.error("Đã xảy ra lỗi, vui lòng thử lại");
  //     }
  //   }
  // };

  const columns: ColumnsType<User> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tài khoản",
      dataIndex: "username",
      key: "username",
      width: "15%",
    },
    {
      title: "Vai Trò",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Hành động",
      key: "actions",
      width: "15%",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
          >
            Sửa
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            // onClick={() => handleDeleteUser(record.id)}
          >
            Xoá
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="mb-6">
        <Title level={3}>Quản lý người dùng</Title>
        <Text type="secondary">Danh sách người dùng</Text>
        <Button type="primary" className="float-right" onClick={handleAddUser}>
          <PlusCircleFilled style={{ marginRight: 8 }} />
          Thêm người dùng
        </Button>
      </div>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={users}
        pagination={{ pageSize: 10 }}
        bordered
      />

      <Modal
        title={editingUser ? "Sửa người dùng" : "Thêm người dùng"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        // onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Tài khoản"
            rules={[
              { required: true, message: "Tài khoản không được để trống" },
            ]}
          >
            <Input placeholder="Nhập tài khoản của người dùng" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
          >
            <Select placeholder="Chọn vai trò">
              <Option value="customer">Admin</Option>
              <Option value="admin">Bệnh nhân</Option>
              <Option value="seller">Bác sĩ</Option>
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
                name="password"
                label="Nhập lại mật khẩu"
                rules={[
                  { required: true, message: "Mật khẩu không được để trống" },
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
                ]}
              >
                <Input.Password placeholder="Nhập lại mật khẩu" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
}
