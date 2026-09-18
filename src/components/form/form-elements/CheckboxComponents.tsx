"use client";
import React from "react";
import { useFormContext } from "@/context/FormContext";
import Checkbox from "../input/Checkbox";
import { CheckboxGroupProps } from "@/types/props";
import Label from "../Label";

export default function CheckboxGroup({ name, title, options }: CheckboxGroupProps) {
  const { values, setValue, errors } = useFormContext();

  // Nếu chưa có thì mặc định mảng rỗng
  const selectedValues: any[] = Array.isArray(values[name]) ? values[name] : [];

  // tìm error của field này
  const error = errors.find((err) => err.name === name);

  const handleCheckboxChange = (checked: boolean, value: any) => {
    let newValues: any[];
    if (checked) {
      newValues = [...selectedValues, value];
    } else {
      newValues = selectedValues.filter((v) => v !== value);
    }
    setValue(name, newValues);
  };

  return (
    <div className="flex flex-col gap-1">
      {title && <Label htmlFor={name}>{title}</Label>}
      <div className="flex flex-wrap items-center gap-8">
        {options.map((opt, idx) => (
          <Checkbox
            key={opt.value}
            id={`${name}-${idx}`}
            name={name}
            value={opt.value}
            checked={selectedValues.includes(opt.value)}
            onChange={(checked) => handleCheckboxChange(checked, opt.value)}
            label={opt.label}
            disabled={opt.disabled}
          />
        ))}
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error.message}</p>
      )}
    </div>
  );
}
