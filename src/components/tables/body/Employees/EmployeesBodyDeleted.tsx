"use client";
import React from "react";
import {
  TableBody,
  TableCell,
  TableRow,
} from "../../../ui/table";

import Button from "@/components/ui/button/Button";
import { FaLockOpen } from "react-icons/fa";
import Badge from "@/components/ui/badge/Badge";
import { UserPermissionType } from "@/schemaValidations/permission.schema";

interface EmployeesBodyDeletedProps {
  tableData: UserPermissionType[];
  onOpenModal: (type: "restore", id: string) => void;
}

const EmployeesBodyDeleted: React.FC<EmployeesBodyDeletedProps> = ({
  tableData,
  onOpenModal,
}) => {
  return (
    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
      {tableData.map((item, index) => (
        <TableRow key={item.id}>
          <TableCell className="px-4 py-1 text-gray-500 text-start text-theme-sm dark:text-gray-400">
            {index + 1}
          </TableCell>

          <TableCell className="px-2 py-1 text-gray-500 text-start text-theme-sm dark:text-gray-400">
            {item.fullName}
          </TableCell>
          <TableCell className="px-2 py-1 text-gray-500 text-start text-theme-sm dark:text-gray-400">
            {item.phoneNumber || "-"}
          </TableCell>
          <TableCell className="px-2 py-1 text-gray-500 text-theme-sm dark:text-gray-400">
            {item.email}
          </TableCell>
          <TableCell className="px-2 py-1 text-gray-500 text-theme-sm dark:text-gray-400">
            <Badge color={item.gender == 0 ? "info" : "error"} size="sm">
              {item.gender == 0 ? "Nam" : "Nữ"}
            </Badge>
          </TableCell>
          <TableCell className="px-2 py-1 text-gray-500 text-theme-sm dark:text-gray-400">
            {item.roles.map((role) => (
              <Badge key={role} variant="solid" color={role === "staff" ? "success" : "info"}>
                {role === "staff" ? "Nhân viên" : "Quản lý"}
              </Badge>
            ))}
          </TableCell>
          <TableCell className="px-2 py-1 text-gray-500 text-theme-sm dark:text-gray-400">
            {item.createdOn ? new Date(item.createdOn).toLocaleDateString() : "-"}
          </TableCell>
          <TableCell className="px-2 py-1 text-gray-500 text-theme-sm dark:text-gray-400">
            <Badge color="error" size="sm">
              Đã khóa
            </Badge>
          </TableCell>
          <TableCell className="px-2 py-1 text-gray-500 text-theme-sm dark:text-gray-400">
            {item.updatedBy || item.createdBy || "-"}
          </TableCell>
          <TableCell className="px-2 py-1 text-gray-500 text-theme-sm dark:text-gray-400">
            <Button
              onClick={() => onOpenModal("restore", item.id)}
              className="w-24"
              size="xxs"
              variant="success"
              startIcon={<FaLockOpen />}
            >
              Mở khóa
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default EmployeesBodyDeleted;
