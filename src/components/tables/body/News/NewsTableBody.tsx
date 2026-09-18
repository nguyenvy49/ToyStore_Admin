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
import { FaWrench, FaEye } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { NewsType } from "@/schemaValidations/news.schema";
import { getFirstImageFromString } from "@/utils/format";
import Badge from "@/components/ui/badge/Badge";

interface NewsTableBodyProps {
  tableData: NewsType[];
  onOpenModal: (type: "delete" | "detail", id?: string) => void;
}

const NewsTableBody: React.FC<NewsTableBodyProps> = ({
  tableData,
  onOpenModal,
}) => {
  return (
    <>
      <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
        {tableData.map((news, index) => (
          <TableRow key={news.id}>
            {/* ID */}
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              {index + 1}
            </TableCell>
            {/* Ảnh thumbnail */}
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
            {/* Tiêu đề tin */}
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
              {news.title}
            </TableCell>

            {/* Ngày tạo */}
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              {new Date(news.createdOn).toLocaleDateString("vi-VN")}
            </TableCell>

            {/* Tác giả */}
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              {news.author || "Chưa rõ"}
            </TableCell>

            {/* Trạng thái */}
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              <Badge color={news.isApproved ? "success" : "warning"} size="sm">
                {news.isApproved ? "Đã duyệt" : "Chưa duyệt"}
              </Badge>
            </TableCell>

            {/* Action */}
            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
              <div className="flex flex-col gap-2">
                <Link href={`/news/edit/${news.id}`}>
                  <Button className="w-20" size="xxs" variant="warning" startIcon={<FaWrench />}>
                    Sửa
                  </Button>
                </Link>
                <Button onClick={() => onOpenModal("detail", news.id)} className="w-20" size="xxs" variant="info" startIcon={<FaEye />}>
                  Chi tiết
                </Button>
                <Button onClick={() => onOpenModal("delete", news.id)} className="w-20" size="xxs" variant="danger" startIcon={<FaDeleteLeft />}>
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

export default NewsTableBody;

