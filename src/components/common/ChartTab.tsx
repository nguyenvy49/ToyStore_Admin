"use client";
import React, { useState } from "react";
import { useTableContext } from "@/context/TableContext";

const ChartTab: React.FC = () => {
  const [selected, setSelected] = useState<"month" | "year">("month");
  const { setUrlApi } = useTableContext();

  const handleSelect = (option: "month" | "year") => {
    setSelected(option);
    if (option === "month") {
      setUrlApi("/api/Statistic/monthly");
    } else {
      setUrlApi("/api/Statistic/yearly");
    }
  };

  const getButtonClass = (option: "month" | "year") =>
    selected === option
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      <button
        onClick={() => handleSelect("month")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass("month")}`}
      >
        Tháng
      </button>

      <button
        onClick={() => handleSelect("year")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass("year")}`}
      >
        Năm
      </button>
    </div>
  );
};

export default ChartTab;
