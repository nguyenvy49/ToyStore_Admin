"use client";
import React from "react";
import {
  TableBody,
  TableCell,
  TableRow,
} from "../../../ui/table";

import Button from "@/components/ui/button/Button";
import { FaWrench } from "react-icons/fa";
import Badge from "@/components/ui/badge/Badge";
import { FaEye } from "react-icons/fa6";
import { OrderType } from "@/schemaValidations/order.schema";
import { formatDateTime,formatCurrency } from "@/utils/format";

type BadgeColor =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "light"
  | "dark";

interface NewsTableBodyProps {
  tableData: OrderType[];
  onOpenModalUpdate: (type: "update", id?: string, status?: number) => void;
  onOpenModalDetail: (type: "detail", detailOrder: OrderType) => void;
}

const OrdersTableBody: React.FC<NewsTableBodyProps> = ({ tableData, onOpenModalUpdate, onOpenModalDetail }: NewsTableBodyProps) => {

  const status = [ "Chờ xác nhận","Đã xác nhận","Đang giao","Hoàn thành","Đã hủy"]
  const statusColor:BadgeColor[] = ["warning","info","primary","success","error"]

  return (
    <>
      <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
        {tableData.map((order,index) => (
          <TableRow key={order.id}>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              {index+ 1}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              {order.user.fullName}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              {order.phone}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              {order.address}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              {formatDateTime(order.orderDate)}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              {formatCurrency(order.totalPrice)}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              {order.createdBy}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              {order.updatedBy || "Chưa cập nhật"}
            </TableCell>
            {/* Các cột khác */}
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              <Badge color={statusColor[order.orderStatus]} size="sm">{status[order.orderStatus]}</Badge>
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              <div className="flex flex-col gap-2">
                <Button
                  className="w-20"
                  size="xxs"
                  onClick={() => onOpenModalUpdate("update", order.id, order.orderStatus)}
                  variant="warning"
                  startIcon={<FaWrench />}
                >
                  Cập nhật
                </Button>
                <Button
                  className="w-20"
                  size="xxs"
                  onClick={() => onOpenModalDetail("detail", order)}
                  variant="info"
                  startIcon={<FaEye />}
                >
                  Chi tiết
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default OrdersTableBody;
