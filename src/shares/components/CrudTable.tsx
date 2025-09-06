import { Table, Button, Space, Typography } from "antd";
import {
  PlusCircleFilled,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import React from "react";

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
}

export default function CrudTable<T>({
  title,
  subtitle,
  dataSource,
  columns,
  rowKey,
  addButtonText = "Thêm mới",
  onAdd,
  onEdit,
  onDelete,
}: CrudTableProps<T>) {
  // Thêm cột action mặc định
  const enhancedColumns = [
    ...columns,
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: T) => (
        <Space>
          {onEdit && (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            >
              Sửa
            </Button>
          )}
          {onDelete && (
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record)}
            >
              Xoá
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Title level={3}>{title}</Title>
          {subtitle && <Text type="secondary">{subtitle}</Text>}
        </div>
        {onAdd && (
          <Button type="primary" onClick={onAdd}>
            <PlusCircleFilled style={{ marginRight: 8 }} />
            {addButtonText}
          </Button>
        )}
      </div>

      <Table
        rowKey={rowKey}
        columns={enhancedColumns}
        dataSource={dataSource}
        pagination={{ pageSize: 10 }}
        bordered
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}
