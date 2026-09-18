import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string().uuid(),
  productName: z.string(),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  quantity: z.number().int().nonnegative(),
  supplier: z.object({
    id: z.string().uuid(),
    name: z.string().nullable()
  }),
  category: z.object({
    id: z.string().uuid(),
    categoryName: z.string().nullable(),
    parentId: z.string().uuid().nullable(),
    parentName: z.string().nullable(),
    childId: z.string().uuid().nullable(),
    childName: z.string().nullable()
  }),
  promotion: z.any().nullable(),
  image: z.array(z.string()).optional(),
  productStatus: z.number().int(),
  slug: z.string(),
  isDeleted: z.boolean(),
  createdBy: z.string().optional(),
  createdOn: z.string(),
  updatedBy: z.string().nullable(),
  updatedOn: z.string().nullable()
}).strict();

export type ProductType = z.infer<typeof ProductSchema>;

export const ProductRes = z.object({
    success: z.boolean(),
    result: z.object({
        currentPage: z.number().int().nonnegative(),
        totalPages: z.number().int().nonnegative(),
        pageSize: z.number().int().nonnegative(),
        totalCount: z.number().int().nonnegative(),
        hasPrevious: z.boolean(),
        hasNext: z.boolean(),
        items: z.array(ProductSchema),
        hasFileList: z.boolean(),
        checkList: z.number().int(),
        fileIds: z.array(z.string()).nullable()
    }),
    errors: z.array(z.any())
}).strict() 

export type ProductResType = z.infer<typeof ProductRes>

export const ProductDRResponseSchema = z.object({
  success: z.boolean(),
  result: z.string(),
  errors: z.array(z.string()),
});

export type ProductDRResType = z.infer<typeof ProductDRResponseSchema>;

export const ProductDetailResponseSchema = z.object({
  success: z.boolean(),
  result: ProductSchema,
  errors: z.array(z.string()),
})

export type ProductDetailResType = z.infer<typeof ProductDetailResponseSchema>