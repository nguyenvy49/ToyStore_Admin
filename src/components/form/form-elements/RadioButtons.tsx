"use client";
import React, { useEffect } from "react";
import { useFormContext } from "@/context/FormContext";
import Radio from "../input/Radio";
import { RadioGroupProps } from "@/types/props";
import Label from "../Label";

export default function RadioGroup({
  name,
  title,
  options,
  defaultValue,
  onChange,
  className = "",
}: RadioGroupProps) {
  const { values, setValue } = useFormContext();

  // 👇 Gán giá trị mặc định nếu chưa có
  useEffect(() => {
    if (defaultValue && !values[name]) {
      setValue(name, defaultValue);
      if (onChange) onChange(defaultValue);
    }
  }, [defaultValue, name, values, setValue, onChange]);

  const handleRadioChange = (value: string) => {
    setValue(name, value);
    if (onChange) onChange(value);
  };

  return (
    <>
      {title && <Label htmlFor={name}>{title}</Label>}
      <div className={`flex flex-wrap items-center gap-8 ${className}`}>
        {options.map((opt, idx) => (
          <Radio
            key={opt.value}
            id={`${name}-${idx}`}
            name={name}
            value={opt.value}
            checked={values[name] === opt.value}
            onChange={handleRadioChange}
            label={opt.label}
            disabled={opt.disabled}
          />
        ))}
      </div>
    </>
  );
}
