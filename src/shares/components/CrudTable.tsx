import { Table, Button, Space, Typography, Popconfirm } from "antd";
import { PlusCircleFilled, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Filter from "./Filter";
import AdvancedFilter, { FilterField } from "./AdvancedFilter";
import { formatDateTime } from "../utils/helper";

const { Title, Text } = Typography;

interface CrudTableProps<T> {
  title: string;
  subtitle?: string;
  dataSource: T[];
  columns: any[];
  rowKey: string;
  addButtonText?: string;
  onAdd?: () => void;
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => void;
  // Advanced Filter props
  useAdvancedFilter?: boolean;
  filterFields?: FilterField[];
  onFilter?: (values: Record<string, any>) => void;
  onResetFilter?: () => void;
}

export default function CrudTable<T>({
  title,
  subtitle,
  dataSource,
  columns,
  rowKey,
  addButtonText,
  onAdd,
  onEdit,
  onDelete,
  // Advanced Filter props
  useAdvancedFilter = false,
  filterFields = [],
  onFilter,
  onResetFilter,
}: CrudTableProps<T>) {
  const { t } = useTranslation();
  const [filterValue, setFilterValue] = useState("");

  const enhancedColumns = columns.map((column) => {
    if (column.key === "time") {
      return {
        ...column,
        render: (text: any, record: any) => (
          <div>
            <p className="text-sm">
              <strong>{t("table.createdAt")}:</strong> {formatDateTime(record.created_at)}
            </p>
            <p className="text-sm">
              <strong>{t("table.updatedAt")}:</strong> {formatDateTime(record.updated_at)}
            </p>
          </div>
        ),
      };
    }
    return column;
  });

  // Cột Hành động
  enhancedColumns.push({
    title: t("table.actions"),
    key: "actions",
    width: "5%",
    render: (_: any, record: T) => (
      <Space>
        {onEdit && (
          <Button type="link" icon={<EditOutlined />} onClick={() => onEdit(record)}>
            {t("table.edit")}
          </Button>
        )}
        {onDelete && (
          <Popconfirm
            title={t("table.deleteConfirmTitle")}
            description={t("table.deleteConfirmDescription")}
            onConfirm={() => onDelete(record)}
            okText={t("table.deleteOk")}
            cancelText={t("table.deleteCancel")}
          >
            <Button type="primary" danger size="small" icon={<DeleteOutlined />}>
              {t("table.delete")}
            </Button>
          </Popconfirm>
        )}
      </Space>
    ),
  });

  return (
    <div className="bg-white">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <Title level={3}>{title}</Title>
          {subtitle && <Text type="secondary">{subtitle}</Text>}
        </div>

        {onAdd && (
          <Button type="primary" onClick={onAdd}>
            <PlusCircleFilled style={{ marginRight: 8 }} />
            {addButtonText || t("table.addButton")}
          </Button>
        )}
      </div>

      {/* Hiển thị AdvancedFilter hoặc Filter thông thường */}
      {useAdvancedFilter && filterFields.length > 0 && onFilter ? (
        <AdvancedFilter fields={filterFields} onFilter={onFilter} onReset={onResetFilter} />
      ) : (
        <Filter placeholder={t("table.searchPlaceholder")} onFilter={setFilterValue} />
      )}

      <Table
        rowKey={rowKey}
        columns={enhancedColumns}
        dataSource={dataSource}
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
}
