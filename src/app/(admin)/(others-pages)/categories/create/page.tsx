import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AddForm from "@/components/form/Categories/AddForm";
import { FormProvider } from "@/context/FormContext";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Thêm danh mục"
};

export default function CreateCategoriesPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Thêm danh mục" pageParent="Quản lý danh mục" urlPageParent="/categories" />
      <FormProvider >
        <AddForm />
      </FormProvider>
    </div>
  );
}
