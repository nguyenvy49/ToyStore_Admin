"use client";
import React, { useState } from "react";
import { useFormContext } from "@/context/FormContext";
import { SelectFieldProps } from "@/types/props";
import BaseSelect from "../select/select";

export default function SelectForm({
  name,
  label,
  size = "md",
  options,
  mode,
  placeholder,
  disabled = false,
  className = "",
  hint,
  required = true,
  isModel = false,
}: SelectFieldProps) {
  const { values, setValue, errors, setErrors, clearError, submitted } =
    useFormContext();

  const [touched, setTouched] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const fieldErrors = errors.filter((err) => err.name === name);
  const latestError = fieldErrors[fieldErrors.length - 1];
  const showError = submitted || touched;
  const hasError = !!latestError && showError;
  const message = hint ?? (showError ? latestError?.message : undefined);

  const currentValue = values[name] ?? (mode === "multiple" ? [] : undefined);

  const handleChange = (val: string | number | (string | number)[]) => {
    setValue(name, val);

    // ✅ chỉ validate nếu required = true
    if (required && touched) {
      if (!val || (Array.isArray(val) && val.length === 0)) {
        setErrors((prev) => [
          ...prev.filter((e) => e.name !== name),
          { name, message: "Vui lòng chọn ít nhất một giá trị" },
        ]);
      } else {
        clearError(name);
      }
    }
  };

  const handleBlur = () => {
    setTouched(true);

    // ✅ chỉ validate nếu required = true
    if (required) {
      if (!currentValue || (Array.isArray(currentValue) && currentValue.length === 0)) {
        setErrors((prev) => [
          ...prev.filter((e) => e.name !== name),
          { name, message: "Vui lòng chọn ít nhất một giá trị" },
        ]);
      } else {
        clearError(name);
      }
    }
  };

  return (
    <BaseSelect
      id={name}
      size={size}
      name={name}
      label={label}
      options={options}
      mode={mode}
      placeholder={placeholder}
      disabled={disabled}
      value={currentValue}
      error={hasError}
      message={message}
      onChange={handleChange}
      onBlur={handleBlur}
      onSearch={setSearchValue}
      searchValue={searchValue}
      className={className}
      isModel={isModel}
    />
  );
}
