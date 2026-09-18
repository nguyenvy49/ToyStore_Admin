"use client";
import React, { createContext, useContext, useState } from "react";
import { ProductType } from "@/schemaValidations/product.schema";

interface WarehouseItem {
  product: ProductType;
  quantity: number;
  priceImport: number;
}

interface WarehouseContextType {
  warehouse: WarehouseItem[];
  addToWarehouse: (product: ProductType, quantity: number, priceImport: number) => void;
  removeFromWarehouse: (id: string) => void;
  totalPrice: number;
}

const WarehouseContext = createContext<WarehouseContextType | undefined>(undefined);

export const WarehouseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [warehouse, setCart] = useState<WarehouseItem[]>([]);

  const addToWarehouse = (product: ProductType, quantity: number, priceImport: number) => {
    setCart((prev) => {
      const existing = prev.find((w) => w.product.id === product.id);
      if (existing) {
        // Cập nhật số lượng nếu đã có trong giỏ
        return prev.map((w) =>
          w.product.id === product.id
            ? { ...w, quantity: w.quantity + quantity, price: w.priceImport + priceImport }
            : w
        );
      }
      return [...prev, { product, quantity, priceImport}];
    });
  };

  const removeFromWarehouse = (id: string) => {
    setCart((prev) => prev.filter((w) => w.product.id !== id));
  };

  const totalPrice = warehouse.reduce(
    (sum, w) => sum + w.quantity * w.priceImport,
    0
  );

  return (
    <WarehouseContext.Provider value={{ warehouse, addToWarehouse, removeFromWarehouse, totalPrice }}>
      {children}
    </WarehouseContext.Provider>
  );
};

export const useWarehouse = () => {
  const context = useContext(WarehouseContext);
  if (!context) throw new Error("useOrder must be used within an OrderProvider");
  return context;
};
