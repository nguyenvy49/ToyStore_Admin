import { z } from "zod";

/**
 * Chi tiết 1 dòng trong `details`
 */
const WarehouseDetailSchema = z.object({
  productId: z.string().uuid(),
  productName: z.string(),
  supplierName: z.string(),
  warehouseId: z.string().uuid(),
  quantity: z.number().int(),
  importPrice: z.number(),
  totalPrice: z.number(),
  status: z.number().int(),
  createdBy: z.string(),
  createdOn: z.string().datetime(),          // ISO datetime (e.g. "2025-10-16T14:17:32.498103Z")
  updatedBy: z.string().nullable(),
  updatedOn: z.string().datetime().nullable()
});

/**
 * 1 item trong mảng items (một bản ghi kho)
 */
const WarehouseItemSchema = z.object({
  id: z.string().uuid(),
  dateEntered: z.string().datetime(),
  totalPrice: z.number(),
  createdBy: z.string(),
  createdOn: z.string().datetime(),          // ISO datetime (e.g. "2025-10-16T14:17:32.498103Z")
  updatedBy: z.string().nullable(),
  updatedOn: z.string().datetime().nullable(),
  details: z.array(WarehouseDetailSchema)
});

/**
 * Phần result chính
 */
const ResultSchema = z.object({
  currentPage: z.number().int(),
  totalPages: z.number().int(),
  pageSize: z.number().int(),
  totalCount: z.number().int(),
  hasPrevious: z.boolean(),
  hasNext: z.boolean(),
  items: z.array(WarehouseItemSchema),
  hasFileList: z.boolean(),
  checkList: z.number().int(),
  // sample shows null; nếu thực tế có thể là mảng id thì đổi thành z.array(z.string()).nullable()
  fileIds: z.array(z.string()).nullable()
});

/**
 * Toàn bộ response
 */
export const WarehouseDetailResSchema = z.object({
  success: z.boolean(),
  result: WarehouseItemSchema,
  errors: z.array(z.unknown())
});
export const WarehouseResSchema = z.object({
  success: z.boolean(),
  result: ResultSchema,
  errors: z.array(z.unknown())
});

/** TypeScript types inferred */
export type WarehouseDetailResType = z.infer<typeof WarehouseDetailResSchema>;
export type WarehouseItemType = z.infer<typeof WarehouseItemSchema>;
export type WarehouseType = z.infer<typeof ResultSchema>;
export type WarehouseResType = z.infer<typeof WarehouseResSchema>;
