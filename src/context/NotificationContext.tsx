"use client";

import type React from "react";
import { createContext, useContext, useMemo } from "react";
import { notification } from "antd";
import type { NotificationArgsProps } from "antd";

export interface NotificationContextType {
  openNotification: (config: NotificationArgsProps) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [api, contextHolder] = notification.useNotification();

  const value = useMemo<NotificationContextType>(
    () => ({
      openNotification: (config: NotificationArgsProps) => {
        // dùng api.open thay vì api.info để bạn control type/icon/duration/btn...
        api.open(config);
      },
    }),
    [api]
  );

  return (
    <NotificationContext.Provider value={value}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
