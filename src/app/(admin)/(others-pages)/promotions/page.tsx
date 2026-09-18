import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PromotionsTable from "@/components/tables/main/Promotions/PromotionsTable";
import { TableContextProvider } from "@/context/TableContext";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Quản lý khuyến mãi"
};

export default function PromotionsPage() {
  return (
    <div>
      <TableContextProvider initialUrl="/api/Promotion?PageSize=15&Type=1">
        <PageBreadcrumb pageTitle="Quản lý khuyến mãi" itemSearch={true}/>
        <div className="space-y-6">
          <ComponentCard title="Danh sách khuyến mãi" isDelete={false} isApprove={true} linkBtn="promotions" titleBtn="Khuyến Mãi" isAdd={true}>
            <PromotionsTable />
          </ComponentCard>
        </div>
      </TableContextProvider>
    </div>
  );
}