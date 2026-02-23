import { NextResponse } from "next/server";
import sql from "@/lib/db";

// GET: 取得投票排行和所有投票紀錄（給結果頁用）
export async function GET() {
  try {
    // 取得所有物品及其得票數
    const items = await sql`
      SELECT name, vote_count FROM vote_items ORDER BY vote_count DESC, name
    `;

    // 取得所有投票紀錄（誰投了什麼）
    const votes = await sql`
      SELECT voter_name, item_name, voted_at FROM votes ORDER BY voted_at DESC
    `;

    // 整理成每個物品對應的投票者列表（與舊版 Notion 格式相容）
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
    });
  } catch (error) {
    console.error("查詢失敗:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
