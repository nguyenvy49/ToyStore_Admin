import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EmployeesTableDeleted from "@/components/tables/main/Employees/EmployeesTableDeleted";
import { TableContextProvider } from "@/context/TableContext";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Nhân viên đã khóa",
};

export default function DeletedEmployeesPage() {
  return (
    <div>
      <TableContextProvider initialUrl="/api/Staff/staff?pageSize=50">
        <PageBreadcrumb
          pageTitle="Nhân viên đã khóa"
          pageParent="Quản lý nhân viên"
          urlPageParent="/employees"
          itemSearch={true}
        />
        <div className="space-y-6">
          <ComponentCard
            title="Danh sách nhân viên đã khóa"
            linkBtn="employees"
            titleBtn="Nhân Viên"
            isDelete={true}
          >
            <EmployeesTableDeleted />
          </ComponentCard>
        </div>
      </TableContextProvider>
    </div>
  );
}
