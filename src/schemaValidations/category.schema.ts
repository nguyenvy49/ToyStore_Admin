import { z } from "zod";

export const CategorySchema = z.object({
  id: z.string().uuid(),
  categoryName: z.string(),
  slug: z.string(),
  parentId: z.string().uuid().nullable(),
  parentName: z.string().nullable(),
  image: z.string().nullable(),
  children: z.array(
    z.object({
      id: z.string().uuid(),
      categoryName: z.string(),
      slug: z.string(),
      parentId: z.string().uuid().nullable(),
      parentName: z.string().nullable(),
      image: z.string().nullable(),
      children: z.array(z.any()).default([]),
      isDeleted: z.boolean(),
      createdBy: z.string().nullable(),
      createdOn: z.string(),
      updatedBy: z.string().nullable(),
      updatedOn: z.string().nullable(),
      createdbyStr: z.string().nullable(),
    })
  ),
  isDeleted: z.boolean(),
  createdBy: z.string().nullable(),
  createdOn: z.string(),
  updatedBy: z.string().nullable(),
  updatedOn: z.string().nullable(),
  createdbyStr: z.string().nullable(),
});

export const CategoryListResponseSchema = z.object({
  success: z.boolean(),
  result: z.object({
    currentPage: z.number(),
    totalPages: z.number(),
    pageSize: z.number(),
    totalCount: z.number(),
    hasPrevious: z.boolean(),
    hasNext: z.boolean(),
    items: z.array(CategorySchema),
    hasFileList: z.boolean().optional(),
    checkList: z.number().optional(),
    fileIds: z.any().nullable().optional(),
  }),
  errors: z.array(z.any()),
});

export const CategoryResponseSchema = z.object({
  success: z.boolean(),
  result: CategorySchema,
  errors: z.array(z.any()),
});

export const CategoryDRResponseSchema = z.object({
  success: z.boolean(),
  result: z.string(),
  errors: z.array(z.any()),
});

export type CategoryType = z.infer<typeof CategorySchema>;
export type CategoryResType = z.infer<typeof CategoryResponseSchema>;
export type CategoriesResType = z.infer<typeof CategoryListResponseSchema>;
export type CategoryDRResType = z.infer<typeof CategoryDRResponseSchema>;
