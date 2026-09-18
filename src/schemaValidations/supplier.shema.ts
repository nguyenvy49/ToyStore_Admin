// supplier.schema.ts
import { z } from "zod";

// 1️⃣ Schema cho 1 nhà cung cấp
export const SupplierSchema = z.object({
  id: z.string().uuid(),
  supplierName: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string(),
  note: z.string().nullable().optional(),
  isDeleted: z.boolean(),
  createdBy: z.string().nullable(),
  createdOn: z.string(), // ISO string
  updatedBy: z.string().nullable().optional(),
  updatedOn: z.string().nullable().optional(),
  createdbyStr: z.string().nullable(),
  updatedbyStr: z.string().nullable(),
  approvedBy: z.string().uuid().nullable().optional(),
  approvedByName: z.string().optional(),
  isApproved: z.boolean().optional(),
  approvedOn: z.string().nullable().optional(),
  slug: z.string().optional(),
  image: z.string().optional(),
}).strict();

export type SupplierType = z.infer<typeof SupplierSchema>;

// 2️⃣ Schema cho response chi tiết 1 supplier
export const SupplierResponseSchema = z.object({
  success: z.boolean(),
  result: SupplierSchema,
  errors: z.array(z.string()),
});

export type SupplierResType = z.infer<typeof SupplierResponseSchema>;

// 3️⃣ Schema cho response danh sách suppliers (có phân trang)
export const SuppliersResponseSchema = z.object({
  success: z.boolean(),
  result: z.object({
    currentPage: z.number().int(),
    totalPages: z.number().int(),
    pageSize: z.number().int(),
    totalCount: z.number().int(),
    hasPrevious: z.boolean(),
    hasNext: z.boolean(),
    items: z.array(SupplierSchema),
    hasFileList: z.boolean().optional(),
    checkList: z.number().optional(),
    fileIds: z.any().nullable().optional(),
  }),
  errors: z.array(z.any()),
});

export type SuppliersResType = z.infer<typeof SuppliersResponseSchema>;

// 4️⃣ Schema cho response xóa supplier
export const SupplierDRResponseSchema = z.object({
  success: z.boolean(),
  result: z.boolean(),
  errors: z.array(z.string()),
});

export type SupplierDRResType = z.infer<typeof SupplierDRResponseSchema>; 
