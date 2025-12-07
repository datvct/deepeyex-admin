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
import { useTranslation } from "react-i18next";
import { FilterField } from "../../shares/components/AdvancedFilter";
import dayjs from "dayjs";

export default function OrdersPage() {
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<Record<string, any>>({});

  const { data, isLoading, isError } = useListOrdersQuery({ filters });
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // ---- Mutation: Update status ----
  const updateStatusMutation = useUpdateOrderStatusMutation({
    onSuccess: (data) => {
      toast.success(t("order.messages.update_success"));
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Order] });
    },
    onError: (error) => {
      toast.error(t("order.messages.update_error"));
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
      // full_name: order.patient.full_name,
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

  const handleFilter = (filterValues: Record<string, any>) => {
    setFilters(filterValues);
  };

  const handleResetFilter = () => {
    setFilters({});
  };

  const statusColors: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: "blue",
    [OrderStatus.PAID]: "green",
    [OrderStatus.CANCELED]: "red",
    [OrderStatus.DELIVERED]: "orange",
  };

  // Cấu hình filter fields
  const filterFields: FilterField[] = [
    {
      name: "status",
      label: t("order.columns.status"),
      type: "select",
      placeholder: t("order.filter.statusPlaceholder"),
      options: Object.entries(OrderStatusLabel).map(([key, label]) => ({
        label: t(`order.status.${key}`),
        value: key,
      })),
      width: 200,
    },
    {
      name: "order_date",
      label: t("order.filter.orderDate"),
      type: "date",
      placeholder: t("order.filter.orderDatePlaceholder"),
      width: 200,
    },
  ];

  // ---- Cấu hình cột bảng ----
  const orderColumns = [
    {
      title: t("order.columns.index"),
      dataIndex: "index",
      key: "index",
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: t("order.columns.patient"),
      dataIndex: "patient",
      key: "patient",
      render: (patient: Order["patient"], record: Order) => (
        <div>
          <p>
            <strong>{t("patient.columns.full_name")}:</strong> {patient.full_name}
          </p>
          <p>
            <strong>{t("patient.columns.phone")}:</strong> {patient.phone}
          </p>
          <p>
            <strong>{t("patient.columns.dob")}:</strong>{" "}
            {new Date(record.created_at).toLocaleString()}
          </p>
          <p>
            <strong>{t("patient.columns.address")}:</strong> {patient.address}
          </p>
        </div>
      ),
    },
    {
      title: t("order.columns.order_items"),
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
              <th className="p-2 border border-[#dee2e6] w-[100px] text-left">
                {t("drug.columns.name")}
              </th>
              <th className="p-2 border border-[#dee2e6] w-[40px] text-center">
                {t("drug.columns.price")}
              </th>
              <th className="p-2 border border-[#dee2e6] w-[40px] text-center">
                {t("drug.columns.stock_quantity")}
              </th>
            </tr>
          </thead>
          <tbody>
            {items && items.length > 0 ? (
              items.map((item) => (
                <tr key={item.order_item_id}>
                  <td className="p-2 border border-[#dee2e6] overflow-hidden text-ellipsis whitespace-nowrap">
                    <Tooltip title={item?.item_name} placement="topLeft">
                      <span className="block truncate">{item.item_name}</span>
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
                  {t("order.messages.load_error")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ),
    },
    {
      title: t("order.columns.status"),
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (status: string) => (
        <Tag color={statusColors[status as OrderStatus] || "default"}>
          {t(`order.status.${status}`)}
        </Tag>
      ),
    },
    {
      title: t("order.columns.orderDate"),
      dataIndex: "created_at",
      key: "created_at",
      width: "12%",
      render: (created_at: string) => (
        <div>
          <p>
            {dayjs(created_at).format("HH:mm:ss")} - {dayjs(created_at).format("DD/MM/YYYY")}
          </p>
          {/* <p className="text-gray-500 text-sm">{dayjs(created_at).format("HH:mm:ss")}</p> */}
        </div>
      ),
    },
  ];

  return (
    <>
      {isError && (
        <Alert
          message={t("order.messages.load_error")}
          description={t("order.messages.load_error")}
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      <Spin spinning={isLoading}>
        <CrudTable
          title={t("order.title")}
          subtitle={t("order.subtitle")}
          rowKey="order_id"
          columns={orderColumns}
          dataSource={orders}
          onEdit={handleEditStatus}
          onDelete={handleDelete}
          useAdvancedFilter={true}
          filterFields={filterFields}
          onFilter={handleFilter}
          onResetFilter={handleResetFilter}
        />
      </Spin>

      <Modal
        title={t("order.editModalTitle")}
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
          <Form.Item label={t("order.form.order_id")} name="order_id">
            <Input disabled />
          </Form.Item>
          {/* <Form.Item label={t("order.form.full_name")} name="full_name">
            <Input disabled />
          </Form.Item> */}
          <Form.Item
            label={t("order.form.status")}
            name="status"
            rules={[{ required: true, message: t("order.form.placeholder.status") }]}
          >
            <Select placeholder={t("order.form.placeholder.status")}>
              {Object.entries(OrderStatusLabel).map(([key, label]) => (
                <Select.Option key={key} value={key}>
                  {t(`order.status.${key}`)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
