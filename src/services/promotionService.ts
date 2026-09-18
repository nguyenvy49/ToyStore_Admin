import { PromotionDRResType, PromotionResType, PromotionsResType } from "@/schemaValidations/promotion.schema";
import {del, get, post, put} from "@/utils/request";

export const PromotionService = {
  getListPromotion:(url:string)=>get<PromotionsResType>(url,{requireAuth:true}),
  createPromotion:(data:any)=>post<PromotionResType>("/api/Promotion",data,{requireAuth:true}),
  infoPromotion:(id:string)=>get<PromotionResType>(`/api/Promotion/${id}`,{requireAuth:true}),
  updatePromotion:(id:string,data:any)=>put<PromotionResType>(`/api/Promotion/${id}`,data,{requireAuth:true}),
  deletePromotion:(id:string)=>del<PromotionDRResType>(`/api/Promotion`,id,{requireAuth:true}),
  restorePromotion:(id:string)=>put<PromotionDRResType>(`/api/Promotion/restore/${id}`,undefined,{requireAuth:true}),
  approvePromotion:(id:string)=>put<PromotionDRResType>(`/api/Promotion/approve/${id}`,undefined,{requireAuth:true})
};

