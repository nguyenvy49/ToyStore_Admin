"use client";
import { BaseSwitchProps } from "@/types/props";
import React, { useState } from "react";

const Switch: React.FC<BaseSwitchProps> = ({
  id,
  name,
  className,
  checked,
  disabled = false,
  onChange,
  color = "blue",
  onLabel,
  offLabel,
  size = "md", // default size
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    if (disabled) return;
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onChange(newChecked);
  };

  // Kích thước theo size
  const sizeMap: Record<
    string,
    { track: string; knob: string; translate: string; height: string }
  > = {
    xs: { track: "w-10", knob: "w-4 h-4", translate: "translate-x-5", height: "h-5" },
    sm: { track: "w-14", knob: "w-5 h-5", translate: "translate-x-8", height: "h-6" },
    md: { track: "w-18", knob: "w-6 h-6", translate: "translate-x-11", height: "h-7" },
    lg: { track: "w-22", knob: "w-6 h-6", translate: "translate-x-15", height: "h-7" },
    xl: { track: "w-26", knob: "w-7 h-7", translate: "translate-x-18", height: "h-8" },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Màu sắc
  const switchColors =
    color === "blue"
      ? {
          background: isChecked ? "bg-blue-500" : "bg-gray-200 dark:bg-white/10",
          knob: isChecked
            ? `${currentSize.translate} bg-white`
            : "translate-x-0 bg-white",
          text: isChecked ? "text-white" : "text-gray-500",
        }
      : {
          background: isChecked ? "bg-gray-800 dark:bg-white/10" : "bg-gray-200 dark:bg-white/10",
          knob: isChecked
            ? `${currentSize.translate} bg-white`
            : "translate-x-0 bg-white",
          text: isChecked ? "text-white" : "text-gray-500",
        };

  return (
    <label
      htmlFor={id ?? name}
      className="inline-flex cursor-pointer select-none items-center"
      onClick={handleToggle}
    >
      <div
        className={`relative flex items-center justify-center transition duration-200 ease-in-out rounded-full ${currentSize.track} ${currentSize.height} ${switchColors.background} ${className}`}
      >
        {/* Text nằm trên nền */}
        <div
          className={`absolute w-full px-2 text-xs font-medium ${
            isChecked ? "text-left" : "text-right"
          } transition-all duration-200 whitespace-nowrap z-0 ${switchColors.text}`}
        >
          {isChecked ? onLabel : offLabel}
        </div>

        {/* Knob */}
        <div
          className={`absolute left-0.5 top-0.5 rounded-full shadow-theme-sm transform duration-200 ease-in-out z-10 ${currentSize.knob} ${switchColors.knob}`}
        ></div>
      </div>
    </label>
  );
};

export default Switch;
