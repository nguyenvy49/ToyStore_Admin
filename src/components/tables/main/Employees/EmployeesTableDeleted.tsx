"use client";
import React, { useEffect, useState } from "react";
import { Table } from "../../../ui/table";
import TableHeaderOne from "../../header/TableHeaderOne";
import EmployeesBodyDeleted from "../../body/Employees/EmployeesBodyDeleted";
import { UserPermissionType } from "@/schemaValidations/permission.schema";
import { useTableContext } from "@/context/TableContext";
import { useModal } from "@/hooks/useModal";
import { PermissionService } from "@/services/permissionService";
import { NoData } from "@/components/common/NoData";
import { Loading } from "@/components/common/Loading";
import Pagination from "../../Pagination";
import { Modal } from "@/components/ui/modal";
import ModalConfirm from "@/components/example/ModalExample/ModalConfirm";

const title = [
  "STT",
  "Tên nhân viên",
  "Số điện thoại",
  "Email",
  "Giới tính",
  "Vai trò",
  "Ngày tạo",
  "Trạng thái",
  "Người thao tác",
  "Hành động",
];

export default function EmployeesTableDeleted() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tableData, setTableData] = useState<UserPermissionType[]>([]);
  const [loading, setLoading] = useState(true);
  const { urlApi, setParam } = useTableContext();

  // ✅ quản lý modal
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // đổi trang
  const onPageChange = (page: number) => {
    setCurrentPage(page);
    setParam("PageNumber", page);
  };

  // mở modal
  const handleOpenModal = (type: "restore", id: string) => {
    setSelectedId(id);
    openModal();
  };

  // load data
  const fetchDataTable = async (urlApi: string) => {
    try {
      setTableData([]);
      setLoading(true);
      const res = await PermissionService.getUserListPermission(urlApi);
      setTableData(res.items || []);
      setTotalPages(res.totalPages || 1);
      setCurrentPage(res.currentPage || 1);
    } catch (error) {
      console.error("Lỗi tải danh sách nhân viên đã khóa:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataTable(urlApi);
  }, [urlApi]);

  // Lọc chỉ lấy nhân viên đã bị khóa (isDeleted === true)
  const deletedData = tableData.filter((item) => item.isDeleted);

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table className="w-full">
              {/* Table Header */}
              <TableHeaderOne title={title} />

              {/* Body */}
              {loading && <Loading colSpan={title.length} />}
              {!loading && deletedData.length > 0 && (
                <EmployeesBodyDeleted
                  tableData={deletedData}
                  onOpenModal={handleOpenModal}
                />
              )}
              {!loading && deletedData.length === 0 && (
                <NoData colSpan={title.length} title="Không có nhân viên nào bị khóa" />
              )}
            </Table>
            {/* Pagination */}
            {!loading && deletedData.length > 0 && (
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
      {/* ✅ Modal mở khóa */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        {selectedId && (
          <ModalConfirm
            id={selectedId}
            title="Mở khóa"
            description="tài khoản nhân viên"
            onHandle={PermissionService.restoreUser}
            closeModal={closeModal}
            loadData={fetchDataTable}
            urlApi={urlApi}
          />
        )}
      </Modal>
    </div>
  );
}
