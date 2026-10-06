"use client";
import React from "react";
import {
  TableBody,
  TableCell,
  TableRow,
} from "../../../ui/table";

import Button from "@/components/ui/button/Button";
import { FaWrench } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";
import { OrderType } from "@/schemaValidations/order.schema";
import { formatDateTime, formatCurrency } from "@/utils/format";

// type BadgeColor =
//   | "primary"
//   | "success"
//   | "error"
//   | "warning"
//   | "info"
//   | "light"
//   | "dark";

import { getOrderStatusText, getOrderStatusBadgeClass } from "@/utils/ghnStatusHelper";

interface NewsTableBodyProps {
  tableData: OrderType[];
  onOpenModalUpdate: (type: "update", id?: string, status?: number) => void;
  onOpenModalDetail: (type: "detail", detailOrder: OrderType) => void;
  onOpenModalQr?: (type: "qr", id: string, amount: number) => void;
}

const OrdersTableBody: React.FC<NewsTableBodyProps> = ({
  tableData,
  onOpenModalUpdate,
  onOpenModalDetail,
  onOpenModalQr,
}: NewsTableBodyProps) => {

  return (
    <>
      <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
        {tableData.map((order, index) => (
          <TableRow key={order.id}>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              {index + 1}
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
              <span className={getOrderStatusBadgeClass(order.orderStatus, order.ghnStatus)}>
                {getOrderStatusText(order.orderStatus, order.ghnStatus)}
              </span>
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              <div className="flex flex-col gap-1.5">
                {onOpenModalQr && (
                  <Button
                    className="w-20"
                    size="xxs"
                    onClick={() => onOpenModalQr("qr", order.id, order.totalPrice)}
                    variant="primary"
                    startIcon={
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1H17a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                    }
                  >
                    Mã QR
                  </Button>
                )}
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
