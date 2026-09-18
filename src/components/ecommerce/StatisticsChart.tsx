"use client";
import React, { useCallback, useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import ChartTab from "../common/ChartTab";
import dynamic from "next/dynamic";
import { useTableContext } from "@/context/TableContext";
import BaseSelect from "../form/select/select";
import { StatisticService } from "@/services/statisticService";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function StatisticsChart() {
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const { urlApi } = useTableContext();
  const [chartData, setChartData] = useState<any[]>([]);

  const getDataStatisticMonth = useCallback(async (urlApi: string) => {
    try {
      const res = await StatisticService.statisticMonth(urlApi, month, year);
      if (res) setChartData(res);
    } catch (error) {
      console.log(error);
    }
  }, [month, year]);

  const getDataStatisticYear = useCallback(async (urlApi: string) => {
    try {
      const res = await StatisticService.statisticYear(urlApi, year);
      if (res) setChartData(res);
    } catch (error) {
      console.log(error);
    }
  }, [year]);

  useEffect(() => {
    if (urlApi) {
      if (urlApi.includes("monthly")) {
        getDataStatisticMonth(urlApi);
      } else {
        getDataStatisticYear(urlApi);
      }
    }
  }, [getDataStatisticMonth, getDataStatisticYear, urlApi]);

  // 👇 tạo categories linh hoạt
  const categories = urlApi.includes("monthly")
    ? chartData.map(item => `Ngày ${item.day}`)
    : chartData.map(item => `Tháng ${item.month}`);

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#62afff", "#f08362", "#48cc90"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: { show: false },
    },
    stroke: { curve: "straight", width: [2, 2, 2] },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.55, opacityTo: 0 },
    },
    markers: { size: 0, strokeColors: "#fff", strokeWidth: 2, hover: { size: 6 } },
    grid: { xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } } },
    dataLabels: { enabled: false },
    tooltip: { enabled: true },
    xaxis: {
      type: "category",
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px", colors: ["#6B7280"] },
      },
    },
  };

  const series = [
    { name: "Doanh thu", data: chartData.map(item => item.doanhThu) },
    { name: "Chi phí nhập", data: chartData.map(item => item.chiPhiNhap) },
    { name: "Lợi nhuận", data: chartData.map(item => item.loiNhuan) },
  ];

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    label: `Tháng ${i + 1}`,
    value: i + 1,
  }));

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    label: `${currentYear - i}`,
    value: currentYear - i,
  }));

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-6 mb-6 sm:flex-row sm:justify-between sm:items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Thống kê
        </h3>

        <div className="flex gap-3 items-center">
          <BaseSelect
            name="month"
            placeholder="Chọn tháng"
            options={monthOptions}
            value={month}
            onChange={(val) => setMonth(val as number)}
          />
          <BaseSelect
            name="year"
            placeholder="Chọn năm"
            options={yearOptions}
            value={year}
            onChange={(val) => setYear(val as number)}
          />
        </div>

        <div className="flex items-start gap-3 sm:justify-end">
          <ChartTab />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <ReactApexChart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}
