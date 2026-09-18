"use client";
import React, { createContext, useContext, useState } from "react";
import { ProductType } from "@/schemaValidations/product.schema";

interface CartItem {
  product: ProductType;
  quantity: number;
}

interface OrderContextType {
  cart: CartItem[];
  addToCart: (product: ProductType, quantity: number) => void;
  removeFromCart: (id: string) => void;
  totalPrice: number;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: ProductType, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id);
      if (existing) {
        // Cập nhật số lượng nếu đã có trong giỏ
        return prev.map((c) =>
          c.product.id === product.id
            ? { ...c, quantity: c.quantity + quantity }
            : c
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((c) => c.product.id !== id));
  };

  const totalPrice = cart.reduce(
    (sum, c) => sum + c.quantity * c.product.price,
    0
  );

  return (
    <OrderContext.Provider value={{ cart, addToCart, removeFromCart, totalPrice }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrder must be used within an OrderProvider");
  return context;
};
