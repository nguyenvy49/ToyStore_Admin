"use client";
import React from "react";
import { formatDateTime } from "@/utils/format";
import { WarehouseItemType } from "@/schemaValidations/warehouse.schema";

interface WarehouseDetailModalProps {
  warehouse: WarehouseItemType | null;
}

const getStatusBadge = (status: number) => {
  const base = "px-3 py-1 rounded-full text-sm font-medium";
  switch (status) {
    case 0:
      return <span className={`${base} bg-yellow-100 text-yellow-700`}>Đang nhập</span>;
    case 1:
      return <span className={`${base} bg-green-100 text-green-700`}>Đã nhập</span>;
    case 2:
      return <span className={`${base} bg-red-100 text-red-700`}>Đã hủy</span>;
    default:
      return <span className={`${base} bg-gray-100 text-gray-700`}>Không xác định</span>;
  }
};

export const ModalDetailWarehouse: React.FC<WarehouseDetailModalProps> = ({ warehouse }) => {
  if (!warehouse) return null;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center text-green-700">
        Chi tiết phiếu nhập kho
      </h2>

      {/* Thông tin chung */}
      <div className="bg-gray-50 rounded-2xl p-5 shadow-sm mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
          <p><span className="font-semibold">Mã phiếu nhập:</span> {warehouse.id}</p>
          <p><span className="font-semibold ml-2">Người tạo:</span> {warehouse.createdBy}</p>
          <p><span className="font-semibold">Ngày nhập:</span> {formatDateTime(warehouse.dateEntered)}</p>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="bg-white rounded-2xl shadow-md p-4">
        <h3 className="font-semibold text-lg mb-3 border-b pb-2">Danh sách sản phẩm</h3>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-2 rounded-tl-lg">Tên sản phẩm</th>
              <th className="border p-2 text-center">Nhà cung cấp</th>
              <th className="border p-2 text-center">Giá nhập</th>
              <th className="border p-2 text-center">Số lượng</th>
              <th className="border p-2 text-center">Trạng thái</th>
              <th className="border p-2 text-center rounded-tr-lg">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {warehouse.details.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="border p-3">{item.productName}</td>
                <td className="border p-3 text-center">{item.supplierName}</td>
                <td className="border p-3 text-center">
                  {item.importPrice.toLocaleString("vi-VN")} ₫
                </td>
                <td className="border p-3 text-center">{item.quantity}</td>
                <td className="border p-3 text-center">{getStatusBadge(item.status)}</td>
                <td className="border p-3 text-center text-green-700 font-medium">
                  {item.totalPrice.toLocaleString("vi-VN")} ₫
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tổng tiền */}
      <div className="text-right mt-6">
        <p className="text-xl font-bold text-gray-800">
          Tổng tiền:{" "}
          <span className="text-red-600">
            {warehouse.totalPrice.toLocaleString("vi-VN")} ₫
          </span>
        </p>
      </div>
    </div>
  );
};
