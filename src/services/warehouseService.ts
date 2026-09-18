
import {WarehouseDetailResType, WarehouseResType} from "@/schemaValidations/warehouse.schema";
import {del, get, post, put} from "@/utils/request";

export const WarehouseService = {
  getListWarehouse:(url:string)=>get<WarehouseResType>(url,{requireAuth:true}),
  createWarehouse:(data:any)=>post<WarehouseResType>('/api/Warehouse',data,{requireAuth:true}),
  infoWarehouse:(id:string)=>get<WarehouseDetailResType>(`/api/Warehouse/${id}/details`,{requireAuth:true}),
  updateWarehouse:(id:string,data:any)=>put<WarehouseResType>(`/api/Warehouse/${id}`,data,{requireAuth:true}),
  deleteWarehouse:(id:string)=>del<WarehouseDetailResType>(`/api/Warehouse`,`${id}?force=true`,{requireAuth:true}),
  restoreWarehouse:(id:string)=>put<WarehouseResType>(`/api/Warehouse/restore?idwarehouse=${id}`,undefined,{requireAuth:true})
}

