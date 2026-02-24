import { NextResponse } from "next/server";
import sql from "@/lib/db";

// 禁用 Vercel 靜態快取，確保每次都從資料庫拿最新資料
export const dynamic = "force-dynamic";

// GET: 取得投票排行和所有投票紀錄（給結果頁用）
export async function GET() {
  try {
    // 直接用 votes 表 COUNT，不依賴 vote_items.vote_count（避免不同步）
    const items = await sql`
      SELECT vi.name,
             COALESCE(vc.real_count, 0)::int AS vote_count
      FROM vote_items vi
      LEFT JOIN (
        SELECT item_name, COUNT(*) AS real_count
        FROM votes
        GROUP BY item_name
      ) vc ON vi.name = vc.item_name
      ORDER BY vote_count DESC, vi.name
    `;

    // 取得所有投票紀錄（誰投了什麼）
    const votes = await sql`
      SELECT voter_name, item_name, voted_at FROM votes ORDER BY voted_at DESC
    `;

    // 整理成每個物品對應的投票者列表
    const itemVoters = {};
    for (const item of items) {
      itemVoters[item.name] = {
        vote_count: item.vote_count,
        voters: votes
          .filter((v) => v.item_name === item.name)
          .map((v) => v.voter_name),
      };
    }

    return NextResponse.json({
      success: true,
      items: itemVoters,
      ranking: items,
      votes,
    }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("查詢失敗:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
