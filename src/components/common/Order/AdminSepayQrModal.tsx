"use client";
import React, { useEffect, useState, useRef } from "react";
import { Modal } from "@/components/ui/modal";
import { PaymentService, SepayQrData } from "@/services/paymentService";

interface AdminSepayQrModalProps {
  isOpen: boolean;
  orderId: string | null;
  totalAmount?: number;
  onClose: () => void;
  onPaymentSuccess?: () => void;
}

export const AdminSepayQrModal: React.FC<AdminSepayQrModalProps> = ({
  isOpen,
  orderId,
  totalAmount,
  onClose,
  onPaymentSuccess,
}) => {
  const [qrData, setQrData] = useState<SepayQrData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Load QR data khi mở modal
  useEffect(() => {
    if (!isOpen || !orderId) {
      setQrData(null);
      setIsPaid(false);
      setImgSrc("");
      return;
    }

    let isMounted = true;
    const fetchQr = async () => {
      try {
        setLoading(true);
        const res = await PaymentService.getSepayQr(orderId);
        if (isMounted && res) {
          const data: SepayQrData = res.data || res.result || res;
          if (data) {
            setQrData(data);

            const bank = data.bank || data.bankCode || "MBBank";
            const acc = data.accountNumber || "0387261918";
            const amount = Math.round(data.amount || totalAmount || 0);
            const content = data.content || data.description || data.transactionCode || "";

            // Link QR SePay chuẩn
            const primaryQrUrl =
              data.qrUrl ||
              data.qrCodeUrl ||
              `https://qr.sepay.vn/img?bank=${bank}&acc=${acc}&amount=${amount}&des=${encodeURIComponent(content)}&template=compact`;

            setImgSrc(primaryQrUrl);

            if (data.isPaid) {
              setIsPaid(true);
            }
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải mã QR SePay:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchQr();

    return () => {
      isMounted = false;
    };
  }, [isOpen, orderId, totalAmount]);

  // Polling kiểm tra trạng thái thanh toán từ SePay
  useEffect(() => {
    if (!isOpen || !orderId || isPaid) return;

    pollingRef.current = setInterval(async () => {
      try {
        const res = await PaymentService.checkPaymentStatus(orderId);
        const data = res?.data || res?.result || res;
        if (data && (data.isPaid || data.paymentStatus === 1 || data.paymentStatus === "Đã_thanh_toán")) {
          setIsPaid(true);
          if (pollingRef.current) clearInterval(pollingRef.current);
          if (onPaymentSuccess) {
            setTimeout(() => {
              onPaymentSuccess();
            }, 1800);
          }
        }
      } catch (error) {
        console.warn("Polling payment status error:", error);
      }
    }, 2500);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [isOpen, orderId, isPaid, onPaymentSuccess]);

  const handleCopy = (text: string, field: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  // Dự phòng khi CDN SePay gặp vấn đề hoặc bị chặn CORS/Adblock
  const handleImageError = () => {
    if (!qrData) return;
    const bank = qrData.bank || qrData.bankCode || "MBBank";
    const acc = qrData.accountNumber || "0387261918";
    const amount = Math.round(qrData.amount || totalAmount || 0);
    const content = qrData.content || qrData.description || qrData.transactionCode || "";

    // Dự phòng qua vietqr.app hoặc img.vietqr.io
    const fallbackUrl = `https://vietqr.app/img?bank=${bank}&acc=${acc}&amount=${amount}&des=${encodeURIComponent(content)}&template=compact`;
    if (imgSrc !== fallbackUrl) {
      console.warn("Chuyển sang nguồn ảnh VietQR dự phòng:", fallbackUrl);
      setImgSrc(fallbackUrl);
    }
  };

  if (!isOpen) return null;

  const bankName = qrData?.bank || qrData?.bankCode || "MBBank";
  const accNumber = qrData?.accountNumber || "0387261918";
  const accName = qrData?.accountName || "NGUYEN KHANH VY";
  const amountVal = qrData?.amount || totalAmount || 0;
  const transferContent = qrData?.content || qrData?.description || qrData?.transactionCode || "";

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl w-full p-0 overflow-hidden">
      <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1H17a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold">Thanh Toán Bán Hàng - Quét Mã QR</h3>
              <p className="text-xs text-blue-100/90">Hệ thống SePay / VietQR tự động khớp lệnh 24/7</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/15 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500 font-medium">Đang tạo mã QR VietQR...</p>
            </div>
          ) : isPaid ? (
            <div className="py-10 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mb-4 text-emerald-600 ring-8 ring-emerald-50 dark:ring-emerald-900/20 animate-bounce">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Thanh Toán Thành Công!
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 max-w-sm mb-6">
                Đã nhận tiền từ khách hàng qua ngân hàng. Hệ thống đã tự động cập nhật đơn hàng sang trạng thái đã thanh toán.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl shadow-md transition-all"
              >
                Hoàn tất & Tiếp tục
              </button>
            </div>
          ) : qrData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* QR Image Box */}
              <div className="flex flex-col items-center">
                <div className="relative p-3 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-blue-300 dark:border-blue-900/60 shadow-inner group">
                  <div className="relative w-56 h-56 sm:w-60 sm:h-60 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                    {/* Corner Reticles */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-blue-600 z-10"></div>
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-blue-600 z-10"></div>
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-blue-600 z-10"></div>
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-blue-600 z-10"></div>

                    {/* QR Code Image */}
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt="VietQR SePay"
                        onError={handleImageError}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                        Đang tạo ảnh QR...
                      </div>
                    )}
                  </div>

                  {/* Realtime waiting indicator */}
                  <div className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 py-1.5 px-3 rounded-lg">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                    </span>
                    <span>Đang chờ khách quét mã thanh toán...</span>
                  </div>
                </div>
              </div>

              {/* Thông tin chuyển khoản */}
              <div className="flex flex-col gap-3">
                <div className="bg-gray-50 dark:bg-gray-800/80 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/60 space-y-3">
                  <div>
                    <span className="text-xs text-gray-400 dark:text-gray-400 block font-medium">Ngân hàng</span>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{bankName}</span>
                  </div>

                  <div>
                    <span className="text-xs text-gray-400 dark:text-gray-400 block font-medium">Số tài khoản</span>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-mono font-bold text-blue-600 dark:text-blue-400">
                        {accNumber}
                      </span>
                      <button
                        onClick={() => handleCopy(accNumber, "acc")}
                        className="text-xs px-2.5 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md font-medium text-gray-600 dark:text-gray-200 hover:bg-gray-100 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        {copiedField === "acc" ? "Đã chép" : "Sao chép"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-400 dark:text-gray-400 block font-medium">Chủ tài khoản</span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase">
                      {accName}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-gray-400 dark:text-gray-400 block font-medium">Số tiền thanh toán</span>
                    <span className="text-lg font-bold text-red-600">
                      {amountVal.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-gray-400 dark:text-gray-400 block font-medium">Nội dung chuyển khoản (bắt buộc)</span>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded">
                        {transferContent}
                      </span>
                      <button
                        onClick={() => handleCopy(transferContent, "des")}
                        className="text-xs px-2.5 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md font-medium text-gray-600 dark:text-gray-200 hover:bg-gray-100 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        {copiedField === "des" ? "Đã chép" : "Sao chép"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-gray-400 leading-relaxed italic">
                  * Khách hàng quét mã bằng bất kỳ ứng dụng ngân hàng hoặc ví điện tử nào. Hệ thống tự động ghi nhận khi tiền vào tài khoản.
                </div>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-sm text-red-500">
              Không thể tải dữ liệu QR thanh toán cho đơn hàng này.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  );
};
