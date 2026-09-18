import React from "react";
import {
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

interface HeaderTable {
  title: string[];
}


const TableHeaderOne: React.FC<HeaderTable>=({title})=>{
  return (  
    <>
      <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
        <TableRow>
          {title.map((item,index)=>(
              <TableCell
                key={index}
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                {item}
              </TableCell>
          ))}
        </TableRow>
      </TableHeader>
    </>
  );
}

export default TableHeaderOne;