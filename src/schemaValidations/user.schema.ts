import z from "zod";

export const UserSchema = z.object(
    {
        id: z.string(),
        fullName: z.string(),
        email: z.string().email(),
        phoneNumber: z.string().nullable(),
        gender: z.number(), // 0: male, 1: female (ví dụ)
        address: z.string().nullable(),
        avatarUrl: z.string().nullable(),
        roles: z.array(z.string()),
        accessToken: z.string(),
        refreshToken: z.string(),
        expireAt: z.string(),
    }
)
export type UserType = z.infer<typeof UserSchema>

export const UserResultSchema = z.object({
  id: z.string(),
  userName: z.string(),
  fullName: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  address: z.string(),
  localPicture: z.string(),
  gender: z.number(),
  roles: z.array(z.string()),
  lastLogin: z.string(),
  isDeleted: z.boolean(),
  createdBy: z.string(),
  createdOn: z.string(),
  updatedBy: z.string(),
  updatedOn: z.string(),
});


export const UserResponseSchema = z.object({
  success: z.boolean(),
  result: UserResultSchema,
  errors: z.array(z.string()),
});

export type InfoUserType = z.infer<typeof UserResultSchema>;
export type UserResType = z.infer<typeof UserResponseSchema>;