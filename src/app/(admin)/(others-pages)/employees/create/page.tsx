import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AddForm from "@/components/form/Employees/AddForm";
import { FormProvider } from "@/context/FormContext";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Thêm nhân viên"
};

export default function CreateEmployeesPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Thêm nhân viên" pageParent="Quản lý nhân viên" urlPageParent="/employees" />
      <FormProvider >
        <AddForm />
      </FormProvider>
    </div>
  );
}
