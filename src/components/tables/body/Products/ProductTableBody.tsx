"use client"
import React from "react";
import {
  TableBody,
  TableCell,
  TableRow,
} from "../../../ui/table";

import Image from "next/image";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import { FaWrench,FaEye  } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import Badge from "@/components/ui/badge/Badge";
import { ProductType } from "@/schemaValidations/product.schema";

interface ProductsTableBodyProps {
  tableData: ProductType[];
  onOpenModal: (type: "delete" | "detail",id?:string) => void;
}

const ProductTableBody: React.FC<ProductsTableBodyProps> = ({
  tableData,
  onOpenModal
}) => {
  return (
    <>
      <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
        {tableData.map((product,index) => (
          <TableRow key={product.id}>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              {index+1}
            </TableCell>
            
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              <div className="flex -space-x-2">
                <div className="w-15 h-15 overflow-hidden rounded-full">
                  <Image
                    width={100}
                    height={100}
                    src={product.image?.[0] || "/images/cards/card-03.png"}
                    alt={product.productName}
                  />
                </div>
              </div>
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              {product.productName}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              {product.price}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              {product.quantity}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              {product.productStatus == 1 ? (
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
              <Badge color="info" size="sm">Mới</Badge>
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              {product.createdBy}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              {product.updatedBy}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              <div className="flex flex-col gap-2">
                <Link href={"/products/edit/"+product.id}>
                  <Button className="w-20" size="xxs" variant="warning" startIcon={<FaWrench />}>
                    Sửa
                  </Button>
                </Link>
                <Button onClick={()=>onOpenModal("detail",product.id)} className="w-20" size="xxs" variant="info" startIcon={<FaEye />}>
                  Chi tiết
                </Button>
                <Button onClick={()=>onOpenModal("delete",product.id)} className="w-20" size="xxs" variant="danger" startIcon={<FaDeleteLeft />}>
                  Xóa
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}

export default ProductTableBody;