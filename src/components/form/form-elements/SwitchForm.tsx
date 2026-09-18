"use client";
import React, { useEffect } from "react";
import { useFormContext } from "@/context/FormContext";
import { SwitchFormProps } from "@/types/props";
import Switch from "../switch/Switch";
import Label from "../Label";

const SwitchForm: React.FC<SwitchFormProps> = ({
  name,
  label,
  size = "lg",
  onLabel = "",
  offLabel = "",
  defaultChecked = false,
  disabled,
  color = "blue",
  className = "",
}) => {
  const { values, setValue } = useFormContext();
  useEffect(() => {
    // nếu form chưa có giá trị cho field này, gán defaultChecked
    if (values[name] === undefined) {
      setValue(name, defaultChecked);
    }
  }, [name, values, setValue, defaultChecked]);

  // nếu chưa có trong values → lấy defaultChecked
  const isChecked = values[name] ?? defaultChecked;

  const handleChange = (checked: boolean) => {
    setValue(name, checked);
  };

  return (
    <>
      <div className={`flex flex-col mb-4 mt-4 ${className}`}>
        {label && (<Label htmlFor={name}>{label}</Label>)}
        <Switch
          id={name}
          size={size}
          name={name} // or provide a suitable label prop here
          checked={isChecked}
          disabled={disabled}
          onChange={handleChange}
          color={color}
          onLabel={onLabel}
          offLabel={offLabel}
          className={className}
        />
      </div>
    </>
  );
};

export default SwitchForm;
