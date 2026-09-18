import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import NewsTableBodyUnapproved from "@/components/tables/main/News/NewsTableUnapproved";
import { TableContextProvider } from "@/context/TableContext";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Tin tức chờ duyệt"
};

export default function ApproveNewsPage() {
  return (
    <div>
      <TableContextProvider initialUrl="/api/News/Admin?pageSize=15&Type=2">
      <PageBreadcrumb pageTitle="Tin tức chờ duyệt" pageParent="Quản lý tin tức" urlPageParent="/news" itemSearch={true}/>
      <div className="space-y-6">
        <ComponentCard title="Danh sách tin tức" linkBtn="news" titleBtn="Tin Tức" isDelete={true}>
          <NewsTableBodyUnapproved />
        </ComponentCard>
      </div>
      </TableContextProvider>
    </div>
  );
}

