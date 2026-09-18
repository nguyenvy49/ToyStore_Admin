import { InputProps } from "@/types/props";
import React from "react";

const Input: React.FC<InputProps> = ({
  id,
  name,
  type = "text",
  value,
  placeholder,
  label,
  disabled = false,
  error = false,
  message,
  className = "",
  onChange,
  onBlur,
}) => {
  return (
    <div className={`flex flex-col mt-4 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        className={`rounded-md border px-3 py-2 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {message && (
        <p
          className={`mt-1 text-sm ${
            error ? "text-red-500" : "text-gray-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Input;
