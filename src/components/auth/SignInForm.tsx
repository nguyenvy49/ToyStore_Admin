"use client";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import React, { useState } from "react";
import InputForm from "../form/form-elements/InputForm";
import Form from "../form/Form";
import { LoginResType } from "@/schemaValidations/auth.schema";
import { AuthService } from "@/services/authService";
import { useRouter } from 'next/navigation'
import { useNotification } from "@/context/NotificationContext";

export default function SignInForm() {
  const router = useRouter()
  const { openNotification } = useNotification()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true)
      setErrorMessage("") // reset lỗi trước khi submit
      const res: LoginResType = await AuthService.login(values)
      console.log(res)


      const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000)

      await AuthService.auth({
        roleUser: res.result.user.roles[0],
        sessionToken: res.result.accessToken,
        expiresAt: expiresAt.toISOString(),
      })

      openNotification({
        message: "Đăng nhập",
        description: "Đăng nhập thành công!",
        placement: "top",
        duration: 3
      })

      router.push("/")
    } catch (err) {
      setErrorMessage("Tài khoản hoặc mật khẩu không chính xác!")
      console.error("❌ Login failed:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Đăng nhập
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nhập email và mật khẩu để đăng nhập!
            </p>
          </div>
          <div>
            <Form onSubmit={handleSubmit} className="space-y-5" method="POST">
              <div className="space-y-6">
                <div>
                  <Label>Email <span className="text-error-500">*</span></Label>
                  <InputForm name="username" placeholder="info@gmail.com" type="email" disabled={loading} />
                </div>
                <div>
                  <Label>Password <span className="text-error-500">*</span></Label>
                  <div className="relative">
                    <InputForm
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      disabled={loading} 
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                    </span>
                  </div>
                </div>
                {errorMessage && (
                  <p className="text-red-500 text-sm justify-center">{errorMessage}</p>
                )}
                <div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="sm" 
                    disabled={loading}
                  >
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
