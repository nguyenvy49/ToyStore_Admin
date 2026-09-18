import envConfig from "@/config/envConfig"
import { redirect } from "next/navigation"

type BodyType = Record<string, any> | FormData

type CustomOption = Omit<RequestInit, "method" | "body"> & {
  baseUrl?: string
  body?: BodyType
  token?: string
  role?: string
  requireAuth?: boolean
  requireManager?: boolean
}

const API_DOMAIN =
  envConfig.NEXT_PUBLIC_API_URL ||
  "https://cua-hang-do-choi-be.onrender.com"

const redirectToLogin = (server = false) => {
  if (server) {
    redirect("/signin")
  } else {
    // Xoá cookie client-side
    document.cookie = "sessionToken=; Max-Age=0; path=/"
    document.cookie = "roleUser=; Max-Age=0; path=/"
    window.location.href = "/signin"
  }
}

// Lấy cookie bất kỳ theo tên
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

const makeHeaders = (
  token?: string,
  isFormData?: boolean,
  customHeaders?: HeadersInit
) => {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(customHeaders as Record<string, string>),
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  if (!isFormData) {
    headers["Content-Type"] = "application/json"
  }

  return headers
}

const request = async <T>(
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT",
  path: string,
  options?: CustomOption
): Promise<T> => {
  const requireAuth = options?.requireAuth ?? true
  const requireManager = options?.requireManager ?? false

  // --- Client vs Server ---
  let token: string | undefined
  let role: string | undefined
  if (typeof window !== "undefined") {
    // CLIENT: tự lấy token + role từ cookie
    token = getCookie("sessionToken") || options?.token
    role = getCookie("roleUser") || options?.role
  } else {
    // SERVER: chỉ lấy từ options
    token = options?.token
    role = options?.role
  }
  if (requireAuth && !token) {
    if (typeof window !== "undefined") {
      redirectToLogin(false)
    } else {
      redirectToLogin(true)
    }
    console.log("Unauthorized - Missing token")
    throw new Error("Unauthorized - Missing token")
  }

  if (requireManager && role !== "manager") {
    console.log("Unauthorized - Missing token")
    throw new Error("Forbidden - Requires manager role")
  }

  const data = options?.body
  const isFormData = data instanceof FormData
  const baseUrl = options?.baseUrl ?? API_DOMAIN
  const url = `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`

  const fetchOptions: RequestInit = {
    ...options,
    method,
    headers: makeHeaders(token, isFormData, options?.headers),
    body:
      data && method !== "GET" && method !== "DELETE"
        ? isFormData
          ? data
          : JSON.stringify(data)
        : undefined,
  }
  // ❗ Nếu là GET hoặc DELETE => bỏ Content-Type
  if (method === "GET" || method === "DELETE") {
    delete (fetchOptions.headers as any)["Content-Type"];
    delete (fetchOptions as any).body;
  }
  console.log(fetchOptions)

  const res = await fetch(url, fetchOptions)

  let responseBody: any
  try {
    responseBody = await res.json()
  } catch {
    responseBody = null
  }

  return responseBody as T
}

// --- Wrapper methods ---
export const get = <T>(path: string, options?: CustomOption) =>
  request<T>("GET", path, options)

export const post = <T>(
  path: string,
  data: BodyType,
  options?: Omit<CustomOption, "body">
) => request<T>("POST", path, { ...options, body: data })

export const put = <T>(
  path: string,
  data?: BodyType,
  options?: Omit<CustomOption, "body">
) => {
  const requestOptions = data
    ? { ...options, body: data }
    : { ...options };

  return request<T>("PUT", path, requestOptions);
};


export const patch = <T>(
  path: string,
  data?: BodyType,
  options?: Omit<CustomOption, "body">
) => {
  const requestOptions = data
    ? { ...options, body: data }
    : { ...options };

  return request<T>("PATCH", path, requestOptions);
};

export const del = <T>(
  path: string,
  id: string | number,
  options?: CustomOption
) => request<T>("DELETE", `${path}/${id}`, options)
