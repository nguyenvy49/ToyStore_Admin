import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EditForm from "@/components/form/Product/EditForm";
import { FormProvider } from "@/context/FormContext";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Sửa sản phẩm"
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <PageBreadcrumb pageTitle="Sửa sản phẩm" pageParent="Quản lý sản phẩm" urlPageParent="/products" />
      <FormProvider >
        <EditForm id={id}/>
      </FormProvider>
    </div>
  );
}
