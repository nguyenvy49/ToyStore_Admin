"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { OrderService } from "@/services/orderService";
import { GhnFrontendService } from "@/services/ghnService";
import { OrderType } from "@/schemaValidations/order.schema";
import { formatCurrency, formatDateTime } from "@/utils/format";
import { getOrderStatusText, getOrderStatusBadgeClass } from "@/utils/ghnStatusHelper";
import { 
  FaTruck, FaCheckCircle, FaExclamationTriangle, 
  FaArrowLeft, FaSync, FaLock, FaCheck, FaSearch
} from "react-icons/fa";

// Thứ tự tiến trình 1 chiều chuẩn của GHN
const PIPELINE_STEPS = [
  { code: "ready_to_pick", name: "Chờ lấy hàng", desc: "Mới tạo đơn, chờ bưu tá lấy" },
  { code: "picking", name: "Đang lấy hàng", desc: "Bưu tá đang đến lấy hàng" },
  { code: "picked", name: "Đã lấy hàng", desc: "Bưu tá đã nhận hàng về kho" },
  { code: "storing", name: "Nhập kho bưu cục", desc: "Hàng đã nhập kho bưu cục phát" },
  { code: "transporting", name: "Đang luân chuyển", desc: "Đang trung chuyển liên kho" },
  { code: "sorting", name: "Đang phân loại", desc: "Đang phân loại tại Hub" },
  { code: "delivering", name: "Đang giao hàng", desc: "Shipper đang đi phát hàng" },
  { code: "delivered", name: "Đã giao hàng", desc: "Giao thành công cho khách (Hoàn tất)" },
];

const TERMINAL_STATUSES = ["delivered", "cancel", "returned"];

const STATUS_INDEX_MAP: Record<string, number> = {
  ready_to_pick: 1,
  picking: 2,
  money_collect_picking: 2,
  picked: 3,
  storing: 4,
  transporting: 5,
  sorting: 6,
  delivering: 7,
  money_collect_delivering: 7,
  delivered: 8,
};

function GhnStandaloneContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryOrderCode = searchParams.get("orderCode") || "";
  const queryOrderId = searchParams.get("orderId") || "";

  // State
  const [orderCodeInput, setOrderCodeInput] = useState<string>(queryOrderCode || "");
  const [searching, setSearching] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [targetStatus, setTargetStatus] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; msg: string } | null>(null);

  // Hàm tìm kiếm đơn theo mã người dùng nhập vào
  const handleSearchOrder = async (searchCode?: string) => {
    const code = (searchCode ?? orderCodeInput).trim();
    if (!code) {
      setFeedback({ type: "error", msg: "Vui lòng nhập Mã vận đơn GHN hoặc Mã đơn hàng!" });
      return;
    }

    setSearching(true);
    setFeedback(null);

    try {
      const res = await OrderService.getListOrder("/api/Order/all?PageSize=100");
      if (res?.result?.items) {
        const codeUpper = code.toUpperCase();
        const codeLower = code.toLowerCase();

        const match = res.result.items.find(
          (o) =>
            (o.ghnOrderCode && o.ghnOrderCode.toUpperCase() === codeUpper) ||
            o.id.toLowerCase() === codeLower ||
            o.id.toLowerCase().startsWith(codeLower)
        );

        if (match) {
          setSelectedOrder(match);
          setOrderCodeInput(match.ghnOrderCode || codeUpper);

          // Gợi ý bước tiếp theo
          const curStatus = (match.ghnStatus || "ready_to_pick").toLowerCase().trim();
          const curIdx = STATUS_INDEX_MAP[curStatus] || 1;
          const next = PIPELINE_STEPS.find((s) => (STATUS_INDEX_MAP[s.code] || 0) > curIdx);
          setTargetStatus(next && !TERMINAL_STATUSES.includes(curStatus) ? next.code : "");
          setFeedback(null);
        } else {
          setSelectedOrder(null);
          setFeedback({
            type: "error",
            msg: `Không tìm thấy đơn hàng nào khớp với mã "${code}". Vui lòng kiểm tra lại.`,
          });
        }
      }
    } catch (err) {
      setFeedback({ type: "error", msg: "Lỗi kết nối máy chủ khi tìm kiếm đơn hàng." });
    } finally {
      setSearching(false);
    }
  };

  // Tự động tìm kiếm nếu vào trang có sẵn query param
  useEffect(() => {
    const initialCode = queryOrderCode || queryOrderId;
    if (initialCode) {
      setOrderCodeInput(initialCode);
      handleSearchOrder(initialCode);
    }
  }, [queryOrderCode, queryOrderId]);

  // Trạng thái hiện tại của đơn hàng
  const currentStatus = useMemo(() => {
    if (!selectedOrder) return "ready_to_pick";
    return (selectedOrder.ghnStatus || "ready_to_pick").toLowerCase().trim();
  }, [selectedOrder]);

  const currentIndex = STATUS_INDEX_MAP[currentStatus] || 1;
  const isTerminal = TERMINAL_STATUSES.includes(currentStatus);

  // Kiểm tra 1 trạng thái có được chọn hay không (1 chiều)
  const isStatusAllowed = (statusCode: string) => {
    if (!selectedOrder || isTerminal) return false;
    if (statusCode === currentStatus) return false;
    const targetIdx = STATUS_INDEX_MAP[statusCode];
    if (!targetIdx) return false;
    // Trạng thái đã qua không quay về được
    return targetIdx > currentIndex;
  };

  // Cập nhật trạng thái
  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    if (isTerminal) {
      setFeedback({
        type: "error",
        msg: `Đơn hàng đã ở trạng thái kết thúc (${currentStatus}). Không thể cập nhật thêm.`,
      });
      return;
    }

    if (!targetStatus || !isStatusAllowed(targetStatus)) {
      setFeedback({
        type: "error",
        msg: "Vui lòng chọn một trạng thái hợp lệ tiếp theo (không được chọn trạng thái cũ).",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const stepObj = PIPELINE_STEPS.find((s) => s.code === targetStatus);
    const desc = stepObj?.desc || `Cập nhật trạng thái GHN sang ${targetStatus}`;
    const codeToSend = selectedOrder.ghnOrderCode || orderCodeInput || `DEV_${selectedOrder.id.slice(0, 8)}`;

    const payload = {
      ShopID: 196560,
      Time: new Date().toISOString(),
      OrderCode: codeToSend,
      ClientOrderCode: selectedOrder.id,
      Type: "switch_status",
      Description: desc,
      Status: targetStatus,
      CODAmount: selectedOrder.totalPrice || 0,
      TotalFee: selectedOrder.shippingFee || 32000,
      Warehouse: "Bưu cục GHN Cầu Giấy (HN-CG-01)",
      ShipperName: "Trần Văn Giao",
      ShipperPhone: "0988123456",
    };

    try {
      const res = await GhnFrontendService.sendWebhook(payload);
      if (res.success) {
        const newStatusName = stepObj?.name || targetStatus;
        setFeedback({
          type: "success",
          msg: `✅ Đã cập nhật trạng thái thành công sang "${newStatusName}". Khách hàng đã nhận được thông báo realtime!`,
        });

        // Cập nhật state đơn hàng ngay trên UI
        setSelectedOrder({
          ...selectedOrder,
          ghnStatus: targetStatus,
          ghnOrderCode: codeToSend,
        });

        // Gợi ý bước kế tiếp
        const newIdx = STATUS_INDEX_MAP[targetStatus] || 0;
        const nextStep = PIPELINE_STEPS.find((s) => (STATUS_INDEX_MAP[s.code] || 0) > newIdx);
        setTargetStatus(nextStep && !TERMINAL_STATUSES.includes(targetStatus) ? nextStep.code : "");
      } else {
        setFeedback({
          type: "error",
          msg: res.error || "Gửi webhook thất bại, máy chủ không phản hồi.",
        });
      }
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message || "Lỗi kết nối khi gửi webhook." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-gray-800 antialiased">
      {/* HEADER TOPBAR GHN (KHÔNG CÓ SIDEBAR) */}
      <header className="bg-[#001e3d] text-white border-b-4 border-[#f26522] sticky top-0 z-30 shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f26522] rounded-lg flex items-center justify-center text-white font-black text-xl shadow-xs">
              GHN
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-wide uppercase text-white">
                  GHN Express
                </span>
                <span className="bg-[#f26522] text-[10px] font-bold px-2 py-0.5 rounded text-white uppercase">
                  Điều Phối Vận Đơn
                </span>
              </div>
              <p className="text-[11px] text-sky-200">
                Cổng Cập Nhật Trạng Thái Nội Bộ (Độc lập • Không Sidebar)
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push("/orders")}
            className="px-3.5 py-1.5 bg-[#002d5b] hover:bg-[#003d7b] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border border-sky-900/60"
          >
            <FaArrowLeft />
            <span>Về Admin Shop</span>
          </button>
        </div>
      </header>

      {/* BODY CONTAINER */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4">
        {/* THÔNG BÁO PHẢN HỒI */}
        {feedback && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2.5 transition ${
              feedback.type === "success"
                ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                : feedback.type === "error"
                ? "bg-rose-50 border-rose-300 text-rose-800"
                : "bg-blue-50 border-blue-300 text-blue-800"
            }`}
          >
            {feedback.type === "success" ? (
              <FaCheckCircle className="text-emerald-600 text-base shrink-0" />
            ) : (
              <FaExclamationTriangle className="text-rose-600 text-base shrink-0" />
            )}
            <span>{feedback.msg}</span>
          </div>
        )}

        {/* 1. INPUT TÌM KIẾM THEO MÃ VẬN ĐƠN (ENTER ĐỂ TÌM) */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200 p-5 space-y-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Mã vận đơn GHN (OrderCode):
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                autoFocus
                value={orderCodeInput}
                onChange={(e) => setOrderCodeInput(e.target.value.trim().toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearchOrder();
                  }
                }}
                placeholder="Nhập mã vận đơn (VD: L8YTTP, DEV_... hoặc Mã đơn) rồi nhấn Enter..."
                className="w-full text-sm font-mono font-bold uppercase border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#f26522] focus:border-transparent outline-none transition"
              />
            </div>
            <button
              type="button"
              disabled={searching || !orderCodeInput.trim()}
              onClick={() => handleSearchOrder()}
              className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center gap-2 transition ${
                searching || !orderCodeInput.trim()
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#f26522] hover:bg-[#d9531e] shadow-xs active:scale-[0.98]"
              }`}
            >
              {searching ? (
                <>
                  <FaSync className="animate-spin" />
                  <span>Đang tìm...</span>
                </>
              ) : (
                <>
                  <FaSearch />
                  <span>Tìm đơn (Enter)</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-gray-400">
            Gợi ý: Nhập mã vận đơn GHN hoặc mã đơn hàng Shop, sau đó nhấn <strong>Enter</strong> để nạp thông tin đơn.
          </p>
        </div>

        {/* 2. THẺ THÔNG TIN ĐƠN HÀNG KHI TÌM THẤY */}
        {selectedOrder ? (
          <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden space-y-4">
            <div className="bg-gray-50/80 px-5 py-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-500">Mã GHN:</span>
                <span className="font-mono font-black text-sm text-[#f26522] bg-orange-100 px-2.5 py-0.5 rounded">
                  {selectedOrder.ghnOrderCode || orderCodeInput || "Chưa có"}
                </span>
                <span className="text-gray-300 mx-1">|</span>
                <span className="text-gray-500">Mã đơn Shop:</span>
                <span className="font-mono text-gray-700 font-semibold">{selectedOrder.id}</span>
              </div>
              <span className="text-gray-400 text-[11px]">
                Ngày tạo: {formatDateTime(selectedOrder.orderDate)}
              </span>
            </div>

            <div className="px-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-gray-400 block text-[11px]">Khách hàng nhận:</span>
                <strong className="text-gray-900 text-sm block mt-0.5">
                  {selectedOrder.user?.fullName || "Khách mua lẻ"}
                </strong>
                <span className="text-gray-600 block mt-0.5">SĐT: {selectedOrder.phone || "---"}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-gray-400 block text-[11px]">Địa chỉ giao:</span>
                <span className="text-gray-800 line-clamp-2 mt-0.5 font-medium">
                  {selectedOrder.address || "Chưa có địa chỉ"}
                </span>
              </div>
              <div className="bg-orange-50/70 p-3 rounded-xl border border-orange-200">
                <span className="text-[#f26522] block text-[11px] font-bold">Tiền thu hộ COD:</span>
                <strong className="text-base font-black text-red-600 block mt-0.5">
                  {formatCurrency(selectedOrder.totalPrice)}
                </strong>
              </div>
            </div>

            {/* Trạng thái hiện tại */}
            <div className="px-5 pb-1 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-700">Trạng thái hiện tại:</span>
                <span className={getOrderStatusBadgeClass(selectedOrder.orderStatus, selectedOrder.ghnStatus)}>
                  {getOrderStatusText(selectedOrder.orderStatus, selectedOrder.ghnStatus)}
                </span>
                <span className="font-mono text-gray-400 text-[11px]">({currentStatus})</span>
              </div>
              {isTerminal && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                  <FaLock className="text-[10px]" />
                  Đơn đã kết thúc ({currentStatus}) - Không thể cập nhật
                </span>
              )}
            </div>

            {/* 3. BẢNG TIẾN TRÌNH CẬP NHẬT TRẠNG THÁI (1 CHIỀU) */}
            <div className="p-5 pt-3 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Chọn trạng thái tiếp theo để cập nhật:
                </span>
                <span className="text-[11px] text-gray-400">
                  Trạng thái đã qua không thể quay lại • Đã giao không thể đổi
                </span>
              </div>

              {/* Danh sách các bước */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {PIPELINE_STEPS.map((step, idx) => {
                  const stepIndex = idx + 1;
                  const isPast = stepIndex < currentIndex;
                  const isCurrent = step.code === currentStatus;
                  const isSelected = targetStatus === step.code;
                  const allowed = isStatusAllowed(step.code);

                  let cardStyle = "";
                  if (isCurrent) {
                    cardStyle = "bg-orange-50 border-orange-400 ring-2 ring-orange-400/20";
                  } else if (isPast) {
                    cardStyle = "bg-gray-100/70 border-gray-200 opacity-50 cursor-not-allowed";
                  } else if (isSelected) {
                    cardStyle = "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/30 shadow-xs";
                  } else if (allowed) {
                    cardStyle = "bg-white border-gray-200 hover:border-[#f26522] hover:bg-orange-50/20 cursor-pointer";
                  } else {
                    cardStyle = "bg-gray-50 border-gray-200 opacity-40 cursor-not-allowed";
                  }

                  return (
                    <button
                      key={step.code}
                      type="button"
                      disabled={!allowed}
                      onClick={() => {
                        if (allowed) setTargetStatus(step.code);
                      }}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between min-h-[85px] ${cardStyle}`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-xs font-bold text-gray-900">{step.name}</span>
                          {isPast && (
                            <span className="text-[10px] text-gray-500 flex items-center gap-1 font-medium">
                              <FaCheck className="text-emerald-600 text-[9px]" />
                              <span>Đã qua</span>
                            </span>
                          )}
                          {isCurrent && (
                            <span className="text-[10px] font-bold text-[#f26522] bg-orange-100 px-1.5 py-0.5 rounded">
                              Hiện tại
                            </span>
                          )}
                          {isSelected && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <FaCheckCircle className="text-[10px]" />
                              Chọn
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 leading-snug line-clamp-2">
                          {step.desc}
                        </p>
                      </div>

                      <div className="mt-2 text-[10px] font-mono text-gray-400 flex items-center justify-between">
                        <span>{step.code}</span>
                        <span>{stepIndex}/8</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Thông báo khóa khi đã giao thành công */}
              {currentStatus === "delivered" && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 font-medium">
                  <FaCheckCircle className="text-emerald-600 text-base shrink-0" />
                  <span>
                    Đơn hàng đã được giao thành công cho khách hàng (<strong>delivered</strong>). Đã hoàn tất hành trình và bị khóa vĩnh viễn, không thể cập nhật trạng thái khác nữa.
                  </span>
                </div>
              )}

              {/* Nút Cập nhật trạng thái */}
              {!isTerminal && (
                <div className="pt-2">
                  <button
                    type="button"
                    disabled={isSubmitting || !targetStatus || !isStatusAllowed(targetStatus)}
                    onClick={handleUpdateStatus}
                    className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm text-white shadow-xs flex items-center justify-center gap-2 transition ${
                      isSubmitting || !targetStatus || !isStatusAllowed(targetStatus)
                        ? "bg-gray-300 cursor-not-allowed text-gray-500 shadow-none"
                        : "bg-[#f26522] hover:bg-[#d9531e] active:scale-[0.99] shadow-orange-500/20"
                    }`}
                  >
                    <FaTruck />
                    <span>
                      {isSubmitting
                        ? "Đang gửi webhook cập nhật trạng thái..."
                        : targetStatus
                        ? `CẬP NHẬT TRẠNG THÁI ➔ ${
                            PIPELINE_STEPS.find((s) => s.code === targetStatus)?.name?.toUpperCase() ||
                            targetStatus.toUpperCase()
                          }`
                        : "HÃY CLICK CHỌN 1 TRẠNG THÁI KẾ TIẾP Ở TRÊN"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-center space-y-2">
            <div className="w-12 h-12 bg-orange-50 text-[#f26522] rounded-full flex items-center justify-center mx-auto text-xl">
              <FaTruck />
            </div>
            <h3 className="font-bold text-sm text-gray-800">Chưa có đơn hàng nào được chọn</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              Vui lòng nhập Mã vận đơn GHN vào ô tìm kiếm ở trên và nhấn <strong>Enter</strong> để hiển thị thông tin và cập nhật trạng thái.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function GhnSimulatorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-4 border-[#f26522] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-gray-500">Đang tải GHN Dispatch...</p>
          </div>
        </div>
      }
    >
      <GhnStandaloneContent />
    </Suspense>
  );
}
