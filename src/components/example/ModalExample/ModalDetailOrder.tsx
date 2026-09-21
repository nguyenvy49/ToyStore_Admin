"use client";
import { OrderType } from "@/schemaValidations/order.schema";
import { formatDateTime } from "@/utils/format";
import React from "react";

interface OrderDetailModalProps {
  order: OrderType | null;
}

import { getOrderStatusText, getOrderStatusBadgeClass } from "@/utils/ghnStatusHelper";

const getStatusBadge = (status: number, ghnStatus?: string | null) => {
  return (
    <span className={getOrderStatusBadgeClass(status, ghnStatus)}>
      {getOrderStatusText(status, ghnStatus)}
    </span>
  );
};

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order }) => {
  if (!order) return null;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center text-green-700">
        Chi tiết đơn hàng
      </h2>

      {/* Thông tin đơn hàng */}
      <div className="bg-gray-50 rounded-2xl p-5 shadow-sm mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
          <p><span className="font-semibold">Mã đơn hàng:</span> {order.id}</p>
          <p><span className="font-semibold">Khách hàng:</span> {order.user.fullName}</p>
          <p><span className="font-semibold">Số điện thoại:</span> {order.phone}</p>
          <p><span className="font-semibold">Địa chỉ:</span> {order.address}</p>
          <p><span className="font-semibold">Phí vận chuyển:</span> {order.shippingFee ? `${order.shippingFee.toLocaleString("vi-VN")} ₫` : "0 ₫"}</p>
          {order.ghnOrderCode && <p><span className="font-semibold">Mã đơn GHN:</span> {order.ghnOrderCode}</p>}
          <p><span className="font-semibold">Ngày đặt:</span> {formatDateTime(order.orderDate)}</p>
          <p><span className="font-semibold">Trạng thái:</span> {getStatusBadge(order.orderStatus, order.ghnStatus)}</p>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="bg-white rounded-2xl shadow-md p-4">
        <h3 className="font-semibold text-lg mb-3 border-b pb-2">Danh sách sản phẩm</h3>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-2 rounded-tl-lg">Tên sản phẩm</th>
              <th className="border p-2 text-center">Giá</th>
              <th className="border p-2 text-center">Số lượng</th>
              <th className="border p-2 text-center rounded-tr-lg">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {order.orderDetails.map((item, index) => {
              const hasDiscount =
                item.product.discountedPrice &&
                item.product.discountedPrice < item.product.price;

              return (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="border p-3">{item.product.name}</td>
                  <td className="border p-3 text-center">
                    {hasDiscount ? (
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-gray-400 line-through text-xs">
                          {item.product.price.toLocaleString("vi-VN")} ₫
                        </span>
                        <span className="text-red-600 font-semibold">
                          {item.product.discountedPrice.toLocaleString("vi-VN")} ₫
                        </span>
                      </div>
                    ) : (
                      <span>{item.price.toLocaleString("vi-VN")} ₫</span>
                    )}
                  </td>
                  <td className="border p-3 text-center">{item.quantity}</td>
                  <td className="border p-3 text-center text-green-700 font-medium">
                    {item.totalPrice.toLocaleString("vi-VN")} ₫
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Tổng tiền */}
      <div className="text-right mt-6">
        <p className="text-xl font-bold text-gray-800">
          Tổng tiền:{" "}
          <span className="text-red-600">
            {order.totalPrice.toLocaleString("vi-VN")} ₫
          </span>
        </p>
      </div>
    </div>
  );
};
