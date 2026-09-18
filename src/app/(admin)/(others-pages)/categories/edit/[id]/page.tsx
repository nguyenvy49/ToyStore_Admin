import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EditForm from "@/components/form/Categories/EditForm";
import { FormProvider } from "@/context/FormContext";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Sửa danh mục"
};

export default async function EditCategoriesPage({
  params,
}: {
  params: Promise<{ id: string }>;  
}) {
  const { id } = await params;
  return (
    <div>
      <PageBreadcrumb pageTitle="Sửa danh mục" pageParent="Quản lý danh mục" urlPageParent="/categories" />
      <FormProvider >
        <EditForm id={id} />
      </FormProvider>
    </div>
  );
}
