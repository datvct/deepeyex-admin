import React, { useState, useEffect } from "react";
import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

interface FilterProps {
  placeholder?: string;
  onFilter: (value: string) => void;
  debounceMs?: number;
  width?: string | number;
}

export default function Filter({
  placeholder,
  onFilter,
  debounceMs = 300,
  width = 500,
}: FilterProps) {
  const { t } = useTranslation(); // i18n hook
  const [value, setValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onFilter(value.trim());
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [value, debounceMs, onFilter]);

  const handleSearch = (v?: string) => {
    onFilter((v ?? value).trim());
  };

  return (
    <div className="mb-4 flex justify-start">
      <div style={{ width }}>
        <Input.Search
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onSearch={handleSearch}
          allowClear
          placeholder={placeholder || t("search.placeholder")}
          enterButton={
            <Button type="primary" icon={<SearchOutlined />}>
              {t("search.button")}
            </Button>
          }
          className="rounded-lg border border-gray-200 focus:border-blue-500 focus:shadow-md transition-all duration-300"
        />
      </div>
    </div>
  );
}
