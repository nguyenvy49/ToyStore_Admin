import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PromotionsTableDelete from "@/components/tables/main/Promotions/PromotionsTableDeleted";
import { TableContextProvider } from "@/context/TableContext";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Khuyến Mãi Đã Xóa"
};

export default function DeletedNewsPage() {
  return (
    <div>
      <TableContextProvider initialUrl="api/Promotion/deleted?PageSize=15">
        <PageBreadcrumb pageTitle="Khuyến mãi đã xóa" pageParent="Quản lý khuyến mãi" urlPageParent="/promotions" itemSearch={true}/>
        <div className="space-y-6">
          <ComponentCard title="Danh sách khuyến mãi" linkBtn="promotions" titleBtn="Khuyến Mãi" isDelete={true}>
            <PromotionsTableDelete />
          </ComponentCard>
        </div>
      </TableContextProvider>
    </div>
  );
}

