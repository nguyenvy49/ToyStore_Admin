"use client";
import React, { useEffect, useState } from "react";
import { Table } from "../../../ui/table";

import TableHeaderOne from "../../header/TableHeaderOne";
import NewsTableBody from "../../body/News/NewsTableBody";
import { NewsType } from "@/schemaValidations/news.schema";
import { useTableContext } from "@/context/TableContext";
import Pagination from "../../Pagination";
import { NewsService } from "@/services/newsService";
import { Loading } from "@/components/common/Loading";
import { NoData } from "@/components/common/NoData";

// ✅ modal & hook
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import ModalConfirm from "@/components/example/ModalExample/ModalConfirm";
import ModalDetailNews from "@/components/example/ModalExample/ModelDetailNews";

const title = ["STT", "Hình ảnh", "Tiêu đề", "Ngày tạo", "Người tạo", "Người duyệt", "Hành động"];

export default function NewsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tableData, setTableData] = useState<NewsType[]>([]);
  const [loading, setLoading] = useState(true);
  const { urlApi, setParam } = useTableContext();

  // ✅ quản lý modal
  const { isOpen, openModal, closeModal } = useModal();
  const [modalType, setModalType] = useState<"delete" | "detail" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // đổi trang
  const onPageChange = (page: number) => {
    setCurrentPage(page);
    setParam("PageNumber", page);
  };

  // mở modal
  const handleOpenModal = (type: "delete" | "detail", id?: string) => {
    setModalType(type);
    if (id) setSelectedId(id);
    openModal();
  };

  // load data
  const fetchDataTable = async (urlApi: string) => {
    try {
      setTableData([]);
      setLoading(true);
      const res = await NewsService.getListNews(urlApi);
      setTableData(res.result.items);
      setTotalPages(res.result.totalPages);
      setCurrentPage(res.result.currentPage);
    } catch (error) {
      console.log(error);
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
            <Table className="w-full">
              {/* Header */}
              <TableHeaderOne title={title} />
              {/* Body */}
              {loading && <Loading colSpan={title.length} />}
              {!loading && tableData.length > 0 && (
                <NewsTableBody
                  tableData={tableData}
                  onOpenModal={handleOpenModal}
                />
              )}
              {!loading && tableData.length === 0 && (
                <NoData colSpan={title.length} title="Không có dữ liệu" />
              )}
            </Table>

            {/* Pagination */}
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

      {/* ✅ Modal */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        {modalType === "delete" && selectedId && (
          <ModalConfirm id={selectedId}
            title="Xóa"
            description=" tin tức"
            onHandle={NewsService.deleteNews}
            closeModal={closeModal}
            loadData={fetchDataTable}
            urlApi={urlApi}
          />
        )}
        {modalType === "detail" && selectedId && (
          <>
            <ModalDetailNews
              id={selectedId}
              onHandle={NewsService.infoNews}
              closeModal={closeModal}
            />
          </>
        )}
      </Modal>
    </>
  );
}
