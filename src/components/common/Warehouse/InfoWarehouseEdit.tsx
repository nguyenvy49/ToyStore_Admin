"use client";

import { useWarehouse } from "@/context/WarehouseContext";
import Button from "../../ui/button/Button";
import { WarehouseItem } from "./WarehouseItem";
import { WarehouseService } from "@/services/warehouseService";

import { FaRegSmileBeam } from "react-icons/fa";
import { useNotification } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";
import { EditFormProps } from "@/types/props";
import { ProductService } from "@/services/productService";
import { useEffect, useRef } from "react";

export const InfoWarehouseEdit = ({ id }: EditFormProps) => {
  const { warehouse, totalPrice, removeFromWarehouse, addToWarehouse } = useWarehouse();
  const { openNotification } = useNotification();
  const addToWarehouseRef = useRef(addToWarehouse);
  const router = useRouter();
  const fetchedRef = useRef(false); // đảm bảo không chạy lại 2 lần trong dev
  useEffect(() => {
    const fetchWarehouseData = async () => {
      if (fetchedRef.current) return; // chặn chạy lại
      fetchedRef.current = true;

      try {
        // Gọi 2 API song song để tiết kiệm thời gian
        const [warehouseRes, productRes] = await Promise.all([
          WarehouseService.infoWarehouse(id),
          ProductService.getListProduct("/api/Product/admin"),
        ]);

        console.log("Warehouse:", warehouseRes);
        console.log("Product list:", productRes);

        if (!warehouseRes.success || !productRes.success) return;

        // Dùng Map để tìm nhanh sản phẩm thay vì .find() trong vòng lặp
        const productMap = new Map(productRes.result.items.map(p => [p.id, p]));

        warehouseRes.result.details.forEach((item) => {
          const product = productMap.get(item.productId);
          if (product) {
            addToWarehouseRef.current(product, item.quantity, item.importPrice);
          }
        });
      } catch (error) {
        console.error("Error loading warehouse:", error);
      }
    };

    fetchWarehouseData();
  }, [id]);

  const handleImport = async () => {
    try {
      const details = warehouse.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        importPrice: item.priceImport,
      }));
      const importData = { details, dateEntered: new Date().toISOString() };
      const res = await WarehouseService.updateWarehouse(id, importData);
      console.log(res);
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
