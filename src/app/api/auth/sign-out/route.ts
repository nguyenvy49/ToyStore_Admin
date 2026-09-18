import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const force = body?.force as boolean | undefined;

    // Tạo response rỗng
    const res = NextResponse.json(
      { message: force ? "Buộc đăng xuất thành công" : "Đăng xuất thành công" },
      { status: 200 }
    ); 

    // Xóa cookie server-side
    res.cookies.set("sessionToken", "", { path: "/", maxAge: 0, httpOnly: true, sameSite: "strict" });
    res.cookies.set("roleUser", "", { path: "/", maxAge: 0, httpOnly: true, sameSite: "strict" });

    return res;
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Lỗi không xác định: " + (error as any)?.message || error },
      { status: 500 }
    );
  }
}
