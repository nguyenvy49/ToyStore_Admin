
import { SupplierDRResType, SupplierResType, SuppliersResType } from "@/schemaValidations/supplier.shema";
import { del, get, post, put } from "@/utils/request";

export const SupplierService = {
  // Lấy danh sách supplier có phân trang
  getListSupplier: (url: string) => get<SuppliersResType>(url, { requireAuth: true }),
  // Tạo mới supplier
  createSupplier: (data: any) => post<SupplierResType>("/api/Supplier/Supplier", data, { requireAuth: true }),
  infoSupplier:(id:string)=>get<SupplierResType>(`/api/Supplier/${id}`,{requireAuth:true}),
  // Cập nhật supplier
  updateSupplier: (id: string, data: any) => put<SupplierResType>(`/api/Supplier/${id}`, data, { requireAuth: true }),
  //Xóa supplier
  deleteSupplier: (id: string) => del<SupplierDRResType>(`/api/Supplier`, id, { requireAuth: true }),
  // Khôi phục supplier
  restoreSupplier: (id: string) => put<SupplierDRResType>(`/api/Supplier/restore?idsupplier=${id}`, undefined, { requireAuth: true }),
};
