import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SupplierTableDelete from "@/components/tables/main/Suppliers/SupplierTableDeleted";
import { TableContextProvider } from "@/context/TableContext";

import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Nhà cung cấp Đã Xóa"
};

export default function DeletedNewsPage() {
  return (
    <div>
      <TableContextProvider initialUrl="api/Supplier/Delete?PageSize=15">
        <PageBreadcrumb pageTitle="Nhà cung cấp đã xóa" pageParent="Quản lý nhà cung cấp" urlPageParent="/suppliers" itemSearch={true} />
        <div className="space-y-6">
          <ComponentCard title="Danh sách nhà cung cấp đã xóa" linkBtn="suppliers" titleBtn="Nhà Cung Cấp" isDelete={true}>
            <SupplierTableDelete />
          </ComponentCard>
        </div>
      </TableContextProvider>
    </div>
  );
}

