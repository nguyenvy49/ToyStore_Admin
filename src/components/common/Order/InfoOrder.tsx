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

export const InfoOrder = () => {
  const { cart, totalPrice, removeFromCart } = useOrder();
  const { openNotification } = useNotification();
  const route = useRouter()
  const [loading, setLoading] = useState(false);
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
          const products = cart.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
          }));
          const finalData = {
            ...data,
            products,
          };
          const res = await OrderService.createOrder(finalData);
          console.log(res);
          if (res.success) {
            openNotification({
              message: "Thành công",
              description: "Đơn hàng đã được thêm thành công!",
              placement: "top",
              duration: 3,
              icon: <FaRegSmileBeam style={{ color: "green" }} />,
              style: { borderLeft: "5px solid green" },
            });
            route.push("/orders");
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
        console.log(error);
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
          <p className="text-base font-semibold text-red-600">
            {totalPrice.toLocaleString()}đ
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
            <Button
              variant="primary"
              className="w-full mt-2"
              size="md"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2 border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                  Đang thanh toán...
                </>
              ) : (
                "Thanh toán"
              )}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};
