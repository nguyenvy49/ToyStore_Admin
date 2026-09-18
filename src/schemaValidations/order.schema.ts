import { z } from "zod";

export const PromotionSchema = z.object({
  title: z.string(),
  discountPercent: z.number(),
  endDate: z.string(), // ISO date string
});

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  promotion: PromotionSchema.nullable(), // có thể null
  discountedPrice: z.number(),
});

export const OrderDetailSchema = z.object({
  product: ProductSchema,
  quantity: z.number(),
  price: z.number(),
  totalPrice: z.number(),
});

export const OrderItemSchema = z.object({
  id: z.string(),
  user: z.object({
    id: z.string(),
    fullName: z.string(),
  }),
  orderDate: z.string(), // ISO date string
  phone: z.string(),
  address: z.string(),
  totalPrice: z.number(),
  orderStatus: z.number(), // 0,1,2,3,4,...
  createdBy: z.string(),
  createdOn: z.string(), // ISO date string
  updatedBy: z.string().nullable(),
  updatedOn: z.string().nullable(),
  orderDetails: z.array(OrderDetailSchema),
});
export type OrderType = z.infer<typeof OrderItemSchema>;
export const ResultSchema = z.object({
  currentPage: z.number(),
  totalPages: z.number(),
  pageSize: z.number(),
  totalCount: z.number(),
  hasPrevious: z.boolean(),
  hasNext: z.boolean(),
  items: z.array(OrderItemSchema),
  hasFileList: z.boolean(),
  checkList: z.number(),
  fileIds: z.string().nullable(),
});

export const OrdersResponseSchema = z.object({
  success: z.boolean(),
  result: ResultSchema,
  errors: z.array(z.unknown()), // mảng lỗi có thể trống
});
export const OrderResponseSchema = z.object({
  success: z.boolean(),
  result: OrderItemSchema,
  errors: z.array(z.unknown()), // mảng lỗi có thể trống
});

// ✅ Xuất type tương ứng (nếu bạn dùng TypeScript)
export type OrdersResType = z.infer<typeof OrdersResponseSchema>;
export type OrderResType = z.infer<typeof OrderResponseSchema>;