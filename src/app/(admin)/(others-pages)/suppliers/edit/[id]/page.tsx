import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EditForm from "@/components/form/Supplier/EditForm";
import { FormProvider } from "@/context/FormContext";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Sửa nhà cung cấp",
};

export default async function EditSupplierPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <PageBreadcrumb
        pageTitle="Sửa nhà cung cấp"
        pageParent="Quản lý nhà cung cấp"
        urlPageParent="/suppliers"
      />
      <FormProvider>
        <EditForm id={id} /> {/* ✅ Bây giờ EditForm nhận id */}
      </FormProvider>
    </div>
  );
}
