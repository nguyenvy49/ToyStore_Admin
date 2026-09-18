import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AddForm from "@/components/form/Product/AddForm";
import { FormProvider } from "@/context/FormContext";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Thêm sản phẩm"
};

export default function CreateNewsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Thêm sản phẩm" pageParent="Quản lý sản phẩm" urlPageParent="/products" />
      <FormProvider >
        <AddForm />
      </FormProvider>
    </div>
  );
}
