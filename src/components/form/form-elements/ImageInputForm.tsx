"use client";
import React, { useEffect, useState } from "react";
import { useFormContext } from "@/context/FormContext";
import { FileInputProps } from "@/types/props";
import ImageInput from "../input/ImageInput";

export default function ImageInputForm({
  id,
  name,
  label,
  className = "",
  error,
  hint,
}: FileInputProps) {
  const { values, setValue, errors, clearError, submitted } = useFormContext();
  const [preview, setPreview] = useState<string | null>(null);

  const ctxError = errors.find((err) => err.name === name);
  const showError = submitted || !!ctxError;
  const hasError = error ?? (!!ctxError && showError);
  const message = hint ?? (showError ? ctxError?.message : undefined);

  const handleChange = (file: File | null) => {
    if (file) {
      setPreview(URL.createObjectURL(file));
      setValue(name, file);
    } else {
      setPreview(null);
      setValue(name, null);
    }
    clearError(name);
  };

  // Populate preview khi load form (edit mode)
  useEffect(() => {
    if (values[name]) {
      if (typeof values[name] === "string") {
        setPreview(values[name]);
      } else {
        setPreview(URL.createObjectURL(values[name]));
      }
    }
  }, [values, name]);

  return (
    <ImageInput
      id={id ?? name}
      name={name}
      label={label}
      preview={preview}
      className={className}
      error={hasError}
      message={message}
      onChange={handleChange}
    />
  );
}
