"use client"
import React, { useEffect, useState } from "react";
import {
  Table,
} from "../../../ui/table";

import TableHeaderOne from "../../header/TableHeaderOne";
import ProductTableBodyDelete from "../../body/Products/ProductTableBodyDeleted";
import { useModal } from "@/hooks/useModal";
import { useTableContext } from "@/context/TableContext";
import { ProductType } from "@/schemaValidations/product.schema";
import { ProductService } from "@/services/productService";
import { Loading } from "@/components/common/Loading";
import { NoData } from "@/components/common/NoData";
import Pagination from "../../Pagination";
import ModalConfirm from "@/components/example/ModalExample/ModalConfirm";
import { Modal } from "@/components/ui/modal";

const title = ["STT",'Hình ảnh','Tên sản phẩm',"Giá","Số lượng","Tình trạng","Người xóa","Hành động"]

export default function ProductTableDelete() {
  const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [tableData, setTableData] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(true); // trạng thái đang load
    const { urlApi, setParam } = useTableContext();
  
    // ✅ quản lý modal ở đây
    const { isOpen, openModal, closeModal } = useModal();
    const [modalType, setModalType] = useState<"delete" | "detail" | "restore"| null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const onPageChange = async (page: number) => {
      setCurrentPage(page)
      setParam("PageNumber",page)
    }
    const handleOpenModal = (type: "delete" | "detail" | "restore", id?: string) => {
      setModalType(type);
      if (id) setSelectedId(id);
      openModal();
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
      }finally{
        setLoading(false)
      }
    }
  
    useEffect(() => {
      fetchDataTable(urlApi)
    }, [urlApi])
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeaderOne title={title}/>
            {loading && (
              <Loading colSpan={title.length} />
            )}
            {/* Table Body */}
            {!loading && tableData.length > 0 && (
              <ProductTableBodyDelete onOpenModal={handleOpenModal} tableData={tableData} />
            )}
            {!loading && tableData.length === 0 && (
              <NoData colSpan={title.length} title="Không có dữ liệu" />
            )}
          </Table>
          {Array.isArray(tableData) && tableData.length > 0 && (
            <div className="w-full flex justify-center mt-4 mb-4">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
            </div>
          )}
          <Modal isOpen={isOpen} onClose={closeModal}>
            {modalType === "restore" && selectedId && (
              <ModalConfirm
                id={selectedId}
                title="Khôi phục"
                description="sản phẩm"
                onHandle={ProductService.restoreProduct}
                closeModal={closeModal}
                loadData={fetchDataTable}
                urlApi={urlApi}
              />
            )}
            {modalType === "detail" && selectedId && (
              <>
              </>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
}
