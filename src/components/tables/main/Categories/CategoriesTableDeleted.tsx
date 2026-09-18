"use client"
import React, { useEffect, useState } from "react";
import {
  Table,
} from "../../../ui/table";

import TableHeaderOne from "../../header/TableHeaderOne";
import CategoriesTableBodyDelete from "../../body/Categories/CategoriesTableBodyDeleted";
import { CategoryService } from "@/services/categoryService";
import { useModal } from "@/hooks/useModal";
import { useTableContext } from "@/context/TableContext";
import { CategoryType } from "@/schemaValidations/category.schema";
import { NoData } from "@/components/common/NoData";
import { Loading } from "@/components/common/Loading";
import Pagination from "../../Pagination";
import { Modal } from "@/components/ui/modal";
import ModalConfirm from "@/components/example/ModalExample/ModalConfirm";

const title = ["STT","Hình ảnh",'Tên danh mục',"Người xóa","Hàng động"]

export default function CategoriesTableDelete() {
  const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [tableData, setTableData] = useState<CategoryType[]>([]);
    const [loading, setLoading] = useState(true); // trạng thái đang load
    const { urlApi, setParam } = useTableContext();
  
    // ✅ quản lý modal ở đây
    const { isOpen, openModal, closeModal } = useModal();
    const [modalType, setModalType] = useState<"delete" | "detail" | "restore" | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
  
    const onPageChange = async (page: number) => {
      setCurrentPage(page);
      setParam("PageNumber", page);
    };
  
    const handleOpenModal = (type: "delete" | "detail" | "restore", id?: string) => {
      setModalType(type);
      if (id) setSelectedId(id);
      openModal();
    };
  
    const fetchDataTable = async (urlApi: string) => {
        try {     // bật loading
          setTableData([]);      // reset tableData để ko hiển thị dữ liệu cũ
          setLoading(true)
          const res = await CategoryService.getListCategory(urlApi);
          setTableData(res.result.items);
          setTotalPages(res.result.totalPages);
          setCurrentPage(res.result.currentPage);
        } catch (error) {
          console.log(error);
        } finally {
          // dùng setTimeout để đảm bảo loading hiển thị ít nhất 0.5s
          setLoading(false)
        }
      };
      useEffect(() => {
        fetchDataTable(urlApi);
      }, [urlApi]);
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeaderOne title={title}/>

            {/* Table Body */}
            {loading && (
                <Loading colSpan={title.length} />
              )}

              {!loading && tableData.length > 0 && (
                <CategoriesTableBodyDelete
                  tableData={tableData}
                  onOpenModal={handleOpenModal} // ✅ truyền hàm mở modal xuống
                />
              )}

              {!loading && tableData.length === 0 && (
                <NoData colSpan={title.length} title="Không có dữ liệu" />
              )}
          </Table>
          {/* Pagination */}
          {!loading && Array.isArray(tableData) && tableData.length > 0 && (
            <div className="w-full flex justify-center mt-4 mb-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal}>
        {modalType === "restore" && selectedId && (
          <>
            <ModalConfirm
              id={selectedId}
              title="Khôi phục"
              description="danh mục"
              onHandle={CategoryService.restoreCategory}
              closeModal={closeModal}
              loadData={fetchDataTable}
              urlApi={urlApi}
            />
          </>
        )}
      </Modal>
    </div>
  );
}
