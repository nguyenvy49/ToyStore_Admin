import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import NewsTableDelete from "@/components/tables/main/News/NewsTableDeleted";
import { Metadata } from "next";
import React from "react";
import { TableContextProvider } from "@/context/TableContext";

export const metadata: Metadata = {
  title: "Tin Tức Đã Xóa"
};

export default function DeletedNewsPage() {
  return (
    <div>
      <TableContextProvider initialUrl="api/News/Delete?PageSize=15">
      <PageBreadcrumb pageTitle="Tin tức đã xóa" pageParent="Quản lý tin tức" urlPageParent="/news" itemSearch={true}/>
      <div className="space-y-6">
        <ComponentCard title="Danh sách tin tức đã xóa" linkBtn="news" titleBtn="Tin Tức" isDelete={true}>
          <NewsTableDelete />
        </ComponentCard>
      </div>
      </TableContextProvider>
    </div>
  );
}

