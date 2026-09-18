"use client";
import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { SlCalender } from "react-icons/sl";
import { BaseDatePickerProps } from "@/types/props";

export default function BaseDatePicker({
  id,
  name,
  mode = "single",
  className,
  defaultDate,
  placeholder,
  onChange,
  value,
  onBlur,
  size = "md",
}: BaseDatePickerProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const fp = flatpickr(inputRef.current, {
      mode,
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      defaultDate,
      onChange: (selectedDates) => {
        const formatDate = (d: Date) => {
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };

        const val =
          mode === "single"
            ? (selectedDates[0] ? formatDate(selectedDates[0]) : "")
            : selectedDates.map(formatDate);

        onChange?.(val);
      },
    });

    return () => {
      if (!Array.isArray(fp)) fp.destroy();
    };
  }, [mode, defaultDate, onChange]);

  const sizeClasses: Record<string, string> = {
    xxs: "h-6 text-[10px] px-2 py-0.5",   // nhỏ hơn cả antd small
    xs: "h-7 text-xs px-2 py-1",          // hơi nhỏ, gần small
    sm: "h-8 text-sm px-3 py-1.5",        // ~ 32px, khớp middle
    md: "h-10 text-sm px-4 py-2",         // ~ 36px, giữa middle và large
    lg: "h-12 text-base px-5 py-3",       // ~ 40px, khớp large
  };

  const sizeIcon: Record<string, number> = {
    xxs: 12,
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        id={id}
        name={name}
        placeholder={placeholder}
        defaultValue={Array.isArray(value) ? value.join(", ") : value ?? ""}
        onBlur={onBlur}
        className={`
          w-full rounded-md border appearance-none shadow-theme-xs placeholder:text-gray-400 
          focus:outline-hidden focus:ring-3
          dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30
          bg-transparent text-gray-800 border-gray-300
          focus:border-brand-300 focus:ring-brand-500/20
          dark:border-gray-700 dark:focus:border-brand-800
          ${sizeClasses[size]} ${className}
        `}
      />
      <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
        <SlCalender size={sizeIcon[size]} />
      </span>
    </div>
  );
}
