import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import { ProductListWarehouse } from "@/components/common/Warehouse/ProductListWarehouse";
import { TableContextProvider } from "@/context/TableContext";
import { WarehouseProvider } from "@/context/WarehouseContext";
import { InfoWarehouseEdit } from "@/components/common/Warehouse/InfoWarehouseEdit";

export const metadata: Metadata = {
    title: "Sửa kho hàng"
};

export default async function EditOrdersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return (
        <div>
            <TableContextProvider initialUrl="/api/Product/admin?PageSize=15">
                <WarehouseProvider>
                    <PageBreadcrumb pageTitle="Sửa kho hàng" pageParent="Quản lý quản lý" urlPageParent="/warehouses" itemSearch={true} />
                    <div className="grid grid-cols-3 gap-4">
                        <ComponentCard title="Danh sách sản phẩm" isOrder={true} isAdd={false} className="col-span-2 ">
                            <div className="max-h-[600px] overflow-x-autoflex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                                <ProductListWarehouse />
                            </div>
                        </ComponentCard>
                        <ComponentCard title="Toys-World" isOrder={true} isAdd={false}>
                            <InfoWarehouseEdit id={id}/>
                        </ComponentCard>
                    </div>
                </WarehouseProvider>
            </TableContextProvider>
        </div>
    );
}
