"use client";

import Image from "next/image";
type WarehouseItemProps = {
  id: string;
  image?: string;
  productName: string;
  supplierName: string;
  quantity: number;
  price: number;
  removeFromWarehouse: () => void;
}
export const WarehouseItem = (item:WarehouseItemProps) => {
  const total = item.price * item.quantity;

  return (
    <div className="flex items-center justify-between w-full border-b border-gray-200 dark:border-gray-700 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
      {/* --- Cột 1: Ảnh sản phẩm --- */}
      <div className="flex-shrink-0">
        <div className="w-14 h-14 rounded-md overflow-hidden border border-gray-200 dark:border-gray-600">
          <Image
            width={56}
            height={56}
            src={item.image ? item.image : "/images/user/owner.jpg"}
            alt="Sản phẩm 1"
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* --- Cột 2: Thông tin sản phẩm --- */}
      <div className="flex flex-col flex-1 mx-3">
        <h3 className="text-sm font-medium text-gray-800 dark:text-white/90 truncate">
          {item.productName}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Nhà cung cấp: <span className="font-medium">{item.supplierName}</span>
        </p>

        <div className="flex items-center space-x-2 mt-1">
          <p className="text-xs text-gray-400">
            {item.price.toLocaleString()}đ
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-300">
            ×{item.quantity}
          </p>
        </div>
      </div>

      {/* --- Cột 3: Tổng tiền + nút xoá --- */}
      <div className="flex flex-col items-end">
        <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
          {total.toLocaleString()}đ
        </p>
        <button
          className="mt-2 w-6 h-6 flex items-center justify-center rounded-full bg-red-600 text-[11px] text-white hover:bg-red-700 transition"
          onClick={item.removeFromWarehouse}
        >
          ✕
        </button>
      </div>
    </div>
  );
};
