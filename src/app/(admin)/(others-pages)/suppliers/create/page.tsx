import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AddForm from "@/components/form/Supplier/AddForm";
import { FormProvider } from "@/context/FormContext";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Thêm nhà cung cấp"
};

export default function CreateNewsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Thêm nhà cung cấp" pageParent="Quản lý nhà cung cấp" urlPageParent="/suppliers" />
      <FormProvider >
        <AddForm />
      </FormProvider>
    </div>
  );
}
