"use client";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { formatCurrency } from "@/utils/format";
import { StatisticService } from "@/services/statisticService";
import { FiTrendingUp, FiDollarSign } from "react-icons/fi";

// Dynamically import ReactApexChart to prevent SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlySalesChart() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [rawData, setRawData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchYearlyData = useCallback(async (year: number) => {
    try {
      setLoading(true);
      const res = await StatisticService.statisticYear("/api/Statistic/yearly", year);
      const list = Array.isArray(res) ? res : (res?.result || res?.data || []);
      setRawData(list);
    } catch (error) {
      console.error("Lỗi khi tải thống kê doanh số năm:", error);
      setRawData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchYearlyData(selectedYear);
  }, [selectedYear, fetchYearlyData]);

  // Chuẩn hóa dữ liệu cho đủ 12 tháng
  const { salesData, profitData, totalSales, totalProfit, peakMonth } = useMemo(() => {
    const sales: number[] = [];
    const profit: number[] = [];
    let sumSales = 0;
    let sumProfit = 0;
    let maxSaleVal = -1;
    let bestMonth = 1;

    for (let m = 1; m <= 12; m++) {
      const found = rawData.find((item: any) => (item.month ?? item.Month) === m);
      const saleVal = found ? Number(found.doanhThu ?? found.DoanhThu ?? 0) : 0;
      const profitVal = found ? Number(found.loiNhuan ?? found.LoiNhuan ?? 0) : 0;

      sales.push(saleVal);
      profit.push(profitVal);
      sumSales += saleVal;
      sumProfit += profitVal;

      if (saleVal > maxSaleVal) {
        maxSaleVal = saleVal;
        bestMonth = m;
      }
    }

    return {
      salesData: sales,
      profitData: profit,
      totalSales: sumSales,
      totalProfit: sumProfit,
      peakMonth: sumSales > 0 ? bestMonth : null,
    };
  }, [rawData]);

  const yearOptions = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
  }, [currentYear]);

  const options: ApexOptions = {
    colors: ["#465fff", "#10b981"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 240,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 3,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: true,
        rotate: -45,
        rotateAlways: true,
        style: {
          fontSize: "11px",
          colors: "#6B7280",
        },
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      fontFamily: "Outfit, sans-serif",
      labels: {
        colors: "#6B7280",
      },
      markers: {
        shape: "circle",
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "11px",
          colors: ["#6B7280"],
        },
        formatter: (val: number) => {
          if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)}B`;
          if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
          if (val >= 1_000) return `${(val / 1_000).toFixed(0)}k`;
          return `${val}`;
        },
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
      borderColor: "#f3f4f6",
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number) => (val !== undefined ? formatCurrency(val) : "0 ₫"),
      },
    },
  };

  const series = [
    {
      name: "Doanh thu",
      data: salesData,
    },
    {
      name: "Lợi nhuận",
      data: profitData,
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Doanh số theo tháng (Monthly Sales)
            </h3>
            {loading && (
              <span className="text-xs text-brand-500 animate-pulse">Đang tải...</span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Thống kê doanh thu và lợi nhuận qua các tháng trong năm {selectedYear}
          </p>
        </div>

        {/* Year Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="sales-year-select" className="text-xs text-gray-500 dark:text-gray-400">
            Năm:
          </label>
          <select
            id="sales-year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:border-gray-400 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Metric Highlights */}
      <div className="grid grid-cols-2 gap-3 mb-4 sm:grid-cols-3">
        <div className="rounded-xl bg-gray-50 p-3 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.05]">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <FiDollarSign className="text-brand-500" />
            <span>Tổng doanh thu</span>
          </div>
          <div className="mt-1 text-sm sm:text-base font-bold text-gray-800 dark:text-white">
            {formatCurrency(totalSales)}
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 p-3 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.05]">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <FiTrendingUp className="text-emerald-500" />
            <span>Tổng lợi nhuận</span>
          </div>
          <div className="mt-1 text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(totalProfit)}
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-xl bg-gray-50 p-3 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.05]">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Tháng cao điểm
          </span>
          <div className="mt-1 text-sm sm:text-base font-bold text-purple-600 dark:text-purple-400">
            {peakMonth ? `Tháng ${peakMonth}` : "Chưa có"}
          </div>
        </div>
      </div>

      {/* ApexChart */}
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-3 min-w-[600px] xl:min-w-full pl-1">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={240}
          />
        </div>
      </div>
    </div>
  );
}
