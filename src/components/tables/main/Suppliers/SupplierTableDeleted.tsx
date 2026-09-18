"use client";
import React, { useEffect, useState } from "react";
import { Table } from "../../../ui/table";

import TableHeaderOne from "../../header/TableHeaderOne";
import SupplierTableBodyDelete from "../../body/Suppliers/SupplierTableBodyDeleted";
import { SupplierType } from "@/schemaValidations/supplier.shema";
import { useTableContext } from "@/context/TableContext";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import { Loading } from "@/components/common/Loading";
import { NoData } from "@/components/common/NoData";
import Pagination from "../../Pagination";
import { SupplierService } from "@/services/supplierService";
import ModalConfirm from "@/components/example/ModalExample/ModalConfirm";

const title = ["STT","Tên nhà cung cấp","SĐT","Email","Địa chỉ","Ghi chú","Người xóa","Hành động"];

export default function SupplierTableDelete() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState<SupplierType[]>([]);
  const { urlApi, setParam } = useTableContext();

  const { isOpen, openModal, closeModal } = useModal();
  const [modalType, setModalType] = useState<"delete" |"detail" | "restore" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Chuyển trang
  const onPageChange = async (page: number) => {
    setCurrentPage(page);
    setParam("PageNumber", page);
  };

  // Mở modal
  const handleOpenModal = (type: "delete" | "detail" | "restore", id?: string) => {
    setModalType(type);
    if (id) setSelectedId(id);
    openModal();
  };

  // Gọi API danh sách supplier đã xóa
  const fetchDataTable = async (urlApi: string) => {
    try {
      setLoading(true);
      const res = await SupplierService.getListSupplier(urlApi);
      setTableData(res.result.items);
      setTotalPages(res.result.totalPages);
      setCurrentPage(res.result.currentPage);
    } catch (error) {
      console.log("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataTable(urlApi);
  }, [urlApi]);

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              {/* Tiêu đề bảng */}
              <TableHeaderOne title={title} />

              {/* Loading */}
              {loading && <Loading colSpan={title.length} />}

              {/* Có dữ liệu */}
              {!loading && tableData.length > 0 && (
                <SupplierTableBodyDelete
                  tableData={tableData}
                  onOpenModal={handleOpenModal}
                />
              )}

              {/* Không có dữ liệu */}
              {!loading && tableData.length === 0 && (
                <NoData colSpan={title.length} title="Không có dữ liệu" />
              )}
            </Table>

            {/* Phân trang */}
            {!loading && tableData.length > 0 && (
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
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        {modalType === "restore" && selectedId && (
          <ModalConfirm
            id={selectedId}
            title="Khôi phục"
            description="nhà cung cấp"
            onHandle={SupplierService.restoreSupplier}
            closeModal={closeModal}
            loadData={fetchDataTable}
            urlApi={urlApi}
          />
        )}
      </Modal>
    </>
  );
}
