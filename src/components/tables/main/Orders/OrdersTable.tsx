"use client"
import React, { useEffect, useState } from "react";
import {
  Table,
} from "../../../ui/table";

import TableHeaderOne from "../../header/TableHeaderOne";
import OrdersTableBody from "../../body/Orders/OrdersTableBody";
import { useTableContext } from "@/context/TableContext";
import { useModal } from "@/hooks/useModal";
import { OrderService } from "@/services/orderService";
import { Loading } from "@/components/common/Loading";
import { NoData } from "@/components/common/NoData";
import Pagination from "../../Pagination";
import { Modal } from "@/components/ui/modal";
import { OrderType } from "@/schemaValidations/order.schema";
import ModalUpdateOrder from "@/components/example/ModalExample/ModalUpdateOrder";
import { FormProvider } from "@/context/FormContext";
import { OrderDetailModal } from "@/components/example/ModalExample/ModalDetailOrder";

const title = ["STT", 'Khách hàng', 'Số điện thoại', "Địa chỉ", "Thời gian đặt", "Tổng tiền", "Người tạo","Người cập nhật", "Trạng thái", "Hàng động"]


export default function OrdersTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tableData, setTableData] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const { urlApi, setParam } = useTableContext();

  // ✅ quản lý modal
  const { isOpen, openModal, closeModal } = useModal();
  const [modalType, setModalType] = useState<"update" | "detail" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [itemDetail, setItemDetail] = useState<OrderType | null>(null);


  // đổi trang
  const onPageChange = (page: number) => {
    setCurrentPage(page);
    setParam("PageNumber", page);
  };

  // mở modal
  const handleOpenModalUpdate = (type: "update", id?: string , status?: number) => {
    setModalType(type);
    if (id) setSelectedId(id);
    if (status) setStatus(status);
    openModal();
  };
  const handleOpenModalDetail = (type: "detail", detailOrder: OrderType) => {
    setModalType(type);
    if (detailOrder) setItemDetail(detailOrder);
    openModal();
  };


  // load data
  const fetchDataTable = async (urlApi: string) => {
    try {
      setTableData([]);
      setLoading(true);
      const res = await OrderService.getListOrder(urlApi);
      console.log(res);
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
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table className="w-full">
            {/* Table Header */}
            <TableHeaderOne title={title} />

            {/* Table Body */}
            {loading && <Loading colSpan={title.length} />}
            {!loading && tableData.length > 0 && (
              <OrdersTableBody tableData={tableData} onOpenModalUpdate={handleOpenModalUpdate} onOpenModalDetail={handleOpenModalDetail} />
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
      {/* ✅ Modal */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        {modalType === "update" && selectedId && (
          <>
            <FormProvider >
              <ModalUpdateOrder
                status={status}
                id={selectedId}
                urlApi={urlApi}
                loadData={fetchDataTable}
                title="Cập nhật"
                description="đơn hàng"
                closeModal={closeModal} />
            </FormProvider>
          </>
        )}
        {modalType === "detail" && itemDetail && (
          <>
            <OrderDetailModal order={itemDetail} />
          </>
        )}
      </Modal>
    </div>

  );
}
