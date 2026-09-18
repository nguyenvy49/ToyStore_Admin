import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AddForm from "@/components/form/Promotions/AddForm";
import { FormProvider } from "@/context/FormContext";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Thêm khuyến mãi"
};

export default function CreatePromotionsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Thêm khuyến mãi" pageParent="Quản lý khuyến mãi" urlPageParent="/promotions" />
      <FormProvider >
        <AddForm />
      </FormProvider>
    </div>
  );
}
