"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface TableContextType {
  urlApi: string;  
  setParam: (name: string, value: string | number | null) => void;
  setUrlApi: React.Dispatch<React.SetStateAction<string>>;
}

interface TableContextProviderProps {
  children: ReactNode;
  initialUrl?: string; // URL mặc định từ bên ngoài
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export const TableContextProvider = ({ children, initialUrl = "" }: TableContextProviderProps) => {
  const [urlApi, setUrlApi] = useState<string>(initialUrl);

  const setParam = (name: string, value: string | number | null) => {
    // Tách path và query string từ urlApi hiện tại
    const [path, queryString] = urlApi.split("?");
    const params = new URLSearchParams(queryString || "");

    if (value === "" || value === null) {
      params.delete(name); // xoá param nếu giá trị rỗng/null
    } else {
      params.set(name, value.toString()); // thêm/cập nhật param
    }

    // Ghép lại URL
    const newUrl = params.toString() ? `${path}?${params.toString()}` : path;
    setUrlApi(newUrl);
  };

  return (
    <TableContext.Provider value={{ urlApi, setParam, setUrlApi}}>
      {children}
    </TableContext.Provider>
  );
};

export const useTableContext = (): TableContextType => {
  const ctx = useContext(TableContext);
  if (!ctx) throw new Error("useTableContext phải được dùng bên trong TableContextProvider");
  return ctx;
};

// ✅ Hook an toàn, không gây lỗi nếu nằm ngoài Provider
export const useSafeTableContext = () => {
  try {
    return useTableContext();
  } catch {
    return { urlApi: null, setUrlApi: () => {}, param: {}, setParam: () => {} };
  }
};
