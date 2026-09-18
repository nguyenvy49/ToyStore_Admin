import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EditForm from "@/components/form/Promotions/EditForm";
import { FormProvider } from "@/context/FormContext";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Sửa khuyến mãi",
};

export default async function EditPromotionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ Giải promise

  return (
    <div>
      <PageBreadcrumb
        pageTitle="Sửa khuyến mãi"
        pageParent="Quản lý khuyến mãi"
        urlPageParent="/promotions"
      />
      <FormProvider>
        <EditForm id={id} />
      </FormProvider>
    </div>
  );
}
