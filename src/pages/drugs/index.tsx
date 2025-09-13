import { Alert, Form, Input, InputNumber, Modal, Spin, Upload } from "antd";
import React, { useEffect, useState } from "react";
import CrudTable from "../../shares/components/CrudTable";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../shares/enums/queryKey";
import z from "zod";
import { PlusOutlined } from "@ant-design/icons";
import { useListDrugsQuery } from "../../modules/drugs/hooks/queries/use-get-drugs.query";
import { Drug } from "../../modules/drugs/types/drug";
import { useDeleteDrugMutation } from "../../modules/drugs/hooks/mutations/use-delete-drug.mutation";
import { useCreateDrugMutation } from "../../modules/drugs/hooks/mutations/use-create-drug.mutation";
import { useUpdateDrugMutation } from "../../modules/drugs/hooks/mutations/use-update-drug.mutation";
import { createDrugSchema } from "../../modules/drugs/schemas/createDrug.schema";

export default function DrugsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useListDrugsQuery();
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [editingDrug, setEditingDrug] = useState<Drug | null>(null);

  // ---- Mutation: Delete
  const deleteDrug = useDeleteDrugMutation({
    onSuccess: (data) => {
      toast.success(data.message || "Xóa thuốc thành công");
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Drug] });
    },
    onError: (error) => {
      toast.error(error.message || "Xóa thuốc thất bại");
    },
  });

  // ---- Mutation: Create
  const createDrug = useCreateDrugMutation({
    onSuccess: (data) => {
      toast.success(data.message || "Thêm thuốc thành công");
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Drug] });
    },
    onError: (error) => {
      toast.error(error.message || "Thêm thuốc thất bại");
    },
  });

  // ---- Mutation: Update
  const updateDrug = useUpdateDrugMutation({
    onSuccess: (data) => {
      toast.success(data.message || "Cập nhật thuốc thành công");
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Drug] });
    },
    onError: (error) => {
      toast.error(error.message || "Cập nhật thuốc thất bại");
    },
  });

  // Load dữ liệu vào state
  useEffect(() => {
    if (data?.data) {
      setDrugs(data.data);
    }
  }, [data]);

  // ---- Thêm mới ----
  const handleAdd = () => {
    setEditingDrug(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // ---- Sửa ----
  const handleEdit = (drug: Drug) => {
    setEditingDrug(drug);
    form.setFieldsValue({
      name: drug.name,
      price: drug.price,
      description: drug.description,
      discount_percent: drug.discount_percent,
      stock_quantity: drug.stock_quantity,
      image: drug.image
        ? [
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              url: drug.image,
            },
          ]
        : [],
    });

    setIsModalOpen(true);
  };

  // ---- Submit form ----
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formattedValues = {
        ...values,
        image: values.image || [],
      };
      const parsed = createDrugSchema.parse(formattedValues);

      if (editingDrug) {
        updateDrug.mutate({
          drug_id: editingDrug.drug_id,
          ...parsed,
        });
      } else {
        createDrug.mutate(parsed);
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

  // ----- Xóa thuốc -----
  const handleDelete = (drug: Drug) => {
    deleteDrug.mutate(drug.drug_id);
  };

  // ---- Cấu hình cột bảng ----
  const drugColumns = [
    {
      title: "ID",
      dataIndex: "drug_id",
      key: "drug_id",
      width: "10%",
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: "10%",
      render: (image: string) =>
        image ? (
          <img
            src={image}
            alt="drug"
            style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 8 }}
          />
        ) : (
          "-"
        ),
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      width: "15%",
      render: (text: string) => (
        <div
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: "15%",
      render: (text: string) =>
        text ? (
          <div
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "#555",
              fontSize: 13,
            }}
          >
            {text}
          </div>
        ) : (
          "-"
        ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: "10%",
      render: (price: number) => (price !== undefined ? `${price.toLocaleString("vi-VN")} đ` : "-"),
    },
    {
      title: "% giảm",
      dataIndex: "discount_percent",
      key: "discount_percent",
      width: "8%",
      render: (discount: number) => (discount !== undefined ? `${discount}%` : "-"),
    },
    {
      title: "SL tồn kho",
      dataIndex: "stock_quantity",
      key: "stock_quantity",
      width: "8%",
    },
    {
      title: "SL đã bán",
      dataIndex: "sold_quantity",
      key: "sold_quantity",
      width: "8%",
    },
    {
      title: "Thời gian",
      dataIndex: "created_at",
      key: "time",
      width: "15%",
    },
  ];
  return (
    <>
      {isError && (
        <Alert
          message="Lỗi tải dữ liệu"
          description="Không thể lấy danh sách thuốc. Vui lòng thử lại sau."
          type="error"
          showIcon
          className="mb-4"
        />
      )}
      <Spin spinning={isLoading}>
        <CrudTable
          title="Quản lý thuốc"
          subtitle="Danh sách thuốc"
          rowKey="drug_id"
          columns={drugColumns}
          dataSource={drugs}
          addButtonText="Thêm thuốc"
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Spin>

      <Modal
        title={editingDrug ? "Sửa thuốc" : "Thêm thuốc"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        centered
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên thuốc"
            rules={[{ required: true, message: "Vui lòng nhập tên thuốc" }]}
          >
            <Input placeholder="Nhập tên thuốc" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Nhập mô tả thuốc" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: "Vui lòng nhập giá thuốc" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="Nhập giá thuốc"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            />
          </Form.Item>

          <Form.Item
            name="discount_percent"
            label="% Giảm giá"
            rules={[{ required: true, message: "Vui lòng nhập phần trăm giảm giá" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              max={100}
              placeholder="Nhập phần trăm giảm giá"
            />
          </Form.Item>

          <Form.Item
            name="stock_quantity"
            label="Số lượng tồn kho"
            rules={[{ required: true, message: "Vui lòng nhập số lượng tồn kho" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} placeholder="Nhập số lượng tồn kho" />
          </Form.Item>

          <Form.Item
            name="image"
            label="Ảnh thuốc"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload listType="picture-card" beforeUpload={() => false} maxCount={1}>
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải Ảnh</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
