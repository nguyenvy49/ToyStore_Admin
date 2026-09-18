"use client"
import React from "react";
import {
  TableBody,
  TableCell,
  TableRow,
} from "../../../ui/table";

import { RiResetLeftFill } from "react-icons/ri";

import Image from "next/image";
import Button from "@/components/ui/button/Button";
import { FaEye } from "react-icons/fa6";
import Badge from "@/components/ui/badge/Badge";
import { ProductType } from "@/schemaValidations/product.schema";

interface NewsTableBodyProps {
  tableData: ProductType[];
  onOpenModal: (type: "restore" | "detail",id?:string) => void;
}

const ProductTableBodyDelete: React.FC<NewsTableBodyProps> = ({
  tableData,
  onOpenModal
}) => {
  return (
    <>
      <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
        {tableData.map((item,index) => (
          <TableRow key={item.id}>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              {index+1}
            </TableCell>
            
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              <div className="flex -space-x-2">
                <div className="w-15 h-15 overflow-hidden rounded-full">
                  <Image
                    width={100}
                    height={100}
                    src={item.image?.[0] || "/images/cards/card-03.png"}
                    alt={item.productName}
                  />
                </div>
              </div>
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              {item.productName}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              {item.price}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              {item.quantity}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              {item.productStatus == 1 ? (
                <Badge color="error" size="sm">
                  Hết hàng
                </Badge>
              ):(
                <Badge color="success" size="sm">
                  Còn hàng
                </Badge>
              )}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              {item.createdBy}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              <div className="flex flex-col gap-2">
                <Button onClick={()=>onOpenModal("detail",item.id)} className="w-20" size="xxs" variant="info" startIcon={<FaEye />}>
                  Chi tiết
                </Button>
                <Button onClick={()=>onOpenModal("restore",item.id)} className="w-20" size="xxs" variant="warning" startIcon={<RiResetLeftFill />}>
                  Khôi phục
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}

export default ProductTableBodyDelete;