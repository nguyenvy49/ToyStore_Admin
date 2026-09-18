import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import { TableContextProvider } from "@/context/TableContext";

export const metadata: Metadata = {
  title: "Trang chủ",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <TableContextProvider initialUrl="/api/Statistic/Profit">
          <MonthlyTarget />
        </TableContextProvider>

      </div>

      <div className="col-span-12">
        <TableContextProvider initialUrl="/api/Statistic/monthly">
          <StatisticsChart />
        </TableContextProvider>
      </div>

      <div className="col-span-12">
        <RecentOrders />
      </div>
    </div>
  );
}
