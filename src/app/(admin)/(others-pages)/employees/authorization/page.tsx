import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AuthorizationTable from "@/components/tables/main/Employees/AuthorizationTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Quản lý nhân viên"
};

export default function AuthorizationPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Phân quyền"/>
      <div className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]`}>
        <AuthorizationTable/>
      </div>
    </div>
  );
}