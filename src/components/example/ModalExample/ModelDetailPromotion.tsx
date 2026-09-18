"use client";
import Button from "@/components/ui/button/Button";
import { formatDateTime } from "@/utils/format";
import React, { useEffect, useState } from "react";

interface ProductPromotion {
  id: string;
  name: string;
  price: number;
  discountedPrice: number;
}

interface PromotionDetailProps {
  id: string;
  onHandle: (id: string) => Promise<any>;
  closeModal: () => void;
}

interface PromotionDetail {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  discountPercent: number;
  isApproved: boolean;
  products: ProductPromotion[];
}

export default function ModelDetailPromotion({
  id,
  onHandle,
  closeModal,
}: PromotionDetailProps) {
  const [loading, setLoading] = useState(true);
  const [promotion, setPromotion] = useState<PromotionDetail | null>(null);

  // Gọi API khi component mount hoặc id thay đổi
  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        setLoading(true);
        const res = await onHandle(id);
        if (res.success) {
          const data = res.result;
          const mapped: PromotionDetail = {
            title: data.title,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate,
            discountPercent: data.discountPercent,
            isApproved: data.isApproved,
            products: data.products?.map((item: any) => ({
              id: item.id,
              name: item.name,
              price: item.price,
              discountedPrice: item.discountedPrice,
            })) || [],
          };
          setPromotion(mapped);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotion();
  }, [id, onHandle]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-60">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <div className="w-5 h-5 border-2 border-t-transparent border-gray-400 rounded-full animate-spin" />
          <span>Đang tải dữ liệu khuyến mãi...</span>
        </div>
      </div>
    );
  }

  if (!promotion) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        Không tìm thấy thông tin khuyến mãi.
        <div className="mt-4">
          <Button size="sm" variant="outline" onClick={closeModal}>
            Đóng
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* --- Sản phẩm áp dụng --- */}
      <div className="border min-w-[350px] border-gray-200 rounded-2xl p-6 shadow-md bg-white">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          🛒 Sản phẩm áp dụng
        </h2>

        {promotion.products.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-base italic">
            Không có sản phẩm áp dụng.
          </p>
        ) : (
          <div className="max-h-[250px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    <th className="p-3 text-left font-semibold">Tên sản phẩm</th>
                    <th className="p-3 text-right font-semibold">Giá gốc</th>
                    <th className="p-3 text-right font-semibold">Giá sau giảm</th>
                  </tr>
                </thead>
                <tbody>
                  {promotion.products.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                    >
                      <td className="p-3 text-gray-900 dark:text-white text-base">
                        {item.name}
                      </td>
                      <td className="p-3 text-right text-gray-500 dark:text-gray-400 text-base">
                        {item.price.toLocaleString()} ₫
                      </td>
                      <td className="p-3 text-right font-semibold text-green-600 dark:text-green-400 text-base">
                        {item.discountedPrice.toLocaleString()} ₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* --- Thông tin khuyến mãi --- */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm bg-white dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          🎉 Thông tin khuyến mãi
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">Tên khuyến mãi</p>
            <p className="font-medium text-gray-900 dark:text-white">{promotion.title}</p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">Phần trăm khuyến mãi</p>
            <p className="font-semibold text-green-600 dark:text-green-400">
              {promotion.discountPercent}%
            </p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">Ngày bắt đầu</p>
            <p className="text-gray-900 dark:text-white">
              {formatDateTime(promotion.startDate)}
            </p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">Ngày kết thúc</p>
            <p className="text-gray-900 dark:text-white">
              {formatDateTime(promotion.endDate)}
            </p>
          </div>

          <div className="col-span-1 sm:col-span-2">
            <p className="text-gray-500 dark:text-gray-400 mb-1">Mô tả</p>
            <div
              className="text-gray-800 dark:text-gray-200 leading-relaxed text-sm"
              dangerouslySetInnerHTML={{
                __html: promotion.description || "<p>Không có mô tả.</p>",
              }}
            />
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">Trạng thái duyệt</p>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                promotion.isApproved
                  ? "bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300"
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300"
              }`}
            >
              {promotion.isApproved ? "Đã duyệt" : "Chưa duyệt"}
            </span>
          </div>
        </div>

        <div className="flex w-full justify-end mt-4">
          <Button size="sm" variant="outline" onClick={closeModal}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
}
