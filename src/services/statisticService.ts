import { get } from "@/utils/request";

export const StatisticService = {
  statistic:(url:string)=>get<any>(url,{requireAuth:true}),
  statisticMonth:(url:string,month:number,year:number)=>get<any>(`${url}/${year}/${month}`,{requireAuth:true}),
  statisticYear:(url:string,year:number)=>get<any>(`${url}/${year}`,{requireAuth:true}),
};

