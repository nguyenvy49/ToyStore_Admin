"use client";
import { useFormContext } from "@/context/FormContext";
import Label from "../Label";
import BaseDatePicker from "../date-picker";
import { DatePickerFormProps } from "@/types/props";


export default function DatePickerForm({
  id,
  name,
  className,
  label,
  placeholder = "Chọn ngày",
  mode = "single",
  required,
  size = "md",
}: DatePickerFormProps) {
  const { values, setValue, errors } = useFormContext();

  // ✅ xử lý cho cả object và array
  const errorMsg = Array.isArray(errors)
    ? errors.find((err) => err.name === name)?.message
    : errors?.[name];

  return (
    <div className="mb-4">
      {label && (
        <Label htmlFor={id} className="block mb-1 font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <BaseDatePicker
        id={id}
        name={name}
        mode={mode}
        className={`${className} ${errorMsg ? "border-red-500" : "border-gray-300"} rounded px-3 py-2`}
        placeholder={placeholder}
        value={values[name]}
        onChange={(val) => setValue(name, val)}
        size={size}
      />
      {errorMsg && (
        <p className="text-red-500 text-sm mt-1">{errorMsg}</p>
      )}
    </div>
  );
}
