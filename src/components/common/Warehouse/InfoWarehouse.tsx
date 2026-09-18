"use client";

import { useWarehouse } from "@/context/WarehouseContext";
import Button from "../../ui/button/Button";
import { WarehouseItem } from "./WarehouseItem";
import { WarehouseService } from "@/services/warehouseService";

import { FaRegSmileBeam } from "react-icons/fa";
import { useNotification } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";

type WarehouseItemProps = {
  image?: string;
  productName: string;
  supplierName: string;
  quantity: number;
  price: number;
}
type InfoWarehouse = {
  data: WarehouseItemProps[];
}


export const InfoWarehouse = () => {
  const { warehouse, totalPrice, removeFromWarehouse } = useWarehouse();
  const { openNotification } = useNotification();
  const router = useRouter();
  const handleImport = async () => {
    try {
      const details = warehouse.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        importPrice: item.priceImport,
      }));
      const importData = { details, dateEntered: new Date().toISOString() };
      const res = await WarehouseService.createWarehouse(importData);
      if (res.success) {
        openNotification({
          message: "Thành công",
          description: "Nhập kho thành công!",
          placement: "top",
          duration: 3,
          icon: <FaRegSmileBeam style={{ color: "green" }} />,
          style: { borderLeft: "5px solid green" },
        });
        router.push('/warehouses');
      } else {
        openNotification({
          message: "Thất bại",
          description: "Nhập kho thất bại!",
          placement: "top",
          duration: 3,
          icon: <FaRegSmileBeam style={{ color: "red" }} />,
          style: { borderLeft: "5px solid red" },
        });
      }
    } catch (error) {
      console.log(error)
    }


  }
  return (
    <>
      <div className="flex flex-col space-y-3">
        {warehouse.length > 0 && warehouse ? warehouse.map((warehouse, index) => (
          <WarehouseItem
            key={index}
            id={warehouse.product.id}
            removeFromWarehouse={() => removeFromWarehouse(warehouse.product.id)}
            image={warehouse.product.image?.[0] || "/images/grid-image/image-03.png"}
            productName={warehouse.product.productName}
            supplierName={warehouse.product.supplier.name ? warehouse.product.supplier.name : "Chưa cập nhật"}
            quantity={warehouse.quantity}
            price={warehouse.priceImport}
          />
        )) : (
          <>
            <p>Vui lòng chọn sản phẩm</p>
          </>
        )}
      </div>
      <div className="flex flex-col items-end mt-5 border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex items-center justify-between w-full mb-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Tổng tiền:
          </p>
          <p className="text-base font-semibold text-red-600">
            {totalPrice.toLocaleString()}đ
          </p>
        </div>

        <Button
          variant="primary"
          className="w-full"
          size="md"
          onClick={handleImport}
        >
          Nhập kho
        </Button>
      </div>
    </>
  );
};
