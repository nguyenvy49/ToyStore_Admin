"use client";
import React, { FC } from "react";
import Image from "next/image";
import Label from "../Label";

interface BaseFileInputProps {
  id: string;
  name: string;
  label?: string;
  className?: string;
  preview?: string | null;
  error?: boolean;
  message?: string;
  onChange: (file: File | null) => void;
}

const ImageInput: FC<BaseFileInputProps> = ({
  id,
  name,
  label,
  className = "",
  preview,
  error = false,
  message,
  onChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onChange(file);
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {label && <Label htmlFor={id}>{label}</Label>}

      <input
        id={id}
        name={name}
        accept="image/*"
        type="file"
        className={`h-11 w-full overflow-hidden rounded-lg border bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors
          file:mr-5 file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700
          placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:ring-2 focus:ring-brand-300
          ${error ? "border-red-500" : "border-gray-300"}`}
        onChange={handleChange}
      />

      {preview && (
        <div className="mt-2">
          <Image
            src={preview}
            alt="Preview"
            className="max-h-60 w-full rounded-lg border object-contain"
            width={200}
            height={200}
            unoptimized
          />
        </div>
      )}

      {message && (
        <p className={`mt-1 text-sm ${error ? "text-red-500" : "text-gray-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ImageInput;
