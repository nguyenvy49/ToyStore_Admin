import { OrderResType, OrdersResType } from "@/schemaValidations/order.schema";
import { get, post, put } from "@/utils/request";

export const OrderService = {
  getListOrder:(url:string)=>get<OrdersResType>(url,{requireAuth:true}),
  createOrder:(data:any)=>post<OrderResType>('/api/Order',data,{requireAuth:true}),
  infoOrder:(id:string)=>get<OrderResType>(`/api/Order/${id}`,{requireAuth:true}),
  updateOrder:(id:string,data:any)=>put<OrderResType>(`/api/Order/${id}`,data,{requireAuth:true}),
};