import { z } from "zod";

// Schema cho 1 bản tin
export const PromotionSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional().nullable(),
  discountPercent: z.number().nonnegative().optional(),
  startDate: z.string().datetime(),  // dạng ISO string
  endDate: z.string().datetime(),
  approvedBy: z.string().uuid().nullable().optional(),
  isApproved: z.boolean(),
  products: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      price: z.number().nonnegative(),
      promotion: z
        .object({
          title: z.string(),
          discountPercent: z.number().nonnegative()
        })
        .nullable()
        .optional(),
      discountedPrice: z.number().nonnegative()
    })
  ),
  slug: z.string(),
  isDeleted: z.boolean(),
  createdBy: z.string().uuid(),
  createdOn: z.string().datetime(),
  updatedBy: z.string().uuid().nullable().optional(),
  updatedOn: z.string().datetime().nullable().optional()
}).strict();

export type PromotionType = z.infer<typeof PromotionSchema>;

// Schema cho response có phân trang
export const PromotionsResponseSchema = z.object({
  success: z.boolean(),
  result: z.object({
    currentPage: z.number().int(),
    totalPages: z.number().int(),
    pageSize: z.number().int(),
    totalCount: z.number().int(),
    hasPrevious: z.boolean(),
    hasNext: z.boolean(),
    items: z.array(PromotionSchema),
    hasFileList: z.boolean().optional(),
    checkList: z.number().optional(),
    fileIds: z.any().nullable().optional()
  }),
  errors: z.array(z.any())
});

export type PromotionsResType = z.infer<typeof PromotionsResponseSchema>;

export const PromotionResponseSchema = z.object({
  success: z.boolean(),
  result: z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    discountPercent: z.number(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    approvedBy: z.string().uuid(),
    isApproved: z.boolean(),
    products: z.array(
      z.object({
        id: z.string().uuid(),
        name: z.string(),
        price: z.number(),
        promotion: z.object({
          title: z.string(),
          discountPercent: z.number(),
        }),
        discountedPrice: z.number(),
      })
    ),
    slug: z.string(),
    isDeleted: z.boolean(),
    createdBy: z.string(),
    createdOn: z.string().datetime(),
    updatedBy: z.string(),
    updatedOn: z.string().datetime(),
  }),
  errors: z.array(z.string()),
});
export type PromotionResType = z.infer<typeof PromotionResponseSchema>;

export const PromotionDRResponseSchema = z.object({
  success: z.boolean(),
  result: z.boolean(),
  errors: z.array(z.string()),
})
export type PromotionDRResType = z.infer<typeof PromotionDRResponseSchema>