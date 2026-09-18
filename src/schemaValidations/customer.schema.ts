import z from "zod";

const ItemSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string().min(1),
  phoneNumber: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(1),
  status: z.string().min(1),
});

const ResultSchema = z.object({
  currentPage: z.number().int(),
  totalPages: z.number().int(),
  pageSize: z.number().int(),
  totalCount: z.number().int(),
  hasPrevious: z.boolean(),
  hasNext: z.boolean(),
  items: z.array(ItemSchema),
  hasFileList: z.boolean(),
  checkList: z.number().int(),
  fileIds: z.nullable(z.any()), // nếu bạn biết kiểu cụ thể của fileIds thì thay z.any() bằng kiểu đó
});

export const ResponseSchema = z.object({
  success: z.boolean(),
  result: ResultSchema,
  errors: z.array(z.unknown()), // nếu errors luôn là mảng string thì dùng z.array(z.string())
});

// TypeScript types (tuỳ chọn)
export type CustomerType = z.infer<typeof ItemSchema>;
export type Result = z.infer<typeof ResultSchema>;
export type CustomersResType = z.infer<typeof ResponseSchema>;
