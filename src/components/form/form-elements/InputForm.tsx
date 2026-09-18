"use client";
import { useFormContext } from "@/context/FormContext";
import React, { useState } from "react";
import { BaseProps } from "@/types/props";
import Input from "../input/InputField";

export default function InputForm({
  name,
  type = "text",
  label,
  placeholder,
  className = "",
  disabled = false,
  error,
  hint,
}: BaseProps) {
  const {
    values,
    setValue,
    errors,
    setErrors,
    clearError,
    submitted,
  } = useFormContext();

  const [touched, setTouched] = useState(false);

  const fieldErrors = errors.filter((err) => err.name === name);
  const latestError = fieldErrors[fieldErrors.length - 1];
  const showError = submitted || touched;
  const hasError = error ?? (!!latestError && showError);
  const message = hint ?? (showError ? latestError?.message : undefined);

  const handleBlur = () => {
    setTouched(true);
    const currentValue = values[name] ?? "";

    if (!currentValue || currentValue.trim() === "") {
      setErrors((prev) => [
        ...prev,
        { name, message: "Trường này không được để trống" },
      ]);
    } else if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(currentValue)) {
        setErrors((prev) => [
          ...prev,
          { name, message: "Vui lòng nhập địa chỉ email hợp lệ" },
        ]);
      } else clearError(name);
    } else if (type === "phone"){
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(currentValue)) {
        setErrors((prev) => [
          ...prev,
          { name, message: "Vui lòng nhập số điện thoại hợp lệ" },
        ]);
      } else clearError(name);
    } else if (type === "number") {
      if (isNaN(Number(currentValue))) {
        setErrors((prev) => [
          ...prev,
          { name, message: "Vui lòng nhập số hợp lệ" },
        ]);
      } else if (Number(currentValue) < 0) {
        setErrors((prev) => [
          ...prev,
          { name, message: "Giá trị không được âm" },
        ]);
      } else clearError(name);
    } else if (type === "password") {
      if (currentValue.length < 6) {
        setErrors((prev) => [
          ...prev,
          { name, message: "Mật khẩu phải có ít nhất 6 ký tự" },
        ]);
      } else clearError(name);
    } else {
      clearError(name);
    }
  };

  return (
    <Input
      id={name}
      name={name}
      type={type}
      label={label}
      placeholder={placeholder}
      value={values[name] || ""}
      disabled={disabled}
      error={hasError}
      message={message}
      className={className}
      onChange={(val) => setValue(name, val)}
      onBlur={handleBlur}
    />
  );
}
