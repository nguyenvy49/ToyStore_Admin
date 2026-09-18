"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { formatDateTime } from "@/utils/format";
import Image from "next/image";

interface NewsDetailProps {
  id: string;
  onHandle: (id: string) => Promise<any>;
  closeModal: () => void;
}

interface NewsDetail {
  title: string;
  content: string;
  author: string;
  createdAt: string;
  approvedBy: string | null;
  imageUrl?: string;
  isApproved: boolean;
}

export default function ModelDetailNews({
  id,
  onHandle,
  closeModal,
}: NewsDetailProps) {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<NewsDetail | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await onHandle(id);
        console.log("📦 Dữ liệu thật bên trong:", res?.result || res);

        const data = res?.result || res?.data || res || null;

        if (data) {
          const mapped: NewsDetail = {
            title: data.title || "Không có tiêu đề",
            content: data.content || "<p>Không có nội dung hiển thị.</p>",
            author: data.createdByStr || data.createdBy || "Không rõ",
            createdAt: data.createdOn || data.createdAt || "",
            approvedBy: data.approvedByName || data.approvedBy || "Chưa duyệt",
            imageUrl: (() => {
              try {
                if (typeof data.image === "string" && data.image.startsWith("[")) {
                  const arr = JSON.parse(data.image);
                  return Array.isArray(arr) && arr.length > 0 ? arr[0] : "";
                }
                return data.image || data.imageUrl || "";
              } catch {
                return "";
              }
            })(),
            isApproved: data.isApproved ?? false,
          };

          setNews(mapped);
        } else {
          console.warn("⚠️ Không có dữ liệu hợp lệ trong phản hồi API!");
          setNews(null);
        }
      } catch (error) {
        console.error("❌ Lỗi khi tải dữ liệu chi tiết tin tức:", error);
        setNews(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchNews();
  }, [id, onHandle]);

  return (
    <Modal
      isOpen={true}
      onClose={closeModal}
      className="max-w-4xl w-full max-h-[85vh] overflow-y-auto p-6 bg-white dark:bg-gray-900 rounded-2xl scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
    >
      {loading ? (
        <div className="flex items-center justify-center h-60">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <div className="w-5 h-5 border-2 border-t-transparent border-gray-400 rounded-full animate-spin" />
            <span>Đang tải dữ liệu tin tức...</span>
          </div>
        </div>
      ) : !news ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          Không tìm thấy thông tin tin tức.
          <div className="mt-4">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Đóng
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* --- Thông tin chi tiết --- */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              📋 Thông tin chi tiết
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">Tác giả</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {news.author}
                </p>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">Ngày tạo</p>
                <p className="text-gray-900 dark:text-white">
                  {news.createdAt
                    ? formatDateTime(news.createdAt)
                    : "Không rõ"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">
                  Người duyệt
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {news.approvedBy || "Chưa duyệt"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">
                  Trạng thái
                </p>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${news.isApproved
                      ? "bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300"
                    }`}
                >
                  {news.isApproved ? "Đã duyệt" : "Chưa duyệt"}
                </span>
              </div>
            </div>
          </div>

          {/* --- Tiêu đề + Ảnh + Nội dung --- */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              📰 {news.title}
            </h2>

            {news.imageUrl && (
              <div className="flex justify-center mb-4">
                <Image
                  src={news.imageUrl}
                  alt={news.title}
                  width={500}
                  height={300}
                  onError={(e) =>
                  ((e.target as HTMLImageElement).src =
                    "/images/default-news.jpg")
                  }
                  className="rounded-xl max-h-[350px] w-auto object-cover shadow"
                />
              </div>
            )}

            <div
              className="prose prose-sm max-w-none text-gray-800 dark:text-gray-200 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html:
                  news.content && news.content.trim() !== ""
                    ? news.content
                    : "<p>Không có nội dung hiển thị.</p>",
              }}
            />
          </div>

          <div className="flex justify-end mt-4">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Đóng
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
