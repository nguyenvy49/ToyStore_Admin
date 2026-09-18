import { z } from "zod";

// Schema cho 1 bản tin
export const NewsSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),                  // đường dẫn thân thiện
  content: z.string(),               // nội dung chính
  description: z.string().optional(),// mô tả ngắn
  author: z.string().nullable(),     // tác giả
  image: z.string().url().nullable(), // ảnh đại diện
  tags: z.array(z.string()).optional(),   // thẻ tag
  status: z.enum(["draft", "published", "archived"]), // trạng thái
  isApproved: z.boolean().default(false), // đã duyệt hay chưa
  isDeleted: z.boolean().default(false),
  createdOn: z.string(),             // ngày tạo
  createdBy: z.string().optional(),  
  updatedOn: z.string().nullable(),  // ngày cập nhật
  updatedBy: z.string().nullable()
}).strict();

export type NewsType = z.infer<typeof NewsSchema>;

// Schema cho response có phân trang
export const NewsRes = z.object({
  success: z.boolean(),
  result: z.object({
    currentPage: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
    pageSize: z.number().int().nonnegative(),
    totalCount: z.number().int().nonnegative(),
    hasPrevious: z.boolean(),
    hasNext: z.boolean(),
    items: z.array(NewsSchema), // danh sách tin tức
  }),
  errors: z.array(z.any())
}).strict();

export type NewsResType = z.infer<typeof NewsRes>;


export const NewsDetailRes = z.object({
  success: z.boolean(),
  result: z.object({
    id: z.string().uuid(),
    image: z.string(),                       // ảnh tin tức
    title: z.string(),
    content: z.string(),
    createdBy: z.string(),
    createdOn: z.string(),
    slug: z.string(),
    approvedBy: z.string().uuid(),
    approvedByName: z.string(),
    isApproved: z.boolean(),
    approvedOn: z.string(),
    isDeleted: z.boolean(),
    createdbyStr: z.string()
  }),
  errors: z.array(z.any())
}).strict();

export type NewsDetailResType = z.infer<typeof NewsDetailRes>;

export const NewsDeleteRes = z.object({
  success: z.boolean(),
  result: z.string(),
  errors: z.array(z.string())
}).strict();

export type NewsDeleteResType = z.infer<typeof NewsDeleteRes>;


