"use client";
import React, { useEffect, useState } from "react";
import { CiBoxes } from "react-icons/ci";
import { BsPeople } from "react-icons/bs";
import MetricItem from "./MetricItem";
import OrderMetric from "./OrderMetric";
import { StatisticService } from "@/services/statisticService";
import { TableContextProvider } from "@/context/TableContext";

export const EcommerceMetrics = () => {
  const [dataCW, setDataCW] = useState<any>()
  useEffect(() => {
    const getdataStatistic = async () => {
      try {
        const res = await StatisticService.statistic("/api/Statistic/warehouse");
        console.log(res);
        setDataCW(res);
      } catch (error) {
        console.log(error);
      }
    };
    getdataStatistic();
  }, [])
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      {/* Khách hàng */}
      <MetricItem icon={<BsPeople className="text-gray-800 size-6 dark:text-white/90" size={20} />} title="Khách hàng" value={dataCW?.userCountStats ? dataCW?.userCountStats?.totalUsers : 0} />

      {/* Đơn hàng */}
      <TableContextProvider initialUrl="/api/Statistic/order">
        <OrderMetric />
      </TableContextProvider>


      {/* Tồn kho */}
      <MetricItem icon={<CiBoxes className="text-gray-800 dark:text-white/90" size={20} />} title="Tồn kho" value={dataCW?.inventoryStats ? dataCW?.inventoryStats?.newQuantity : 0} />
    </div>
  );
};
