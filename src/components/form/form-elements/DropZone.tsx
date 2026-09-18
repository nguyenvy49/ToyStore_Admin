"use client";
import React, { useEffect, useState } from "react";
import { useFormContext } from "@/context/FormContext";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { DropzoneImageInputProps } from "@/types/props";

const DropzoneImageInput: React.FC<DropzoneImageInputProps> = ({
  name,
  multiple = false,
  className = "",
  error,
  hint,
}) => {
  const { values, setValue, errors, clearError, submitted } = useFormContext();
  const ctxError = errors.find((err) => err.name === name);
  const showError = submitted || !!ctxError;
  const hasError = error ?? (!!ctxError && showError);
  const message = hint ?? (showError ? ctxError?.message : undefined);

  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    if (multiple) {
      const currentFiles = Array.isArray(values[name]) ? [...values[name]] : [];
      const newFiles = [...currentFiles, ...acceptedFiles];
      setValue(name, newFiles);
      setPreviews(newFiles.map((f: any) => URL.createObjectURL(f)));
    } else {
      setValue(name, acceptedFiles[0]);
      setPreviews([URL.createObjectURL(acceptedFiles[0])]);
    }
    clearError(name);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
      "image/svg+xml": [],
    },
    multiple,
  });

  const handleRemove = (index: number) => {
    if (!multiple) return;
    const currentFiles = Array.isArray(values[name]) ? [...values[name]] : [];
    currentFiles.splice(index, 1);
    setValue(name, currentFiles.length > 0 ? currentFiles : null);

    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  // Populate preview từ giá trị hiện có
  useEffect(() => {
    if (multiple) {
      if (Array.isArray(values[name])) {
        const urls = values[name].map((v: any) =>
          typeof v === "string" ? v : URL.createObjectURL(v)
        );
        setPreviews(urls);
      }
    } else {
      if (values[name]) {
        if (typeof values[name] === "string") {
          setPreviews([values[name]]);
        } else {
          setPreviews([URL.createObjectURL(values[name])]);
        }
      }
    }
  }, [values, name, multiple]);

  return (
    <div className={`flex flex-col ${className}`}>
      <div
        {...getRootProps()}
        className={`transition border border-dashed rounded-xl p-3 cursor-pointer ${isDragActive
            ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
            : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
          }`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
            {/* Icon */}
            <svg
              width="29"
              height="28"
              viewBox="0 0 29 28"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-current"
            >
              <path d="M14.5 3.91699 ... (giữ nguyên path icon) " />
            </svg>
          </div>
          <h4 className="mb-2 font-semibold text-gray-800 dark:text-white/90">
            {isDragActive ? "Drop Files Here" : "Drag & Drop Files Here"}
          </h4>
          <span className="text-center text-sm text-gray-700 dark:text-gray-400 mb-2">
            Chọn ảnh hoặc kéo thả vào đây
          </span>
          <span className="font-medium underline text-brand-500">Browse File</span>
        </div>
        {previews.length > 0 && (
          <div className={`mt-2 grid ${multiple ? "grid-cols-3 gap-0" : ""}`}>
            {previews.map((src, idx) => (
              <div key={idx} className="relative w-[350px] h-[200px] rounded-lg border overflow-hidden">
                <Image
                  src={src}
                  alt={`Preview ${idx + 1}`}
                  className="object-contain rounded-lg border"
                  width={350}
                  height={200}
                  unoptimized
                />
                {multiple && (
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>



      {message && (
        <p className={`mt-1 text-sm ${hasError ? "text-red-500" : "text-gray-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default DropzoneImageInput;
