import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PromotionsTableUnapproved from "@/components/tables/main/Promotions/PromotionsTableUnapproved";
import { TableContextProvider } from "@/context/TableContext";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Khuyến Mãi chờ duyệt"
};

export default function ApprovePromotionsPage() {
  return (
    <div>
      <TableContextProvider initialUrl="/api/Promotion?PageSize=15&Type=2">
        <PageBreadcrumb pageTitle="Khuyến mãi chờ duyệt" pageParent="Quản lý khuyến mãi" urlPageParent="/promotions" itemSearch={true}/>
        <div className="space-y-6">
          <ComponentCard title="Danh sách khuyến mãi" linkBtn="promotions" titleBtn="Khuyến Mãi" isDelete={true}>
            <PromotionsTableUnapproved />
          </ComponentCard>
        </div>
      </TableContextProvider>
    </div>
  );
}

