"use client"
import React, { useEffect, useState } from "react";
import {
  Table,
} from "../../../ui/table";

import TableHeaderOne from "../../header/TableHeaderOne";
import CustomerTableBody from "../../body/Customers/CustomerTableBody";
import { CustomerService } from "@/services/customerService";
import { Loading } from "@/components/common/Loading";
import { NoData } from "@/components/common/NoData";
import Pagination from "../../Pagination";
import { Modal } from "@/components/ui/modal";
import ModalConfirm from "@/components/example/ModalExample/ModalConfirm";
import { useTableContext } from "@/context/TableContext";
import { CustomerType } from "@/schemaValidations/customer.schema";
import { useModal } from "@/hooks/useModal";

const title = ["STT", 'Tên khách hàng', "SĐT", "Email", "Địa chỉ", "Trạng thái", "Hành động"]

export default function CustomerTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tableData, setTableData] = useState<CustomerType[]>([]);
  const [loading, setLoading] = useState(true); // trạng thái đang load
  const { urlApi, setParam } = useTableContext();

  // ✅ quản lý modal ở đây
  const { isOpen, openModal, closeModal } = useModal();
  const [modalType, setModalType] = useState<"lock" | "lockOpen" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const onPageChange = async (page: number) => {
    setCurrentPage(page)
    setParam("PageNumber", page)
  }
  const handleOpenModal = (type: "lock" | "lockOpen", id?: string) => {
    setModalType(type);
    if (id) setSelectedId(id);
    openModal();
  };

  const fetchDataTable = async (urlApi: string) => {
    try {
      setTableData([])
      const res = await CustomerService.getAllCustomer(urlApi)
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
    fetchDataTable(urlApi)
  }, [urlApi])
  return (
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
            {/* Table Body */}
            {!loading && tableData.length > 0 && (
              <CustomerTableBody onOpenModal={handleOpenModal} tableData={tableData} />
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
      <Modal isOpen={isOpen} onClose={closeModal}>
        {modalType === "lock" && selectedId && (
          <ModalConfirm
            id={selectedId}
            title="Khóa"
            description="tài khoản khách hàng"
            onHandle={CustomerService.lockCustomer}
            closeModal={closeModal}
            loadData={fetchDataTable}
            urlApi={urlApi}
          />
        )}
        {modalType === "lockOpen" && selectedId && (
          <ModalConfirm
            id={selectedId}
            title="Mở khóa"
            description="tài khoản khách hàng"
            onHandle={CustomerService.lockOpenCustomer}
            closeModal={closeModal}
            loadData={fetchDataTable}
            urlApi={urlApi}
          />
        )}
      </Modal>
    </div>

  );
}
