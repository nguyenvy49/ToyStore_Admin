import { CreateUserResType, UserPermissionListResType } from "@/schemaValidations/permission.schema";
import { get, post, put } from "@/utils/request";

export const PermissionService = {
  getUserListPermission:(url:string)=>get<UserPermissionListResType>(url,{requireAuth:true}),
  createUser:(data:Record<string,any>)=>post<CreateUserResType>('/api/Auth/sign-up',data,{requireAuth:true}),
  grantPermission:(id:string,data:Record<string,any>)=>post<any>(`/api/Permission/update-staff-type-permissions/${id}`,data,{requireAuth:true}),
  lockUser:(id:string)=>put<any>(`/apiStaff/lock?id=${id}`,undefined, {requireAuth:true}),
  restoreUser:(id:string)=>put<any>(`/apiStaff/restore?id=${id}`,undefined, {requireAuth:true}),
  getListPermission:() => get<any>('/api/Permission/all',{requireAuth:true}),
  getListPermissionByStaffType:(staffType:number) => get<any>(`/api/Permission/staff-type/${staffType}`,{requireAuth:true}),
  getPermissionUser:() => get<any>(`/api/Permission/user`,{requireAuth:true}),
  addStaffTypePermission:(data:Record<string,any>)=>post<any>('/api/Permission/add-staff-type-permissions',data,{requireAuth:true}),
};

