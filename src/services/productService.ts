import { ProductDetailResType, ProductDRResType, ProductResType } from "@/schemaValidations/product.schema";
import {del, get, post, put} from "@/utils/request";

export const ProductService = {
  getListProduct:(url:string)=>get<ProductResType>(url,{requireAuth:true}),
  infoProduct:(id:string)=>get<ProductDetailResType>(`/api/Product/${id}`,{requireAuth:true}),
  createProduct:(data:any)=>post<ProductDetailResType>("/api/Product",data,{requireAuth:true}),
  updateProduct:(id:string,data:any)=>put<ProductResType>(`/api/Product/${id}`,data,{requireAuth:true}),
  deleteProduct:(id:string)=>del<ProductDRResType>(`/api/Product`,id,{requireAuth:true}),
  restoreProduct:(id:string)=>put<ProductDRResType>(`/api/Product/restore/${id}`,undefined,{requireAuth:true})
};

