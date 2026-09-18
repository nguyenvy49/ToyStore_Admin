"use client";

import { useEffect, useState } from "react";
import Pagination from "../../tables/Pagination";
import { ProductItemWarehouse } from "./ProductItemWarehouse";
import { ProductType } from "@/schemaValidations/product.schema";
import { ProductService } from "@/services/productService";
import { useTableContext } from "@/context/TableContext";
import { Loading } from "../Loading";
import { NoData } from "../NoData";

export const ProductListWarehouse = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tableData, setTableData] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true); // trạng thái đang load
  const { urlApi, setParam } = useTableContext();

  const onPageChange = async (page: number) => {
    setCurrentPage(page);
    setParam("PageNumber", page);
  };


  const fetchDataTable = async (urlApi: string) => {
    try {
      setTableData([])
      const res = await ProductService.getListProduct(urlApi)
      console.log(res)
      setTableData(res.result.items)
      setTotalPages(res.result.totalPages)
      setCurrentPage(res.result.currentPage)
    }
    catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDataTable(urlApi);
  }, [urlApi]);

  return (
    <>
      {loading && (
        <Loading />
      )}
      <div className="grid grid-cols-3 gap-3 justify-items-center">
        {!loading && tableData.length > 0 &&
          tableData.map((item, index) => (
            <ProductItemWarehouse key={index} item={item} />
          ))
        }
        {!loading && tableData.length === 0 && (
          <NoData title="Không có dữ liệu" />
        )}
      </div>
      {Array.isArray(tableData) && tableData.length > 0 && (
        <div className="w-full flex justify-center mt-4 mb-4">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </>
  )
};
