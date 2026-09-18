import z from "zod";
import { UserSchema } from "./user.schema";


// Login request/response
export const LoginBody = z
  .object({
    username: z.string().email(),
    password: z.string().min(6).max(100),
  })
  .strict();

export type LoginBodyType = z.infer<typeof LoginBody>;

export const LoginRes = z.object({
  success: z.boolean(),
  result: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    tokenType: z.string(),
    expiryIn: z.number(),
    expires: z.string(), // ISO date string
    user: UserSchema,
  }),
  errors: z.array(z.string()), // có thể là list lỗi
}).strict();

// Type suy ra từ schema
export type LoginResType = z.infer<typeof LoginRes>;