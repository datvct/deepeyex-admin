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
import { useTranslation } from "react-i18next";

export default function DrugsPage() {
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useListDrugsQuery();
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [editingDrug, setEditingDrug] = useState<Drug | null>(null);

  // ---- Mutation: Delete
  const deleteDrug = useDeleteDrugMutation({
    onSuccess: (data) => {
      toast.success(t("drug.deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Drug] });
    },
    onError: (error) => {
      toast.error(t("drug.deleteError"));
    },
  });

  // ---- Mutation: Create
  const createDrug = useCreateDrugMutation({
    onSuccess: (data) => {
      toast.success(t("drug.createSuccess"));
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Drug] });
    },
    onError: (error) => {
      toast.error(t("drug.createError"));
    },
  });

  // ---- Mutation: Update
  const updateDrug = useUpdateDrugMutation({
    onSuccess: (data) => {
      toast.success(t("drug.updateSuccess"));
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Drug] });
    },
    onError: (error) => {
      toast.error(t("drug.updateError"));
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
    { title: t("drug.columns.id"), dataIndex: "drug_id", key: "drug_id", width: "10%" },
    {
      title: t("drug.columns.image"),
      dataIndex: "image",
      key: "image",
      width: "10%",
      render: (image: string) =>
        image ? (
          <img src={image} alt="drug" style={{ width: 50, height: 50, borderRadius: 8 }} />
        ) : (
          "-"
        ),
    },
    { title: t("drug.columns.name"), dataIndex: "name", key: "name", width: "15%" },
    {
      title: t("drug.columns.description"),
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
      title: t("drug.columns.price"),
      dataIndex: "price",
      key: "price",
      width: "10%",
      render: (price: number) => (price !== undefined ? `${price.toLocaleString("vi-VN")} đ` : "-"),
    },
    {
      title: t("drug.columns.discount"),
      dataIndex: "discount_percent",
      key: "discount_percent",
      width: "8%",
      render: (discount: number) => (discount !== undefined ? `${discount}%` : "-"),
    },
    {
      title: t("drug.columns.stock"),
      dataIndex: "stock_quantity",
      key: "stock_quantity",
      width: "8%",
    },
    {
      title: t("drug.columns.sold"),
      dataIndex: "sold_quantity",
      key: "sold_quantity",
      width: "8%",
    },
    { title: t("drug.columns.time"), dataIndex: "created_at", key: "time", width: "15%" },
  ];

  return (
    <>
      {isError && (
        <Alert
          message={t("drug.error.loadTitle")}
          description={t("drug.error.loadDescription")}
          type="error"
          showIcon
          className="mb-4"
        />
      )}
      <Spin spinning={isLoading}>
        <CrudTable
          title={t("drug.title")}
          subtitle={t("drug.subtitle")}
          rowKey="drug_id"
          columns={drugColumns}
          dataSource={drugs}
          addButtonText={t("drug.add")}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Spin>

      <Modal
        title={editingDrug ? t("drug.edit") : t("drug.add")}
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
            label={t("drug.form.name")}
            rules={[{ required: true, message: t("drug.form.validation.name") }]}
          >
            <Input placeholder={t("drug.form.placeholder.name")} />
          </Form.Item>

          <Form.Item name="description" label={t("drug.form.description")}>
            <Input.TextArea rows={3} placeholder={t("drug.form.placeholder.description")} />
          </Form.Item>

          <Form.Item
            name="price"
            label={t("drug.form.price")}
            rules={[{ required: true, message: t("drug.form.validation.price") }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder={t("drug.form.placeholder.price")}
            />
          </Form.Item>

          <Form.Item
            name="discount_percent"
            label={t("drug.form.discount")}
            rules={[{ required: true, message: t("drug.form.validation.discount") }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              max={100}
              placeholder={t("drug.form.placeholder.discount")}
            />
          </Form.Item>

          <Form.Item
            name="stock_quantity"
            label={t("drug.form.stock")}
            rules={[{ required: true, message: t("drug.form.validation.stock") }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder={t("drug.form.placeholder.stock")}
            />
          </Form.Item>

          <Form.Item name="image" label={t("drug.form.image")}>
            <Upload listType="picture-card" beforeUpload={() => false} maxCount={1}>
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>{t("drug.upload")}</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
