"use client"
import React from "react";
import {
  TableBody,
} from "../../../ui/table";

import { CategoryType } from "@/schemaValidations/category.schema";
import CategoryRowDelete from "./CategoryRowDelete";

interface CategoriesTableBodyDeleteProps {
  tableData: CategoryType[];
  onOpenModal: (type: "delete" | "detail" | "restore",id?:string) => void;
}

const CategoriesTableBodyDelete: React.FC<CategoriesTableBodyDeleteProps> = ({
  tableData,
  onOpenModal,
}) => {
  return (
    <>
      <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
        {tableData.map((item) => (
          <CategoryRowDelete
            key={item.id}
            item={item}
            level={0}
            onOpenModal={onOpenModal}
          />
        ))}
      </TableBody>
    </>
  );
}

export default CategoriesTableBodyDelete;