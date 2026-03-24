import { NextResponse } from "next/server";
import sql from "@/lib/db";

// Vercel Cron 定時 ping，防止 Neon DB 冷啟動
export async function GET(request) {
  // 驗證是否為 Vercel Cron 發起的請求
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await sql(`SELECT 1`);
    return NextResponse.json({ success: true, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Keep-alive ping failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
