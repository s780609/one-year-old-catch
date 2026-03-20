import { NextResponse } from "next/server";

// 需要登入才能存取的路徑
const PROTECTED_PATHS = ["/test-neondb", "/api/test-neondb"];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // /api/chosen 的 POST/DELETE 需要驗證，GET 不需要
  if (pathname.startsWith("/api/chosen") && request.method !== "GET") {
    const token = request.cookies.get("admin_token")?.value;
    const expectedToken = process.env.ADMIN_TOKEN || "fallback-token";
    if (!token || token !== expectedToken) {
      return NextResponse.json(
        { success: false, error: "未授權，請先登入" },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // 只保護指定路徑
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // 登入 API 不需要驗證（否則無法登入）
  if (pathname === "/api/admin/login") return NextResponse.next();

  // 檢查 cookie（比對獨立 token，不暴露密碼）
  const token = request.cookies.get("admin_token")?.value;
  const expectedToken = process.env.ADMIN_TOKEN || "fallback-token";
  if (!token || token !== expectedToken) {
    // API 路徑回 401 JSON
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, error: "未授權，請先登入" },
        { status: 401 }
      );
    }
    // 頁面路徑導向登入頁
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/test-neondb/:path*", "/api/test-neondb/:path*", "/api/chosen/:path*"],
};
