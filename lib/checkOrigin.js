import { NextResponse } from "next/server";

/**
 * 檢查請求是否來自本站
 * 防止外部工具（Postman、curl）或其他網站直接呼叫 API
 * @param {Request} request
 * @returns {NextResponse|null} 若不合法回傳 403 回應，合法回傳 null
 */
export function checkOrigin(request) {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // 允許的來源（開發環境 + 正式站）
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
  ];

  // 自動加入 Vercel 部署的網域
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    allowedOrigins.push(`https://${vercelUrl}`);
  }
  // 也可以手動加自訂域名
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    allowedOrigins.push(siteUrl.replace(/\/$/, ""));
  }

  // 檢查 Origin header
  if (origin) {
    if (allowedOrigins.some((allowed) => origin.startsWith(allowed))) {
      return null; // 合法
    }
    return NextResponse.json(
      { success: false, error: "禁止存取：來源不允許" },
      { status: 403 }
    );
  }

  // 沒有 Origin 時檢查 Referer（某些瀏覽器不帶 Origin）
  if (referer) {
    if (allowedOrigins.some((allowed) => referer.startsWith(allowed))) {
      return null; // 合法
    }
    return NextResponse.json(
      { success: false, error: "禁止存取：來源不允許" },
      { status: 403 }
    );
  }

  // 都沒有（Postman、curl 等工具）→ 拒絕
  return NextResponse.json(
    { success: false, error: "禁止存取：缺少來源資訊" },
    { status: 403 }
  );
}
