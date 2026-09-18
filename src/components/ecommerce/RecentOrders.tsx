"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Link from "next/link";
import { useEffect, useState } from "react";
import { OrderType } from "@/schemaValidations/order.schema";
import { Loading } from "../common/Loading";
import { NoData } from "../common/NoData";
import { OrderService } from "@/services/orderService";
import { formatCurrency, formatDateTime } from "@/utils/format";

type BadgeColor =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "light"
  | "dark";

export default function RecentOrders() {
  const [tableData, setTableData] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const status = ["Chờ xác nhận", "Đã xác nhận", "Đang giao", "Hoàn thành", "Đã hủy"]
  const statusColor: BadgeColor[] = ["warning", "info", "primary", "success", "error"]
  const fetchDataTable = async (urlApi: string) => {
    try {
      setTableData([]);
      setLoading(true);
      const res = await OrderService.getListOrder(urlApi);
      console.log(res);
      setTableData(res.result.items);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const sorts = encodeURIComponent(JSON.stringify({ key: "orderDate", sort: -1 }));
    const url = `/api/Order/all?PageSize=10&Sorts=${sorts}`;
    fetchDataTable(url);
  }, []);
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Đơn hàng gần đây
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/orders" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Xem tất cả
          </Link>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Khách hàng
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Số điện thoại
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Địa chỉ
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Thời gian đặt
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Tổng tiền
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Trạng thái
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          {loading && <Loading colSpan={6} />}
          {!loading && tableData.length > 0 && (
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {tableData.map((order) => (
                <TableRow key={order.id} className="">
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {order.user.fullName}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {order.phone}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {order.address}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {formatDateTime(order.orderDate)}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {formatCurrency(order.totalPrice)}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Badge color={statusColor[order.orderStatus]} size="sm">{status[order.orderStatus]}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
          {!loading && tableData.length === 0 && (
            <NoData colSpan={6} title="Không có dữ liệu" />
          )}
        </Table>
      </div>
    </div>
  );
}
