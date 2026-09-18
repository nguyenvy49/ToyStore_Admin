"use client";
import { FormError } from "@/types/context";
import React, { createContext, useContext, useState } from "react";

interface FormContextType {
  values: Record<string, any>;               // 🔥 lưu dữ liệu form
  setValue: (name: string, value: any) => void;
  errors: FormError[];
  setErrors: React.Dispatch<React.SetStateAction<FormError[]>>;
  clearError: (name: string) => void;
  submitted: boolean;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<FormError[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const setValue = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // xóa lỗi nếu đã có
    setErrors((prev) => prev.filter((err) => err.name !== name));
  };

  const clearError = (name: string) => {
    setErrors((prev) => prev.filter((err) => err.name !== name));
  };

  return (
    <FormContext.Provider
      value={{ values, setValue, errors, setErrors, clearError, submitted, setSubmitted }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useFormContext phải được dùng bên trong FormProvider");
  return ctx;
};
