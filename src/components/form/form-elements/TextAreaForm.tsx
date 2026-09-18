"use client";
import { useFormContext } from "@/context/FormContext";
import React from "react";
import { TextareaProps } from "@/types/props";
import TextArea from "../input/TextArea";

export default function TextAreaForm({
  name,
  label,
  placeholder,
  className = "",
  disabled = false,
  error,
  hint,
}: TextareaProps) {
  const { values, setValue, errors } = useFormContext();

  const ctxError = errors.find((err) => err.name === name);
  const hasError = error ?? !!ctxError;
  const message = hint ?? ctxError?.message;

  return (
    <TextArea
      name={name}
      label={label}
      value={values[name] || ""}
      placeholder={placeholder}
      disabled={disabled}
      error={hasError}
      message={message}
      className={className}
      onChange={(val) => setValue(name, val)}
    />
  );
}
