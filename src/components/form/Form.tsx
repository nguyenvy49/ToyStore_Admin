"use client";
import { useFormContext } from "@/context/FormContext";
import { FormProps } from "@/types/props";
import React, { FC } from "react";

const Form: FC<FormProps> = ({ onSubmit, children, className, mode = "json",method="GET"}) => {
  const { values, setSubmitted } = useFormContext();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    if (mode === "multipart") {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (value instanceof FileList) {
          // Nhiều file
          Array.from(value).forEach((file) => formData.append(key, file));
        } else if (value instanceof File) {
          // Một file
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          // ✅ Nếu là mảng (ví dụ ProductIds)
          value.forEach((v) => formData.append(key, v));
        } else if (value !== undefined && value !== null) {
          // Dữ liệu thông thường
          formData.append(key, String(value));
        }
      });

      onSubmit(formData); // 🔥 trả về FormData
    } else {
      onSubmit(values); // 🔥 trả về JSON object
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={className}
      encType={mode === "multipart" ? "multipart/form-data" : undefined}
      method={method}
    >
      {children}
    </form>
  );
};

export default Form;
