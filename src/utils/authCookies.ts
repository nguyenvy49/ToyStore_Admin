// src/utils/serverCookies.ts
import { cookies } from "next/headers";

export function getServerCookie(name: string): string | null {
  const cookieStore = cookies() as any; // sync
  return cookieStore.get(name)?.value ?? null;
}

export function getClientCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}