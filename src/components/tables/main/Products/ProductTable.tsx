'use client'
import React, { useEffect, useState } from "react";
import {
  Table,
} from "../../../ui/table";

import TableHeaderOne from "../../header/TableHeaderOne";
import ProductTableBody from "../../body/Products/ProductTableBody";
import Pagination from "../../Pagination";
import { ProductType } from "@/schemaValidations/product.schema";
import { useTableContext } from "@/context/TableContext";
import { ProductService } from "@/services/productService";
import { NoData } from "@/components/common/NoData";
import { Loading } from "@/components/common/Loading";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import ModalConfirm from "@/components/example/ModalExample/ModalConfirm";
import ProductDetailModal from "@/components/example/ModalExample/ProductDetailModal";


const title = ["STT",'Hình ảnh','Tên sản phẩm',"Giá","Số lượng","Trạng thái","Tình trạng","Người tạo","Người sửa","Hành động"]

export default function ProductTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tableData, setTableData] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true); // trạng thái đang load
  const { urlApi, setParam } = useTableContext();

  // ✅ quản lý modal ở đây
  const { isOpen, openModal, closeModal } = useModal();
  const [modalType, setModalType] = useState<"delete" | "detail" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const onPageChange = async (page: number) => {
    setCurrentPage(page)
    setParam("PageNumber",page)
  }
  const handleOpenModal = (type: "delete" | "detail", id?: string) => {
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
          <Table className="w-full">
            {/* Table Header */}
            <TableHeaderOne title={title}/>
            {loading && (
              <Loading colSpan={title.length} />
            )}
            {/* Table Body */}
            {!loading && tableData.length > 0 && (
              <ProductTableBody onOpenModal={handleOpenModal} tableData={tableData} />
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
        </div>
      </div>
      {/* ✅ Modal nằm ngoài table */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        {modalType === "delete" && selectedId && (
          <ModalConfirm
            id={selectedId}
            title="Xóa"
            description="sản phẩm"
            onHandle={ProductService.deleteProduct}
            closeModal={closeModal}
            loadData={fetchDataTable}
            urlApi={urlApi}
          />
        )}
        {modalType === "detail" && selectedId && (
          <>
            <ProductDetailModal id={selectedId} onHandle={ProductService.infoProduct} onClose={closeModal}/>
          </>
        )}
      </Modal>
    </div>   
  );
}
