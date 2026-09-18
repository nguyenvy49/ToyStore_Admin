import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AddForm from "@/components/form/News/AddForm";
import { FormProvider } from "@/context/FormContext";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Thêm tin tức"
};

export default function CreateNewsPage() {
  return (
    <div>
      
      <PageBreadcrumb pageTitle="Thêm tin tức" pageParent="Quản lý tin tức" urlPageParent="/news" />
      <FormProvider >
        <AddForm />
      </FormProvider>
    </div>
  );
}
