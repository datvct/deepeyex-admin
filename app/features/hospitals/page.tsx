import { Form, Input, Modal } from "antd";
import { useState } from "react";
import CrudTable from "~/shared/components/CrudTable";

export default function HospitalsPage() {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const hospitals = [
    {
      hospital_id: 1,
      name: "BV A",
      address: "HN",
      phone: "0123",
      email: "a@gmail.com",
    },
  ];

  const hospitalColumns = [
    { title: "ID", dataIndex: "hospital_id", key: "hospital_id", width: 80 },
    { title: "Tên", dataIndex: "name", key: "name", width: 200 },
    { title: "Địa chỉ", dataIndex: "address", key: "address", width: 250 },
    { title: "SĐT", dataIndex: "phone", key: "phone", width: 150 },
    { title: "Email", dataIndex: "email", key: "email", width: 200 },
  ];

  return (
    <>
      <CrudTable
        title="Quản lý Bệnh viện"
        subtitle="Danh sách bệnh viện"
        rowKey="hospital_id"
        columns={hospitalColumns}
        dataSource={hospitals.map((hospital) => ({
          ...hospital,
          id: hospital.hospital_id,
        }))}
        addButtonText="Thêm bệnh viện"
        onAdd={() => setVisible(true)}
        onEdit={(record) => console.log("Edit hospital", record)}
        onDelete={(record) => console.log("Delete hospital", record)}
      />

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
            <Input placeholder="Nhập tên bệnh viện" />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input placeholder="Nhập địa chỉ bệnh viện" />
          </Form.Item>
          <Form.Item name="phone" label="SĐT">
            <Input placeholder="Nhập số điện thoại của bệnh viện" />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input placeholder="Nhập gmail của bệnh viện" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
