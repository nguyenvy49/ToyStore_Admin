import { z } from "zod";

export const UserPermissionSchema = z.object({
  id: z.string(),
  userName: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().nullable(),
  address: z.string().nullable(),
  localPicture: z.string().nullable(),
  staffType: z.number(),
  gender: z.number().nullable(),
  roles: z.array(z.string()),
  lastLogin: z.string().nullable(),
  isDeleted: z.boolean(),
  createdBy: z.string(),
  createdOn: z.string(),
  updatedBy: z.string(),
  updatedOn: z.string(),
});

export const UserPermissionListResSchema = z.object({
  currentPage: z.number(),
  totalPages: z.number(),
  pageSize: z.number(),
  totalCount: z.number(),
  hasPrevious: z.boolean(),
  hasNext: z.boolean(),
  items: z.array(UserPermissionSchema),
  hasFileList: z.boolean(),
  checkList: z.number(),
  fileIds: z.array(z.string()).nullable(),
});

// ✅ TypeScript type inference
export type UserPermissionType = z.infer<typeof UserPermissionSchema>;
export type UserPermissionListResType = z.infer<typeof UserPermissionListResSchema>;

export const CreateUserRes = z.object({
  success: z.boolean(),
  result: z.object({
    ok: z.boolean(),
    userId: z.string().uuid(),
    message: z.string(),
  }),
  errors: z.array(z.string()),
});

// 👉 Nếu muốn lấy type từ schema
export type CreateUserResType = z.infer<typeof CreateUserRes>;

export const PermissionSchema = z.object({
  id: z.string(),
  code: z.string(),       // ví dụ: "CATEGORY_CREATE"
  name: z.string(),       // ví dụ: "Tạo danh mục"
  isGranted: z.boolean(),
  checkedSales: z.boolean().optional(),
  checkedWarehouse: z.boolean().optional(),
});

export const PermissionListSchema = z.object({
  id: z.number(),
  name: z.string(),               // ví dụ: "Quản lý danh mục"
  role: z.array(PermissionSchema) // Permission[]
});

/** Inferred TS types (optional, nếu muốn dùng chung) */
export type PermissionType = z.infer<typeof PermissionSchema>;
export type PermissionListType = z.infer<typeof PermissionListSchema>;

export const UserPermissionsSchema = z.object({
  userId: z.string().uuid(),
  userName: z.string(),
  permissions: z.array(PermissionSchema),
});
export type UserPermissionsType = z.infer<typeof UserPermissionsSchema>;