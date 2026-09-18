"use client";
import React from "react";
import { TableBody} from "../../../ui/table";
import { CategoryType } from "@/schemaValidations/category.schema";
import CategoryRow from "./CategoryRow";

interface CategoriesTableBodyProps {
  tableData: CategoryType[];
  onOpenModal: (type: "delete" | "detail", id?: string) => void;
}

const CategoriesTableBody: React.FC<CategoriesTableBodyProps> = ({
  tableData,
  onOpenModal,
}) => {
  return (
    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
      {tableData.map((item) => (
        <CategoryRow
          key={item.id}
          item={item}
          level={0}
          onOpenModal={onOpenModal}
        />
      ))}
    </TableBody>
  );
};

export default CategoriesTableBody;
