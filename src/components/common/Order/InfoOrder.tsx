"use client";

import { useOrder } from "@/context/OrderContext";
import Button from "../../ui/button/Button";
import { OrderItem } from "./OrderItem";
import { NoData } from "../NoData";
import Form from "@/components/form/Form";
import InputForm from "@/components/form/form-elements/InputForm";
import { useState } from "react";
import { FaRegSmileBeam } from "react-icons/fa";
import { OrderService } from "@/services/orderService";
import { useNotification } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";
import { useFormContext } from "@/context/FormContext";
import { AdminSepayQrModal } from "./AdminSepayQrModal";

export const InfoOrder = () => {
  const { cart, totalPrice, removeFromCart, clearCart } = useOrder();
  const { openNotification } = useNotification();
  const route = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"sepay" | "cash">("sepay");
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const { values, setErrors } = useFormContext();

  const handleSubmit = async (data: Record<string, any>) => {
    const newErrors: { name: string; message: string }[] = [];

    // validate text fields
    if (!values.phone) newErrors.push({ name: "phone", message: "Không được để trống số điện thoại." });
    if (!values.address) newErrors.push({ name: "address", message: "Không được để trống địa chỉ." });
    setErrors(newErrors);

    if (newErrors.length <= 0) {
      try {
        setLoading(true);
        if (cart.length > 0) {
          // Tạo mảng Products
          const products = cart.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          }));
          const finalData = {
            ...data,
            products,
          };
          const res = await OrderService.createOrder(finalData);
          console.log("Create order response:", res);

          if (res && res.success) {
            const orderId =
              (res as any)?.result?.id ||
              (res as any)?.data?.id ||
              (res as any)?.id;

            clearCart();

            if (paymentMethod === "sepay" && orderId) {
              setCreatedOrderId(orderId);
              setIsQrModalOpen(true);
              openNotification({
                message: "Tạo đơn thành công",
                description: "Vui lòng hướng dẫn khách quét mã QR để thanh toán.",
                placement: "top",
                duration: 3,
                icon: <FaRegSmileBeam style={{ color: "#2563eb" }} />,
                style: { borderLeft: "5px solid #2563eb" },
              });
            } else {
              openNotification({
                message: "Thành công",
                description: "Đơn hàng đã được thêm thành công (Tiền mặt)!",
                placement: "top",
                duration: 3,
                icon: <FaRegSmileBeam style={{ color: "green" }} />,
                style: { borderLeft: "5px solid green" },
              });
              route.push("/orders");
            }
          } else {
            openNotification({
              message: "Thất bại",
              description: "Không thể thêm đơn hàng. Vui lòng thử lại!",
              placement: "top",
              duration: 3,
              style: { borderLeft: "5px solid red" },
            });
            setLoading(false);
          }
        } else {
          openNotification({
            message: "Cảnh báo",
            description: "Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán!",
            placement: "top",
            duration: 3,
            icon: <FaRegSmileBeam style={{ color: "red" }} />,
            style: { borderLeft: "5px solid red" },
          });
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Lỗi tạo đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("❌ Errors:", newErrors);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Danh sách sản phẩm trong giỏ */}
      <div className="flex flex-col space-y-3">
        {cart.length > 0 ? (
          cart.map((item) => (
            <OrderItem
              key={item.product.id}
              name={item.product.productName}
              supplier={item.product.supplier?.name ?? "Không rõ"}
              image={item.product.image?.[0] ?? "/images/no-image.png"}
              price={item.product.price}
              discountPrice={item.product.promotion ?? item.product.price}
              quantity={item.quantity}
              onRemove={() => removeFromCart(item.product.id)}
            />
          ))
        ) : (
          <NoData title="Chưa có sản phẩm nào trong đơn hàng" />
        )}
      </div>

      {/* Tổng tiền + form thanh toán */}
      <div className="w-full border-t border-gray-200 dark:border-gray-700 pt-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Tổng tiền:
          </p>
          <p className="text-xl font-bold text-red-600">
            {totalPrice.toLocaleString("vi-VN")} ₫
          </p>
        </div>

        {/* Form thanh toán */}
        <div className="max-w-md w-full mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow p-5">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Thông tin thanh toán
          </h2>
          <Form onSubmit={handleSubmit} method="POST" className="space-y-4">
            <InputForm
              type="phone"
              label="Số điện thoại"
              name="phone"
              placeholder="Nhập số điện thoại"
            />
            <InputForm
              label="Địa chỉ"
              name="address"
              placeholder="Nhập địa chỉ giao hàng"
            />

            {/* Chọn phương thức thanh toán */}
            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2.5">
                Phương thức thanh toán
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {/* Quét mã QR SePay */}
                <div
                  onClick={() => setPaymentMethod("sepay")}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "sepay"
                      ? "border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 ring-1 ring-blue-600 shadow-sm"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-300 bg-white dark:bg-gray-800"
                  }`}
                >
                  <div className="pt-0.5">
                    <div
                      className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === "sepay"
                          ? "border-blue-600 bg-blue-600"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {paymentMethod === "sepay" && (
                        <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1H17a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                        Quét mã QR (SePay / VietQR)
                      </span>
                      <span className="text-[10px] bg-blue-600 text-white font-semibold px-2 py-0.5 rounded-md">
                        Tự động
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Khách chuyển khoản quét mã VietQR, hệ thống tự động xác nhận tức thì.
                    </p>
                  </div>
                </div>

                {/* Tiền mặt tại quầy */}
                <div
                  onClick={() => setPaymentMethod("cash")}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "cash"
                      ? "border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/30 ring-1 ring-emerald-600 shadow-sm"
                      : "border-gray-200 dark:border-gray-700 hover:border-emerald-300 bg-white dark:bg-gray-800"
                  }`}
                >
                  <div className="pt-0.5">
                    <div
                      className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === "cash"
                          ? "border-emerald-600 bg-emerald-600"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {paymentMethod === "cash" && (
                        <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Thanh toán tiền mặt
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Thu tiền mặt trực tiếp từ khách hàng tại quầy.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full mt-4"
              size="md"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2 border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                  Đang xử lý đơn...
                </>
              ) : paymentMethod === "sepay" ? (
                "Tạo đơn & Hiện mã QR SePay"
              ) : (
                "Xác nhận thanh toán tiền mặt"
              )}
            </Button>
          </Form>
        </div>
      </div>

      {/* Modal Quét mã QR SePay cho Admin */}
      <AdminSepayQrModal
        isOpen={isQrModalOpen}
        orderId={createdOrderId}
        totalAmount={totalPrice}
        onClose={() => {
          setIsQrModalOpen(false);
          route.push("/orders");
        }}
        onPaymentSuccess={() => {
          openNotification({
            message: "Thanh toán thành công!",
            description: "Đơn hàng đã được SePay xác nhận thanh toán thành công.",
            placement: "top",
            duration: 3,
            icon: <FaRegSmileBeam style={{ color: "green" }} />,
            style: { borderLeft: "5px solid green" },
          });
          route.push("/orders");
        }}
      />
    </div>
  );
};
