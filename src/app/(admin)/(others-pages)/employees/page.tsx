import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EmployeesTable from "@/components/tables/main/Employees/EmployeesTable";
import { FormProvider } from "@/context/FormContext";
import { TableContextProvider } from "@/context/TableContext";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Quản lý nhân viên"
};

export default function EmployeesPage() {
  return (
    <div>
      <TableContextProvider initialUrl="/apiStaff/staff?pageSize=15">
        <PageBreadcrumb pageTitle="Quản lý nhân viên" itemSearch={true} />
        <div className="space-y-6">
          <ComponentCard title="Danh sách nhân viên" isDelete={false} linkBtn="employees" titleBtn="Nhân Viên" isAdd={true}>
            <FormProvider >
              <EmployeesTable />
            </FormProvider>
          </ComponentCard>
        </div>
      </TableContextProvider>
    </div>
  );
}