"use client"
import React, { useEffect, useState } from "react";
import { Table } from "../../../ui/table";

import TableHeaderOne from "../../header/TableHeaderOne";
import PromotionsTableBody from "../../body/Promotions/PromotionsTableBody";
import { PromotionType } from "@/schemaValidations/promotion.schema";
import { useTableContext } from "@/context/TableContext";
import Pagination from "../../Pagination";
import { PromotionService } from "@/services/promotionService";
import { Loading } from "@/components/common/Loading";
import { NoData } from "@/components/common/NoData";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import ModalConfirm from "@/components/example/ModalExample/ModalConfirm";
import ModelDetailPromotion from "@/components/example/ModalExample/ModelDetailPromotion";

const title = ["STT", "Tiêu đề", "Giảm", "Ngày bắt đầu", "Ngày kết thúc", "Người tạo", "Hành động"];

export default function PromotionsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tableData, setTableData] = useState<PromotionType[]>([]);
  const [loading, setLoading] = useState(true); // trạng thái đang load
  const { urlApi, setParam } = useTableContext();

  // ✅ quản lý modal ở đây
  const { isOpen, openModal, closeModal } = useModal();
  const [modalType, setModalType] = useState<"delete" | "detail" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);


  const onPageChange = async (page: number) => {
    setCurrentPage(page);
    setParam("PageNumber", page);
  };

  const handleOpenModal = (type: "delete" | "detail", id?: string) => {
    setModalType(type);
    if (id) setSelectedId(id);
    openModal();
  };
  const fetchDataTable = async (urlApi: string) => {
    try {
      setTableData([]);
      setLoading(true)
      const res = await PromotionService.getListPromotion(urlApi);
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
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table className="w-full">
              {/* Table Header */}
              <TableHeaderOne title={title} />

              {/* Table Body */}
              {loading && (
                <Loading colSpan={title.length} />
              )}

              {!loading && tableData.length > 0 && (
                <PromotionsTableBody
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
      </div>
      {/* ✅ Modal nằm ngoài table */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        {modalType === "delete" && selectedId && (
          <ModalConfirm
            id={selectedId}
            title="Xóa"
            description="khuyến mãi"
            onHandle={PromotionService.deletePromotion}
            closeModal={closeModal}
            loadData={fetchDataTable}
            urlApi={urlApi}
          />
        )}
        {modalType === "detail" && selectedId && (
          <>
            <ModelDetailPromotion
              id={selectedId}
              onHandle={PromotionService.infoPromotion}
              closeModal={closeModal}
            />
          </>
        )}
      </Modal>
    </>
  );
}
