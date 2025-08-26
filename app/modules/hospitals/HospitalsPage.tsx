import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Typography,
  Select,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleFilled,
  UploadOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const { Title, Text } = Typography;

export default function HospitalsPage() {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: "ID", dataIndex: "hospital_id", key: "hospital_id" },
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    { title: "SĐT", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Action",
      key: "action",
      render: () => (
        <Space>
          <Button type="link" icon={<EditOutlined />}>
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
    <div className="p-6">
      <div className="mb-6">
        <Title level={3}>Quản lý Bệnh viện</Title>
        <Text type="secondary">Danh sách bệnh viện</Text>
        <Button
          type="primary"
          className="float-right"
          onClick={() => setVisible(true)}
        >
          <PlusCircleFilled style={{ marginRight: 8 }} />
          Thêm bệnh viện
        </Button>
      </div>

      <Table rowKey="hospital_id" dataSource={[]} columns={columns} />

      <Modal
        title="Thêm / Sửa Bệnh viện"
        open={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên bệnh viện"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="SĐT">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
