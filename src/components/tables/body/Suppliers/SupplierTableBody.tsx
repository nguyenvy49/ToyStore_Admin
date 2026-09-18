"use client";
import React from "react";
import {
  TableBody,
  TableCell,
  TableRow,
} from "../../../ui/table";

import Button from "@/components/ui/button/Button";
import Link from "next/link";
import { FaWrench, FaEye } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";

interface SuppliersTableRow {
  id: string;
  supplierName: string;
  phone: string;
  email: string;
  address: string;
  note?: string | null;
}

interface SuppliersTableBodyProps {
  tableData: SuppliersTableRow[];
  onOpenModal: (type: "delete" | "detail", id?: string) => void;
}

const SupplierTableBody: React.FC<SuppliersTableBodyProps> = ({
  tableData,
  onOpenModal,
}) => {
  return (
    <>
      <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
        {tableData.map((supplier, index) => (
          <TableRow key={supplier.id}>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              {index + 1}
            </TableCell>
            {/* ✅ hiển thị supplierName thay vì name */}
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              {supplier.supplierName}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              {supplier.phone}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              {supplier.email}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              {supplier.address}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              {supplier.note || "Không có ghi chú"}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              <div className="flex flex-col gap-2">
                <Link href={"/suppliers/edit/" + supplier.id}>
                  <Button className="w-20" size="xxs" variant="warning" startIcon={<FaWrench />}>
                    Sửa
                  </Button>
                </Link>
                <Button onClick={() => onOpenModal("detail", supplier.id)} className="w-20" size="xxs" variant="info" startIcon={<FaEye />}>
                  Chi tiết
                </Button>
                <Button onClick={() => onOpenModal("delete", supplier.id)} className="w-20" size="xxs" variant="danger" startIcon={<FaDeleteLeft />}>
                  Xóa
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default SupplierTableBody;
