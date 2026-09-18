import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SupplierTable from "@/components/tables/main/Suppliers/SupplierTable";
import { TableContextProvider } from "@/context/TableContext";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Quản lý nhà cung cấp"
};

export default function CustomerPage() {
  return (
    <div>
      <TableContextProvider initialUrl="/api/Supplier/Admin?pageSize=15">
      <PageBreadcrumb pageTitle="Quản lý nhà cung cấp" itemSearch={true}/>
      <div className="space-y-6">
        <ComponentCard title="Danh sách nhà cung cấp" isDelete={false} linkBtn="suppliers" titleBtn="Nhà Cung Cấp" isAdd={true}>
          <SupplierTable />
        </ComponentCard>
      </div>
      </TableContextProvider>
    </div>
  );
}