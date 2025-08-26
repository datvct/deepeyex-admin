import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Typography,
} from "antd";
import { useState } from "react";

const { Option } = Select;
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleFilled,
  UploadOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function DoctorsPage() {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: "ID", dataIndex: "doctor_id", key: "doctor_id" },
    { title: "Tên", dataIndex: "full_name", key: "full_name" },
    { title: "Chuyên khoa", dataIndex: "specialty", key: "specialty" },
    { title: "Bệnh viện", dataIndex: "hospital", key: "hospital" },
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
        <Title level={3}>Quản lý Bác sĩ</Title>
        <Text type="secondary">Danh sách Bác sĩ</Text>
        <Button
          type="primary"
          className="float-right"
          onClick={() => setVisible(true)}
        >
          <PlusCircleFilled style={{ marginRight: 8 }} />
          Thêm Bác sĩ
        </Button>
      </div>
      <Table rowKey="doctor_id" dataSource={[]} columns={columns} />

      <Modal
        title="Thêm / Sửa Bác sĩ"
        open={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="full_name"
            label="Tên bác sĩ"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="specialty"
            label="Chuyên khoa"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Nội khoa">Nội khoa</Option>
              <Option value="Ngoại khoa">Ngoại khoa</Option>
              <Option value="Nhãn khoa">Nhãn khoa</Option>
            </Select>
          </Form.Item>
          <Form.Item name="hospital" label="Bệnh viện">
            <Select>{/* load list hospital từ API */}</Select>
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="SĐT">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
