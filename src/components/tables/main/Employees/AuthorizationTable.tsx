"use client"

import Button from "@/components/ui/button/Button";
import { Table } from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import TableHeaderOne from "../../header/TableHeaderOne";
import AuthorizationBody from "../../body/Employees/AuthorizationBody";
import { PermissionService } from "@/services/permissionService";
import { groupPermissions } from "@/utils/format";
import { PermissionType } from "@/schemaValidations/permission.schema";
import { Loading } from "@/components/common/Loading";
import { NoData } from "@/components/common/NoData";
import { useNotification } from "@/context/NotificationContext";
import { useUserPermission } from "@/context/UserPermissionContext";

interface PermissionsUser {
  sale: PermissionType[];
  warehouse: PermissionType[];
}

const title = ["Chức năng", "Nhân viên bán hàng", "Nhân viên kho"];

export default function BasicTables() {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [roleState, setRoleState] = useState<PermissionsUser>({
    sale: [],
    warehouse: [],
  });
  const { openNotification } = useNotification();
  const { refreshPermissions } = useUserPermission();

  const [loading, setLoading] = useState(true);
  const [loadingPermission, setLoadingPermission] = useState(false);

  // Lấy tất cả permissions
  const fetchDataTable = async () => {
    try {
      setLoading(true);

      const [resAll, resSales, resWarehouse] = await Promise.all([
        PermissionService.getListPermission().catch((err) => {
          console.error("Lỗi getListPermission:", err);
          return [];
        }),
        PermissionService.getListPermissionByStaffType(1).catch((err) => {
          console.error("Lỗi getListPermissionByStaffType(1):", err);
          return [];
        }),
        PermissionService.getListPermissionByStaffType(2).catch((err) => {
          console.error("Lỗi getListPermissionByStaffType(2):", err);
          return [];
        }),
      ]);

      const parsePermissionList = (data: any): PermissionType[] => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (Array.isArray(data.result)) return data.result;
        if (Array.isArray(data.items)) return data.items;
        if (Array.isArray(data.data)) return data.data;
        return [];
      };

      const uniquePermissions = (list: PermissionType[]) => {
        const map = new Map<string, PermissionType>();
        list.forEach((item) => {
          if (item?.id) map.set(item.id, item);
        });
        return Array.from(map.values());
      };

      const salesList = parsePermissionList(resSales);
      const warehouseList = parsePermissionList(resWarehouse);
      const allList = parsePermissionList(resAll);

      setRoleState({
        sale: uniquePermissions(salesList),
        warehouse: uniquePermissions(warehouseList),
      });

      setPermissions(groupPermissions(allList));
    } catch (error) {
      console.error("Lỗi tải dữ liệu phân quyền:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDataTable();
  }, []);

  const handleSave = () => {
    // Gọi API lưu phân quyền ở đây
    const payloadSales = {
      staffType: 1, // Ví dụ: nhân viên bán hàng
      permissionIds: roleState.sale.map((p) => p.id),
    }
    const payloadWarehouse = {
      staffType: 2, // Ví dụ: nhân viên kho
      permissionIds: roleState.warehouse.map((p) => p.id),
    }

    const savePermissions = async () => {
      try {
        setLoadingPermission(true);
        const res1 = await PermissionService.addStaffTypePermission(payloadSales);
        const res2 = await PermissionService.addStaffTypePermission(payloadWarehouse);
        console.log("Kết quả phân quyền: ", res1, res2);

        await refreshPermissions?.();

        // Thông báo thành công hoặc cập nhật giao diện nếu cần
        openNotification({
          message: `Thành công`,
          description: `Phân quyền thành công`,
          placement: "top",
          duration: 3,
          style: { borderLeft: "5px solid green" },
        });
      } catch (error) {
        openNotification({
          message: `Thất bại`,
          description: `Phân quyền thất bại: ` + error,
          placement: "top",
          duration: 3,
          style: { borderLeft: "5px solid red" },
        });
      } finally {
        setLoadingPermission(false);
      }
    }
    savePermissions();
  };

  return (
    <div>
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="px-6 py-5">
          <Button size="sm" variant="info" onClick={handleSave} disabled={loadingPermission}>
            {loadingPermission ? "Đang phân quyền..." : "Phân quyền"}
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table className="w-full">
              <TableHeaderOne title={title} />
              {loading && (
                <Loading colSpan={title.length} />
              )}
              {!loading && permissions.length > 0 && (
                <AuthorizationBody
                  tableData={permissions}
                  role={roleState}
                  onChange={setRoleState}
                />
              )}
              {!loading && permissions.length === 0 && (
                <NoData colSpan={title.length} title="Chưa có dữ liệu chức năng để phân quyền" />
              )}
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}