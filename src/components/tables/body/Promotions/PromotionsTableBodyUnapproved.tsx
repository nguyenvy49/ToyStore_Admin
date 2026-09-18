"use client"
import React from "react";
import {
  TableBody,
  TableCell,
  TableRow,
} from "../../../ui/table";

import Button from "@/components/ui/button/Button";
import { FaEye } from "react-icons/fa6";
import { AiFillCheckCircle } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { FaDeleteLeft } from "react-icons/fa6";
import Badge from "@/components/ui/badge/Badge";
import { PromotionType } from "@/schemaValidations/promotion.schema";
import { formatDateTime } from "@/utils/format";

interface PromotionsTableBodyUnapprovedProps {
  tableData: PromotionType[];
  onOpenModal: (type: "approve" | "detail" | "delete",id?:string) => void;
}

const PromotionTableBodyUnapproved: React.FC<PromotionsTableBodyUnapprovedProps> = ({
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
              <Badge color="warning" size="sm">
                Chờ duyệt
              </Badge>
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              <div className="flex flex-col gap-2">
                <Button onClick={()=>onOpenModal("detail",item.id)} className="w-20" size="xxs" variant="info" startIcon={<FaEye />}>
                  Chi tiết
                </Button>
                <Button onClick={()=>onOpenModal("approve",item.id)} className="w-20" size="xxs" variant="success" startIcon={<AiFillCheckCircle />}>
                  Duyệt
                </Button>
                <Button className="w-20" size="xxs" variant="warning" startIcon={<FiEdit />}>
                  Sửa
                </Button>
                <Button onClick={() => onOpenModal("delete",item.id)}className="w-20" size="xxs" variant="danger" startIcon={<FaDeleteLeft />}>
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

export default PromotionTableBodyUnapproved;