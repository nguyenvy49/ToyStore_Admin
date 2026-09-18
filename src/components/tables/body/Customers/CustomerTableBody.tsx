"use client"
import React from "react";
import {
  TableBody,
  TableCell,
  TableRow,
} from "../../../ui/table";

import Button from "@/components/ui/button/Button";
import { FaLock, FaLockOpen } from "react-icons/fa";
import Badge from "@/components/ui/badge/Badge";
import { CustomerType } from "@/schemaValidations/customer.schema";

interface CustomersTableBodyProps {
  tableData: CustomerType[];
  onOpenModal: (type: "lock" | "lockOpen", id?: string) => void;
}

const CustomerTableBody: React.FC<CustomersTableBodyProps> = ({
  tableData,
  onOpenModal
}) => {
  return (
    <>
      <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
        {tableData.map((customer, index) => (
          <TableRow key={customer.id}>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              {index + 1}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              {customer.fullName}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              {customer.phoneNumber}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              {customer.email}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              {customer.address}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              <Badge color={customer.status == "Đang hoạt động" ? "success" : "error"} size="sm">
                {customer.status}
              </Badge>
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              <div className="flex flex-col gap-2">
                {customer.status == "Đang hoạt động" ? (
                  <Button onClick={() => onOpenModal("lock", customer.id)} className="w-20" size="xxs" variant="danger" startIcon={<FaLock />}>
                    Khóa
                  </Button>
                ) : (
                  <Button onClick={() => onOpenModal("lockOpen", customer.id)} className="w-20" size="xxs" variant="success" startIcon={<FaLockOpen />}>
                    Mở khóa
                  </Button>
                )}

              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}

export default CustomerTableBody;