import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EditForm from "@/components/form/News/EditForm";
import { FormProvider } from "@/context/FormContext";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Sửa tin tức",
};

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ Giải promise để lấy id

  return (
    <div>
      <PageBreadcrumb
        pageTitle="Sửa tin tức"
        pageParent="Quản lý tin tức"
        urlPageParent="/news"
      />
      <FormProvider>
        <EditForm id={id} />
      </FormProvider>
    </div>
  );
}
