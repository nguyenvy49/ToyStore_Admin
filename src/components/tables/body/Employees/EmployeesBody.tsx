"use client"
import React from "react";
import {
  TableBody,
  TableCell,
  TableRow,
} from "../../../ui/table";

import Button from "@/components/ui/button/Button";
import { FaLockOpen, FaLock } from "react-icons/fa";
import { MdPermIdentity } from "react-icons/md";
import Badge from "@/components/ui/badge/Badge";
import { UserPermissionType } from "@/schemaValidations/permission.schema";

interface UserPermissionTableBodyProps {
  tableData: UserPermissionType[];
  onOpenModal: (type: "role" | "lock" | "restore", id?: string, status?: number) => void;
}

const EmployeesBody: React.FC<UserPermissionTableBodyProps> = ({
  tableData,
  onOpenModal,
}) => {
  return (
    <>
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
              {item.phoneNumber}
            </TableCell>
            <TableCell className="px-2 py-1 text-gray-500 text-theme-sm dark:text-gray-400">
              {item.email}
            </TableCell>
            <TableCell className="px-2 py-1 text-gray-500 text-theme-sm dark:text-gray-400">
              {item.roles.map((role) => (
                <Badge key={role} variant="solid" color={role === "staff" ? "success" : "info"}>{role == "staff" ? "Nhân viên" : "Quản lý"}</Badge>
              ))}
            </TableCell>
            <TableCell className="px-2 py-1 text-gray-500 text-theme-sm dark:text-gray-400">
              {new Date(item.createdOn).toLocaleDateString()}
            </TableCell>
            <TableCell className="px-2 py-1 text-gray-500 text-theme-sm dark:text-gray-400">
              <Badge color={item.gender == 0 ? "info" : "error"} size="sm">
                {item.gender == 0 ? "Nam" : "Nữ"}
              </Badge>
            </TableCell>
            <TableCell className="px-2 py-1 text-gray-500 text-theme-sm dark:text-gray-400">
              {item.createdBy}
            </TableCell>
            <TableCell className="px-2 py-1 text-gray-500 text-theme-sm dark:text-gray-400">
              {item.updatedBy}
            </TableCell>
            <TableCell className="px-2 py-1 text-gray-500 text-theme-sm dark:text-gray-400">
              <div className="flex flex-col gap-2">
                <Button onClick={() => onOpenModal("role", item.id, item.staffType)} className="w-20" size="xxs" variant="info" startIcon={<MdPermIdentity />}>
                  Chức vụ
                </Button>
                {!item.isDeleted ? (
                  <Button onClick={() => onOpenModal("lock", item.id)} className="w-20" size="xxs" variant="danger" startIcon={<FaLock />}>
                    Khóa
                  </Button>
                ) : (
                  <Button onClick={() => onOpenModal("restore", item.id)} className="w-20" size="xxs" variant="success" startIcon={<FaLockOpen />}>
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

export default EmployeesBody;