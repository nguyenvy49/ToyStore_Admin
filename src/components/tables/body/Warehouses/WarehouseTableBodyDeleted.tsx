"use client"
import React from "react";
import {
  TableBody,
  TableCell,
  TableRow,
} from "../../../ui/table";

import { RiResetLeftFill } from "react-icons/ri";

import Button from "@/components/ui/button/Button";
import { FaEye } from "react-icons/fa6";
import { WarehouseItemType } from "@/schemaValidations/warehouse.schema";
import { formatCurrency, formatDateTime } from "@/utils/format";


interface WarehousesTableBodyProps {
  tableData: WarehouseItemType[];
  onOpenModal: (type: "detail" | "restore", id?: string, itemWarehouse?: WarehouseItemType) => void;
}

const WarehouseTableBodyDelete: React.FC<WarehousesTableBodyProps> = ({
  tableData,
  onOpenModal,
}) => {
  tableData.map(warehouses => {
    warehouses.totalPrice = warehouses.details.reduce(
      (sum, item) => sum + item.importPrice * item.quantity,
      0
    )
  })
  return (
    <>
      <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
        {tableData.map((warehouses, index) => (
          <TableRow key={warehouses.id}>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              {index + 1}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              {formatCurrency(warehouses.totalPrice)}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              {formatDateTime(warehouses.dateEntered)}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              {warehouses.createdBy}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              Nguyễn Văn A
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              <div className="flex flex-col gap-2">
                <Button onClick={() => onOpenModal("detail", warehouses.id, warehouses)} className="w-20" size="xxs" variant="info" startIcon={<FaEye />}>
                  Chi tiết
                </Button>
                <Button onClick={() => onOpenModal("restore", warehouses.id)} className="w-20" size="xxs" variant="warning" startIcon={<RiResetLeftFill />}>
                  Khôi phục
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody >
    </>
  );
}

export default WarehouseTableBodyDelete;