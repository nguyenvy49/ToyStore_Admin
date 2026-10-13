import { CustomersResType } from "@/schemaValidations/customer.schema";
import { get, put } from "@/utils/request";


export const CustomerService = {
  getAllCustomer: (url: string) => get<CustomersResType>(url, { requireAuth: true }),
  lockCustomer: (id: string) => put<CustomersResType>(`/api/Customer/lock?id=${id}`, { requireAuth: true }),
  lockOpenCustomer: (id: string) => put<CustomersResType>(`/api/Customer/restore?id=${id}`, { requireAuth: true }),
};