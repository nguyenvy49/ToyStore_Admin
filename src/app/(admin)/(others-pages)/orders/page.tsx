import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import OrdersTable from "@/components/tables/main/Orders/OrdersTable";
import { TableContextProvider } from "@/context/TableContext";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Quản lý đơn hàng"
};

export default function OrdersPage() {
  return (
    <div>
      <TableContextProvider initialUrl="/api/Order/all?PageSize=15">
        <PageBreadcrumb pageTitle="Quản lý đơn hàng" itemSearch={true}/>
        <div className="space-y-6">
          <ComponentCard title="Danh sách đơn hàng" isOrder={true} linkBtn="orders" titleBtn="Đơn Hàng" isAdd={true}>
            <OrdersTable />
          </ComponentCard>
        </div>
      </TableContextProvider>
    </div>
  );
}