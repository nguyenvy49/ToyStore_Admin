"use client";
import React, { useState } from "react";
import { TableCell, TableRow } from "../../../ui/table";
import Button from "@/components/ui/button/Button";
import Image from "next/image";
import Link from "next/link";
import {
  FaWrench,
  FaChevronRight,
  FaChevronDown,
  FaTrashAlt,
} from "react-icons/fa";
import { CategoryType } from "@/schemaValidations/category.schema";

const CategoryRow: React.FC<{
  item: CategoryType;
  level: number;
  onOpenModal: (type: "delete" | "detail", id?: string) => void;
}> = ({ item, level, onOpenModal }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  // 🎨 Màu nền & viền tùy theo cấp độ
  const levelStyles = [
    "bg-white dark:bg-transparent", // level 0
    "bg-gray-50 dark:bg-white/[0.03]", // level 1
    "bg-gray-100 dark:bg-white/[0.06]", // level 2
    "bg-gray-200 dark:bg-white/[0.08]", // level 3+
  ];
  const bgColor = levelStyles[level] || levelStyles[levelStyles.length - 1];

  // 🧱 Độ lệch trái và đường viền bên trái
  const paddingLeft = `${level * 24}px`;
  const borderLeftColor = `rgba(156, 163, 175, ${Math.min(level * 0.3, 0.5)})`; // gray tone

  return (
    <>
      <TableRow
        className={`${bgColor} transition-all duration-200 hover:bg-gray-100 dark:hover:bg-white/[0.1] border-l-2`}
        style={{
          borderLeftColor,
        }}
      >
        {/* Cột STT / hoặc icon mở rộng */}
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          <div style={{ paddingLeft }}>
            {hasChildren ? (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mr-2 text-gray-600 hover:text-gray-900"
              >
                {expanded ? <FaChevronDown /> : <FaChevronRight />}
              </button>
            ) : (
              <span className="ml-5" />
            )}
          </div>
        </TableCell>

        {/* Ảnh */}
        <TableCell className="px-4 py-3">
          <div className="flex items-center">
            <div className="w-12 h-12 overflow-hidden rounded-full ring-1 ring-gray-200 dark:ring-white/10">
              <Image
                width={100}
                height={100}
                src={item.image||"/images/cards/card-03.png"}
                alt={item.categoryName}
              />
            </div>
          </div>
        </TableCell>

        {/* Tên danh mục */}
        <TableCell
          className={`px-4 py-3 text-start text-theme-sm font-medium ${
            level === 0
              ? "text-gray-800 dark:text-gray-100"
              : "text-gray-700 dark:text-gray-300"
          }`}
        >
          {item.categoryName}
        </TableCell>

        {/* Người tạo / cập nhật */}
        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
          {item.createdBy}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
          {item.updatedBy}
        </TableCell>

        {/* Nút hành động */}
        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
          <div className="flex flex-col gap-2">
            <Link href={`/categories/edit/${item.id}`}>
              <Button
                className="w-20"
                size="xxs"
                variant="warning"
                startIcon={<FaWrench />}
              >
                Sửa
              </Button>
            </Link>
            <Button
              className="w-20"
              onClick={() => onOpenModal("delete", item.id)}
              size="xxs"
              variant="danger"
              startIcon={<FaTrashAlt />}
            >
              Xóa
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {/* Nếu có danh mục con */}
      {expanded &&
        hasChildren &&
        item.children!.map((child) => (
          <CategoryRow
            key={child.id}
            item={child}
            level={level + 1}
            onOpenModal={onOpenModal}
          />
        ))}
    </>
  );
};

export default CategoryRow;
