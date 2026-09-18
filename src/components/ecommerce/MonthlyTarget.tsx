"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import BaseDatePicker from "../form/date-picker";
import { useTableContext } from "@/context/TableContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { StatisticService } from "@/services/statisticService";
import { formatCurrency } from "@/utils/format";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function BusinessResult() {
  const [value, setValue] = useState<any>();
  const { urlApi, setParam } = useTableContext();
  const setParamRef = useRef(setParam);

  const today = new Date();
  const localDate =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");

  const getValue = useCallback(async (url: string) => {
    try {
      const res = await StatisticService.statistic(url);
      if (res) {
        setValue(res);
      }
    } catch (error) {
      console.error("Error fetching statistic:", error);
    }
  }, []);

  const handleChangeDatePicker = (value: string | string[]) => {
    setParam("day", new Date(value as string).toISOString());
  };

  useEffect(() => {
    if (localDate) {
      setParamRef.current("day", new Date(localDate as string).toISOString());
    }
  }, [localDate]);

  useEffect(() => {
    if (urlApi) {
      getValue(urlApi);
    }
  }, [urlApi, getValue]);

  // Tính toán dữ liệu động
  const doanhThu = value?.tongDoanhThu || 0;
  const chiPhi = value?.tongChiPhi || 0;
  const loiNhuan = value?.loiNhuan || 0;

  // Tính tỷ suất lợi nhuận (%)
  const tySuat =
    doanhThu > 0 ? ((loiNhuan / doanhThu) * 100).toFixed(1) : "0.0";

  const series = [Number(tySuat)];

  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: (val) => val.toFixed(1) + "%",
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#465FFF"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Tỷ suất lợi nhuận"],
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        {/* Header */}
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Kết quả kinh doanh
            </h3>
            <p className="mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
              Tổng hợp thu nhập, chi tiêu và lợi nhuận hôm nay
            </p>
          </div>
          <div className="relative inline-block">
            <BaseDatePicker
              onChange={handleChangeDatePicker}
              id="date"
              name="date"
              placeholder="Chọn ngày"
              value={localDate}
            />
          </div>
        </div>

        {/* Chart */}
        <div className="relative">
          <div className="max-h-[330px]">
            <ReactApexChart
              options={options}
              series={series}
              type="radialBar"
              height={330}
            />
          </div>
        </div>

        {/* Summary */}
        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          Tổng thu nhập đạt{" "}
          <strong className="text-indigo-600 dark:text-indigo-400 sm:text-md">{formatCurrency(doanhThu)}</strong>, trong khi chi tiêu ở mức{" "}
          <strong className="text-rose-600 dark:text-rose-400 sm:text-md">{formatCurrency(chiPhi)}</strong>. Trừ chi phí, lợi
          nhuận ước tính đạt <strong className="text-success-600 dark:text-success-400 sm:text-md">{formatCurrency(loiNhuan)}</strong>
        </p>
      </div>

      {/* 3 items: Thu nhập / Chi tiêu / Lợi nhuận */}
      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        {/* Thu nhập */}
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Thu nhập
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold  text-indigo-600 dark:text-indigo-400 sm:text-lg">
            {formatCurrency(doanhThu)}
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        {/* Chi tiêu */}
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Chi tiêu
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-rose-600 dark:text-rose-400 sm:text-lg">
            {formatCurrency(chiPhi)}
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        {/* Lợi nhuận */}
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Lợi nhuận
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-success-600 dark:text-success-400 sm:text-lg">
            {formatCurrency(loiNhuan)}
          </p>
        </div>
      </div>
    </div>
  );
}
