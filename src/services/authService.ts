import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";
import { UserResType } from "@/schemaValidations/user.schema";
import {get, post} from "@/utils/request";

export const AuthService = {
  login: (data: LoginBodyType) =>
    post<LoginResType>("/api/Auth/sign-in", data, {
      requireAuth: false,
      credentials: 'include'
    }),
  auth: (data: { sessionToken: string; expiresAt?: string; roleUser?: string}) =>
    post<LoginResType>("/api/auth", data,{
      requireAuth: false,
      baseUrl: ""
    }),
  logout: async (force?: boolean) => {
    try {
      await post("/api/auth/sign-out", { force }, { requireAuth: false,baseUrl: "" });
      return true;
    } catch (err) {
      console.warn("Logout API failed:", err);
      return false;
    }
  },
  getProfile:() => get<UserResType>("/api/Auth/get-profile",{requireAuth:true})
};