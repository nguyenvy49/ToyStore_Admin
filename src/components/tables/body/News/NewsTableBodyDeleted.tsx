"use client";
import React from "react";
import {
  TableBody,
  TableCell,
  TableRow,
} from "../../../ui/table";

import { RiResetLeftFill } from "react-icons/ri";
import { FaEye } from "react-icons/fa6";

import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { NewsType } from "@/schemaValidations/news.schema";
import Image from "next/image";
import { getFirstImageFromString } from "@/utils/format";

interface NewsTableBodyDeleteProps {
  tableData: NewsType[];
  onOpenModal: (type: "detail" | "restore", id?: string) => void;
}

const NewsTableBodyDelete: React.FC<NewsTableBodyDeleteProps> = ({
  tableData,
  onOpenModal,
}) => {
  return (
    <>
      <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
        {tableData.map((news, index) => (
          <TableRow key={news.id}>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              {index + 1}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 align-middle">
              <div className="flex justify-center items-center">
                <div className="w-[280px] h-[180px] overflow-hidden rounded-lg bg-gray-50 flex justify-center items-center">
                  <Image
                    width={100}
                    height={70}
                    src={getFirstImageFromString(news.image) || "/default-news.jpg"}
                    alt={news.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              {news.title}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              {news.author}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              {news.isApproved ? (
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
              <div className="flex flex-col gap-2">
                <Button onClick={() => onOpenModal("detail", news.id)} className="w-20" size="xxs" variant="info" startIcon={<FaEye />}>
                  Chi tiết
                </Button>
                <Button onClick={() => onOpenModal("restore", news.id)} className="w-20" size="xxs" variant="warning" startIcon={<RiResetLeftFill />}>
                  Khôi phục
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default NewsTableBodyDelete;
