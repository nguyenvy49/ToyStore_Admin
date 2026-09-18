"use client"
import React, { useEffect, useState } from "react";
import {
  Table,
} from "../../../ui/table";

import TableHeaderOne from "../../header/TableHeaderOne";
import PromotionsTableBodyDelete from "../../body/Promotions/PromotionsTableBodyDeleted";
import { useTableContext } from "@/context/TableContext";
import { useModal } from "@/hooks/useModal";
import { PromotionService } from "@/services/promotionService";
import { Modal } from "@/components/ui/modal";
import { PromotionType } from "@/schemaValidations/promotion.schema";
import { Loading } from "@/components/common/Loading";
import { NoData } from "@/components/common/NoData";
import Pagination from "../../Pagination";
import ModalConfirm from "@/components/example/ModalExample/ModalConfirm";
import ModelDetailPromotion from "@/components/example/ModalExample/ModelDetailPromotion";

const title = ["STT", 'Tiêu đề', "Giảm", "Ngày bắt đầu", "Ngày kết thúc","Trạng thái", "Người xóa", "Hành động"]

export default function PromotionsTableDelete() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true); // trạng thái đang load
  const [tableData, setTableData] = useState<PromotionType[]>([]);
  const { urlApi, setParam } = useTableContext();

  const { isOpen, openModal, closeModal } = useModal();
  const [modalType, setModalType] = useState<"detail" | "restore" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const onPageChange = async (page: number) => {
    setCurrentPage(page);
    setParam("PageNumber", page);
  };

  const handleOpenModal = (type: "detail" | "restore", id?: string) => {
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
            <Table>
              {/* Table Header */}
              <TableHeaderOne title={title} />

              {/* Table Body */}
              {/* Table Body */}
              {loading && (
                <Loading colSpan={title.length} /> 
              )}

              {!loading && tableData.length > 0 && (
                <PromotionsTableBodyDelete
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
        {modalType === "detail" && selectedId && (
          <>
            <ModelDetailPromotion
              id={selectedId}
              onHandle={PromotionService.infoPromotion}
              closeModal={closeModal}
            />
          </>
        )}
        {modalType === "restore" && selectedId && (
          <>
            <ModalConfirm
              id={selectedId}
              title="Khôi phục"
              description="khuyến mãi"
              onHandle={PromotionService.restorePromotion}
              closeModal={closeModal}
              loadData={fetchDataTable}
              urlApi={urlApi}
            />
          </>
        )}
      </Modal>
    </>
  );
}
