"use client";
import React from "react";
import { Select, Button } from "antd";
import Label from "../Label";
import { BaseSelectProps } from "@/types/props";

const { Option } = Select;

const BaseSelect: React.FC<BaseSelectProps> = ({
  id,
  name,
  label,
  options,
  value,
  mode,
  placeholder,
  disabled,
  className = "",
  error = false,
  message,
  onChange,
  onBlur,
  onSearch,
  searchValue = "",
  size = "md", // default
  isModel = false, // ✅ nếu true -> trong modal
}) => {
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  const sizeMap: Record<string, { antSize: "small" | "middle" | "large"; cls: string }> = {
    xxs: { antSize: "small", cls: "h-6 text-xs px-2 py-0.5" },
    xs: { antSize: "small", cls: "h-8 text-xs px-2 py-1" },
    sm: { antSize: "middle", cls: "h-9 text-sm px-3 py-1.5" },
    md: { antSize: "middle", cls: "h-11 text-sm px-4 py-2.5" },
    lg: { antSize: "large", cls: "h-13 text-base px-5 py-3" },
  };

  const { antSize, cls } = sizeMap[size];

  return (
    <div className={`flex flex-col mt-4 mb-4 ${className}`}>
      {label && <Label htmlFor={id ?? name}>{label}</Label>}

      <Select
        allowClear
        mode={mode}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        showSearch
        placeholder={placeholder}
        disabled={disabled}
        onSearch={onSearch}
        filterOption={false}
        className={`rounded-md border ${cls} ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        size={antSize}
        // 👇 chỉ thêm khi isModel = true
        {...(isModel
          ? {
              styles: { popup: { root: { zIndex: 99999 } } },
              getPopupContainer: () => document.body,
            }
          : {})}
        popupRender={(menu) =>
          mode === "multiple" && options.length > 0 ? (
            <div className="rounded-md shadow-lg">
              <div className="px-2 py-1 border-b mb-1">
                <Button
                  type="link"
                  size="small"
                  onClick={() => onChange(options.map((o) => o.value))}
                >
                  Chọn tất cả
                </Button>
              </div>
              {menu}
            </div>
          ) : (
            menu
          )
        }
      >
        {filteredOptions.map((opt) => (
          <Option key={opt.value} value={opt.value}>
            {opt.label}
          </Option>
        ))}
      </Select>

      {message && (
        <p className={`mt-1 text-sm ${error ? "text-red-500" : "text-gray-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default BaseSelect;
