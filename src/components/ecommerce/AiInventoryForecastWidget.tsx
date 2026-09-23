"use client";
import React, { useEffect, useState } from "react";
import envConfig from "@/config/envConfig";

// --- Vector SVG Icon Components ---
function CpuSparklesIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function AlertOctagonIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function AlertTriangleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function RefreshCwIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

function SpinnerIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

function CheckCircleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

interface ForecastItem {
  productId: string;
  productName: string;
  currentStock: number;
  sold30Days: number;
  dailySalesRate: number;
  daysRemaining: number;
  suggestedRestockQty: number;
  urgency: "Critical" | "Warning" | "Normal";
  aiAnalysisText: string;
}

export default function AiInventoryForecastWidget() {
  const [data, setData] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchForecast = async () => {
    try {
      setLoading(true);
      const baseUrl = envConfig.NEXT_PUBLIC_API_URL || "https://cua-hang-do-choi-be.onrender.com";
      const res = await fetch(`${baseUrl.replace(/\/$/, "")}/api/Ai/inventory-forecast`);
      const json = await res.json();
      if (json.success && json.result) {
        setData(json.result);
      }
    } catch (err) {
      console.error("Failed to fetch AI Inventory Forecast:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  const criticalCount = data.filter((x) => x.urgency === "Critical").length;
  const warningCount = data.filter((x) => x.urgency === "Warning").length;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm transition-all">
      {/* Widget Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 shadow-inner">
            <CpuSparklesIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 dark:text-white text-base tracking-tight">
                AI Dự báo Tồn kho & Cảnh báo Nhập hàng
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
                Machine Learning
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Phân tích tốc độ tiêu thụ 30 ngày gần nhất & dự đoán thời điểm cạn kho
            </p>
          </div>
        </div>

        {/* Status Badges & Refresh Action */}
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border border-red-200 dark:border-red-900/60">
              <AlertOctagonIcon className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              <span>{criticalCount} Báo động đỏ</span>
            </span>
          )}
          {warningCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60">
              <AlertTriangleIcon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{warningCount} Cảnh báo</span>
            </span>
          )}
          <button
            onClick={fetchForecast}
            disabled={loading}
            className="p-2 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700 active:scale-95 disabled:opacity-50"
            title="Cập nhật lại dự báo AI"
          >
            <RefreshCwIcon className={`w-4 h-4 ${loading ? "animate-spin text-indigo-600" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Body */}
      {loading ? (
        <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center gap-3">
          <SpinnerIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <span className="font-medium text-xs">AI đang phân tích dữ liệu bán hàng và lập mô hình dự báo...</span>
        </div>
      ) : data.length === 0 ? (
        <div className="py-10 text-center text-sm text-gray-400 dark:text-gray-500">
          Chưa có đủ dữ liệu đơn hàng trong 30 ngày để lập dự báo tồn kho.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-3.5">Sản phẩm</th>
                <th className="p-3.5 text-center">Tồn kho hiện tại</th>
                <th className="p-3.5 text-center">Đã bán (30 ngày)</th>
                <th className="p-3.5 text-center">Tốc độ (sp/ngày)</th>
                <th className="p-3.5 text-center">Dự kiến cạn kho</th>
                <th className="p-3.5 text-center">Đề xuất nhập thêm</th>
                <th className="p-3.5">Phân tích chi tiết từ AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
              {data.slice(0, 6).map((item) => (
                <tr key={item.productId} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                  {/* Product Name */}
                  <td className="p-3.5 font-bold text-gray-900 dark:text-gray-100 max-w-[200px] truncate">
                    {item.productName}
                  </td>

                  {/* Current Stock */}
                  <td className="p-3.5 text-center font-bold text-gray-900 dark:text-white">
                    {item.currentStock}
                  </td>

                  {/* Sold 30 Days */}
                  <td className="p-3.5 text-center font-medium text-gray-700 dark:text-gray-300">
                    {item.sold30Days}
                  </td>

                  {/* Daily Sales Speed */}
                  <td className="p-3.5 text-center font-bold text-indigo-600 dark:text-indigo-400">
                    {item.dailySalesRate}
                  </td>

                  {/* Days Remaining */}
                  <td className="p-3.5 text-center font-bold">
                    {item.daysRemaining > 300 ? (
                      <span className="inline-flex items-center gap-1 text-gray-400 font-normal">
                        <CheckCircleIcon className="w-3.5 h-3.5 text-gray-400" />
                        An toàn (&gt;90 ngày)
                      </span>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          item.urgency === "Critical"
                            ? "bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300"
                            : item.urgency === "Warning"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300"
                        }`}
                      >
                        {item.urgency === "Critical" && <AlertOctagonIcon className="w-3 h-3" />}
                        {item.urgency === "Warning" && <AlertTriangleIcon className="w-3 h-3" />}
                        {item.daysRemaining} ngày
                      </span>
                    )}
                  </td>

                  {/* Suggested Restock Qty */}
                  <td className="p-3.5 text-center">
                    {item.suggestedRestockQty > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
                        +{item.suggestedRestockQty}
                      </span>
                    ) : (
                      <span className="text-gray-400 font-medium">-</span>
                    )}
                  </td>

                  {/* AI Analysis Text */}
                  <td className="p-3.5 text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                    {item.aiAnalysisText}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
