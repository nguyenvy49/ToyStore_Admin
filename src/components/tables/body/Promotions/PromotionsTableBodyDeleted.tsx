"use client"
import React from "react";
import {
  TableBody,
  TableCell,
  TableRow,
} from "../../../ui/table";

import { RiResetLeftFill } from "react-icons/ri";

import Button from "@/components/ui/button/Button";
import { PromotionType } from "@/schemaValidations/promotion.schema";
import { formatDateTime } from "@/utils/format";
import Badge from "@/components/ui/badge/Badge";

interface PromotionsTableBodyProps {
  tableData: PromotionType[];
  onOpenModal: (type: "detail" | "restore",id?:string) => void;
}

const NewsTableBodyDelete: React.FC<PromotionsTableBodyProps> = ({
  tableData,onOpenModal
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
              {item.title}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              {item.discountPercent} %
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              {formatDateTime(item.startDate)}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              {formatDateTime(item.endDate)}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              {item.isApproved ? (
                <Badge color="info" size="sm">
                  Đã duyệt
                </Badge>
              ) : (
                <Badge color="warning" size="sm">
                  Chờ duyệt
                </Badge>
              )}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              {item.createdBy}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              <div className="flex flex-col gap-2">
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

export default NewsTableBodyDelete;