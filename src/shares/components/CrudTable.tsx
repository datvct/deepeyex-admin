import { Table, Button, Space, Typography, Tooltip } from "antd";
import { PlusCircleFilled, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import Filter from "./Filter";
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
  const [filterValue, setFilterValue] = useState("");
  // Thêm cột action mặc định
  const enhancedColumns = columns.map((column) => {
    if (column.key === "time") {
      return {
        ...column,
        render: (text: any, record: any) => (
          <div>
            <p className="text-sm">
              <strong>Ngày tạo:</strong> {formatDateTime(record.created_at)}
            </p>
            <p className="text-sm">
              <strong>Cập nhật:</strong> {formatDateTime(record.updated_at)}
            </p>
          </div>
        ),
      };
    }
    return column;
  });

  enhancedColumns.push({
    title: "Hành động",
    key: "actions",
    width: "5%",
    render: (_: any, record: T) => (
      <Space>
        {onEdit && (
          <Button type="link" icon={<EditOutlined />} onClick={() => onEdit(record)}>
            Sửa
          </Button>
        )}
        {onDelete && (
          <Tooltip title={"Xoá"}>
            <Button
              danger
              icon={<DeleteOutlined />}
              type="primary"
              onClick={() => onDelete(record)}
            >
              Xoá
            </Button>
          </Tooltip>
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
            {addButtonText}
          </Button>
        )}
      </div>
      <Filter placeholder="Tìm kiếm..." onFilter={setFilterValue} />

      <Table
        rowKey={rowKey}
        columns={enhancedColumns}
        dataSource={dataSource}
        pagination={{ pageSize: 10 }}
        bordered
        // scroll={{ x: "max-content" }}
      />
    </div>
  );
}
