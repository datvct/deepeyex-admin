import { Alert, Form, Input, Modal, Spin, Tag, Tooltip, Select } from "antd";
import React, { useEffect, useState } from "react";
import CrudTable from "../../shares/components/CrudTable";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../shares/enums/queryKey";
import { Order } from "../../modules/orders/types/order";
import { useListOrdersQuery } from "../../modules/orders/hooks/queries/use-get-orders.query";
import { useUpdateOrderStatusMutation } from "../../modules/orders/hooks/mutations/use-update-order-status.mutation";
import { OrderStatus, OrderStatusLabel } from "../../modules/orders/enums/order-status";

export default function OrdersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useListOrdersQuery();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // ---- Mutation: Update status ----
  const updateStatusMutation = useUpdateOrderStatusMutation({
    onSuccess: (data) => {
      toast.success(data.message || "Cập nhật trạng thái thành công");
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Order] });
    },
    onError: (error) => {
      toast.error(error.message || "Cập nhật trạng thái thất bại");
    },
  });

  // Load dữ liệu vào state
  useEffect(() => {
    if (data?.data) {
      setOrders(data.data);
    }
  }, [data]);

  // ---- Mở modal cập nhật trạng thái ----
  const handleEditStatus = (order: Order) => {
    setSelectedOrder(order);
    form.setFieldsValue({
      order_id: order.order_id,
      full_name: order.patient.full_name,
      status: order.status,
    });
    setIsModalOpen(true);
  };

  // ---- Xóa đơn (cập nhật trạng thái canceled) ----
  const handleDelete = (order: Order) => {
    updateStatusMutation.mutate({ order_id: order.order_id, status: OrderStatus.CANCELED });
  };

  // ---- Submit form ----
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!selectedOrder) return;
      updateStatusMutation.mutate({ order_id: selectedOrder.order_id, status: values.status });
      setIsModalOpen(false);
      form.resetFields();
      setSelectedOrder(null);
    } catch (err) {
      console.error(err);
    }
  };

  const statusColors: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: "blue",
    [OrderStatus.PAID]: "green",
    [OrderStatus.CANCELED]: "red",
    [OrderStatus.DELIVERED]: "orange",
  };

  // ---- Cấu hình cột bảng ----
  const orderColumns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Thông tin khách hàng",
      dataIndex: "patient",
      key: "patient",
      render: (patient: Order["patient"], record: Order) => (
        <div>
          <p>
            <strong>Tên:</strong> {patient.full_name}
          </p>
          <p>
            <strong>SĐT:</strong> {patient.phone}
          </p>
          <p>
            <strong>Ngày đặt:</strong> {new Date(record.created_at).toLocaleString()}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {patient.address}
          </p>
        </div>
      ),
    },
    {
      title: "Thông tin thuốc",
      dataIndex: "order_items",
      key: "order_items",
      width: "40%",
      render: (items: Order["order_items"]) => (
        <table
          className="border-collapse border border-[#dee2e6] w-full"
          style={{ tableLayout: "fixed" }}
        >
          <thead>
            <tr className="bg-[#0000000D]">
              <th className="p-2 border border-[#dee2e6] w-[100px] text-left">Tên thuốc</th>
              <th className="p-2 border border-[#dee2e6] w-[40px] text-center">Giá</th>
              <th className="p-2 border border-[#dee2e6] w-[40px] text-center">Số lượng</th>
            </tr>
          </thead>
          <tbody>
            {items && items.length > 0 ? (
              items.map((item) => (
                <tr key={item.order_item_id}>
                  <td className="p-2 border border-[#dee2e6] overflow-hidden text-ellipsis whitespace-nowrap">
                    <Tooltip title={item.drug.name} placement="topLeft">
                      <span className="block truncate">{item.drug.name}</span>
                    </Tooltip>
                  </td>
                  <td className="p-2 border border-[#dee2e6] text-center">
                    {item.price.toLocaleString("vi-VN")}đ
                  </td>
                  <td className="p-2 border border-[#dee2e6] text-center">{item.quantity}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-2 border border-[#dee2e6] text-center" colSpan={3}>
                  Không có dịch vụ nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={statusColors[status] || "default"}>{OrderStatusLabel[status]}</Tag>
      ),
    },
  ];

  return (
    <>
      {isError && (
        <Alert
          message="Lỗi tải dữ liệu"
          description="Không thể lấy danh sách đơn đặt thuốc. Vui lòng thử lại sau."
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      <Spin spinning={isLoading}>
        <CrudTable
          title="Đơn đặt thuốc"
          subtitle="Danh sách đơn đặt thuốc"
          rowKey="order_id"
          columns={orderColumns}
          dataSource={orders}
          onEdit={handleEditStatus}
          onDelete={handleDelete}
        />
      </Spin>

      <Modal
        title="Cập nhật trạng thái đơn hàng"
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setSelectedOrder(null);
        }}
        centered
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Mã đơn hàng" name="order_id">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Tên khách hàng" name="full_name">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select placeholder="Chọn trạng thái">
              {Object.entries(OrderStatusLabel).map(([key, label]) => (
                <Select.Option key={key} value={key}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
