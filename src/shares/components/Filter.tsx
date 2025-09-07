import React, { useRef, useState } from "react";
import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface FilterProps {
  placeholder?: string;
  onFilter: (value: string) => void;
  debounceMs?: number;
  width?: string | number;
}

export default function Filter({
  placeholder = "Tìm kiếm...",
  onFilter,
  debounceMs = 300,
  width = 500,
}: FilterProps) {
  const [value, setValue] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Gọi khi gõ (debounce)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setValue(v);

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      onFilter(v);
    }, debounceMs);
  };

  const handleSearch = (v?: string) => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    onFilter(typeof v === "string" ? v : value);
  };

  return (
    <div className="mb-4 flex justify-start">
      <div style={{ width }}>
        <Input.Search
          value={value}
          onChange={handleChange}
          onSearch={handleSearch}
          allowClear
          placeholder={placeholder}
          enterButton={
            <Button type="primary" icon={<SearchOutlined />}>
              Tìm
            </Button>
          }
          className="rounded-lg border border-gray-200 focus:border-blue-500 focus:shadow-md transition-all duration-300"
        />
      </div>
    </div>
  );
}
