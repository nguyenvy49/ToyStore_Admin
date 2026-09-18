"use client";
import React from "react";

interface MetricItemProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  children?: React.ReactNode; // dùng cho BaseDatePicker/BaseSelect nếu cần
}

const MetricItem: React.FC<MetricItemProps> = ({ icon, title, value, children }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      {/* Icon hoặc children filter */}
      {children ? (
        <div className="mb-4">{children}</div>
      ) : (
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          {icon}
        </div>
      )}

      {/* Title + Value */}
      <div className="mt-5">
        <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
          {value}
        </h4>
      </div>
    </div>
  );
};

export default MetricItem;
