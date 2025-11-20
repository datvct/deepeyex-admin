import React, { useState } from "react";
import { Button, Form, Input, Select, DatePicker, InputNumber, Card, Space, Row, Col } from "antd";
import { SearchOutlined, ClearOutlined, FilterOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import type { RangePickerProps } from "antd/es/date-picker";

const { RangePicker } = DatePicker;

export type FilterFieldType =
  | "text"
  | "select"
  | "number"
  | "date-range"
  | "date"
  | "month"
  | "select-multiple";

export interface FilterField {
  name: string;
  label: string;
  type: FilterFieldType;
  placeholder?: string;
  options?: Array<{ label: string; value: string | number }>;
  min?: number;
  max?: number;
  allowClear?: boolean;
  span?: number; // Số cột chiếm (1-24) theo grid Ant Design
  width?: string | number; // Custom width cho field
}

export interface AdvancedFilterProps {
  fields: FilterField[];
  onFilter: (values: Record<string, any>) => void;
  onReset?: () => void;
  layout?: "horizontal" | "vertical" | "inline";
  submitText?: string;
  resetText?: string;
  className?: string;
}

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
  fields,
  onFilter,
  onReset,
  layout = "inline",
  submitText,
  resetText,
  className = "",
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const defaultSubmitText = submitText || t("advancedFilter.search");
  const defaultResetText = resetText || t("advancedFilter.reset");

  const handleFinish = (values: Record<string, any>) => {
    // Xử lý giá trị trước khi gửi
    const processedValues: Record<string, any> = {};

    Object.keys(values).forEach((key) => {
      const value = values[key];
      const field = fields.find((f) => f.name === key);

      if (!value) return;

      // Xử lý date-range
      if (field?.type === "date-range" && Array.isArray(value)) {
        processedValues[`${key}_from`] = value[0]?.format("YYYY-MM-DD");
        processedValues[`${key}_to`] = value[1]?.format("YYYY-MM-DD");
      }
      // Xử lý date
      else if (field?.type === "date" && value) {
        processedValues[key] = value.format("YYYY-MM-DD");
      }
      // Xử lý month (format: YYYY-MM)
      else if (field?.type === "month" && value) {
        processedValues[key] = value.format("YYYY-MM");
      }
      // Các giá trị khác
      else {
        processedValues[key] = value;
      }
    });

    onFilter(processedValues);
  };

  const handleReset = () => {
    form.resetFields();
    if (onReset) {
      onReset();
    } else {
      onFilter({});
    }
  };

  const renderField = (field: FilterField) => {
    const fieldStyle = field.width ? { width: field.width } : { minWidth: 200 };

    switch (field.type) {
      case "text":
        return (
          <Input
            placeholder={
              field.placeholder || `${t("advancedFilter.enter")} ${field.label.toLowerCase()}`
            }
            allowClear={field.allowClear !== false}
            style={fieldStyle}
          />
        );

      case "select":
        return (
          <Select
            placeholder={
              field.placeholder || `${t("advancedFilter.select")} ${field.label.toLowerCase()}`
            }
            options={field.options}
            allowClear={field.allowClear !== false}
            style={fieldStyle}
          />
        );

      case "select-multiple":
        return (
          <Select
            mode="multiple"
            placeholder={
              field.placeholder || `${t("advancedFilter.select")} ${field.label.toLowerCase()}`
            }
            options={field.options}
            allowClear={field.allowClear !== false}
            style={fieldStyle}
          />
        );

      case "number":
        return (
          <InputNumber
            placeholder={
              field.placeholder || `${t("advancedFilter.enter")} ${field.label.toLowerCase()}`
            }
            min={field.min}
            max={field.max}
            style={fieldStyle}
          />
        );

      case "date":
        return (
          <DatePicker
            placeholder={
              field.placeholder || `${t("advancedFilter.select")} ${field.label.toLowerCase()}`
            }
            format="DD/MM/YYYY"
            style={fieldStyle}
          />
        );

      case "month":
        return (
          <DatePicker
            picker="month"
            placeholder={
              field.placeholder || `${t("advancedFilter.select")} ${field.label.toLowerCase()}`
            }
            format="MM/YYYY"
            style={fieldStyle}
          />
        );

      case "date-range":
        return (
          <RangePicker
            placeholder={[t("advancedFilter.dateRange.from"), t("advancedFilter.dateRange.to")]}
            format="DD/MM/YYYY"
            style={fieldStyle}
          />
        );

      default:
        return <Input placeholder={field.placeholder} style={fieldStyle} />;
    }
  };

  return (
    <div className={`mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200 ${className}`}>
      <Form form={form} layout={layout} onFinish={handleFinish}>
        <div className="flex flex-row flex-wrap items-end gap-4">
          {fields.map((field) => (
            <div key={field.name}>
              <Form.Item name={field.name} label={field.label} className="mb-0">
                {renderField(field)}
              </Form.Item>
            </div>
          ))}
          <Form.Item className="mb-0">
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                {defaultSubmitText}
              </Button>
              <Button onClick={handleReset} icon={<ClearOutlined />}>
                {defaultResetText}
              </Button>
            </Space>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default AdvancedFilter;
