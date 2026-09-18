import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProductTableDelete from "@/components/tables/main/Products/ProductTableDeleted";
import { TableContextProvider } from "@/context/TableContext";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Sản phẩm Đã Xóa"
};

export default function DeletedNewsPage() {
  return (
    <div>
      <TableContextProvider initialUrl="/api/Product/deleted?PageSize=15">
        <PageBreadcrumb pageTitle="Sản phẩm đã xóa" pageParent="Quản lý sản phẩm" urlPageParent="/products" itemSearch={true}/>
        <div className="space-y-6">
          <ComponentCard title="Danh sách sản phẩm" linkBtn="products" titleBtn="Sản Phẩm" isDelete={true}>
            <ProductTableDelete />
          </ComponentCard>
        </div>
      </TableContextProvider>
    </div>
  );
}

