"use client";

import { useOrder } from "@/context/OrderContext";
import { ProductType } from "@/schemaValidations/product.schema";
import Image from "next/image";
import { useState } from "react";

export const ProductItemOrder = ({ item }: { item: ProductType }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useOrder();

  // ✅ Tính giảm giá (nếu có khuyến mãi)
  const discountPercent = item.promotion?.discountPercent ?? 0;
  const originalPrice = item.price;
  const discountedPrice =
    discountPercent > 0
      ? originalPrice * (1 - discountPercent / 100)
      : originalPrice;

  // ✅ Trạng thái tồn kho
  const stockQuantity = item.quantity ?? 0;
  const inStock = stockQuantity > 0;
  const stockStatusColor =
    stockQuantity > 20
      ? "text-green-600"
      : stockQuantity > 5
      ? "text-yellow-600"
      : "text-red-600";

  // ✅ Ảnh sản phẩm
  const imageUrl =
    item.image && item.image.length > 0
      ? item.image[0]
      : "/images/no-image.png"; // fallback ảnh mặc định

  // ✅ Xử lý thay đổi số lượng
  const handleIncrease = () => setQuantity(quantity + 1);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (val >= 0) setQuantity(val);
  };

  // ✅ Thêm vào giỏ hàng
  const handleAddToCart = () => {
    addToCart(item, quantity); // ✅ Gọi context thay vì alert
  };

  return (
    <div className="w-44 rounded-xl shadow-md bg-white dark:bg-gray-800 overflow-hidden flex flex-col transition-transform hover:scale-[1.02] duration-200">
      {/* Ảnh sản phẩm */}
      <div className="relative h-40">
        <Image
          src={imageUrl}
          alt={item.productName}
          width={180}
          height={200}
          className="object-cover w-full h-full"
        />

        {/* Nhãn khuyến mãi */}
        {discountPercent > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-md">
            -{discountPercent}%
          </span>
        )}

        {/* Trạng thái hàng hóa */}
        <span
          className={`absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded-md ${
            inStock
              ? "bg-green-500 text-white"
              : "bg-gray-400 text-white line-through"
          }`}
        >
          {inStock ? "Còn hàng" : "Hết hàng"}
        </span>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="flex flex-col justify-between flex-1 px-2 py-2">
        <div>
          <span className="text-xs font-semibold text-gray-800 dark:text-white block truncate">
            {item.productName}
          </span>
          <span className="text-[11px] text-gray-500 block truncate">
            Nhà cung cấp: {item.supplier?.name ?? "Không rõ"}
          </span>

          {/* Giá tiền */}
          <div className="mt-1">
            {discountPercent > 0 && (
              <span className="text-[11px] text-gray-400 line-through mr-1">
                {originalPrice.toLocaleString("vi-VN")}₫
              </span>
            )}
            <span className="text-sm text-red-500 font-semibold">
              {discountedPrice.toLocaleString("vi-VN")}₫
            </span>
          </div>

          {/* Số lượng trong kho */}
          <div className={`text-[11px] mt-1 ${stockStatusColor}`}>
            Còn {stockQuantity} sản phẩm trong kho
          </div>
        </div>

        {/* Số lượng + Giỏ hàng */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={quantity}
              onChange={handleChange}
              className="w-10 border border-gray-300 rounded-md text-center text-[11px] py-0.5 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleIncrease}
              className="px-2 py-0.5 bg-green-500 hover:bg-green-600 text-white text-[11px] rounded-md"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`text-[11px] px-2 py-1 rounded-md ${
              inStock
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            🛒 Thêm
          </button>
        </div>
      </div>
    </div>
  );
};
