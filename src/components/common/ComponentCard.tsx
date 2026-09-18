"use client"
import React from "react";
import Button from "../ui/button/Button";
import Link from "next/link";

import { FaPlusCircle } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { AiFillCheckCircle } from "react-icons/ai";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
  linkBtn?: string; // Link for the button
  titleBtn?: string; // Title for the button
  isAdd?: boolean; // Title for the button
  isDelete?: boolean; // Title for the button
  isOrder?: boolean; // Title for the button
  isApprove?: boolean; // Title for the button
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  linkBtn,
  titleBtn,
  isAdd,
  isDelete,
  isOrder = false,
  isApprove = false,
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="px-6 py-5">
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>
          {desc && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>
        {linkBtn && titleBtn && (
          <div className="px-6 py-5">
            <Link href={"/" + linkBtn + "/create"} className="mr-3">
              {isAdd && (
                <Button size="sm" variant="success" startIcon={<FaPlusCircle />}>
                  Thêm Mới {titleBtn}
                </Button>
              )}
            </Link>
            {isApprove && (
              <Link href={"/" + linkBtn + "/approve"} className="mr-3">
                <Button size="sm" variant="warning" startIcon={<AiFillCheckCircle />}>
                  {titleBtn} Chờ Duyệt
                </Button>
              </Link>
            )}
            {!isOrder && (!isDelete ? (
              <Link href={"/" + linkBtn + "/deleted"}>
                <Button size="sm" variant="outline_danger" startIcon={<RiDeleteBin5Fill />}>
                  {titleBtn} Đã Xóa
                </Button>
              </Link>
            ) : (
              <Link href={"/" + linkBtn}>
                <Button size="sm" variant="info">
                  Quản Lý {titleBtn}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
