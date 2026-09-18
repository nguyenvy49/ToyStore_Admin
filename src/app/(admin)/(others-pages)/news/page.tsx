import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import NewsTable from "@/components/tables/main/News/NewsTable";
import { TableContextProvider } from "@/context/TableContext";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Quản lý tin tức"
};

export default function NewsPage() {
  return (
    <div>
      <TableContextProvider initialUrl="/api/News/Admin?pageSize=15&Type=1">
      <PageBreadcrumb pageTitle="Quản lý tin tức" itemSearch={true}/>
      <div className="space-y-6">
        <ComponentCard title="Danh sách tin tức" isDelete={false} isApprove={true} linkBtn="news" titleBtn="Tin Tức" isAdd={true}>
          <NewsTable />
        </ComponentCard>
      </div>
      </TableContextProvider>
    </div>
  );
}