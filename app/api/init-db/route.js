import { NextResponse } from "next/server";
import sql from "@/lib/db";

export const dynamic = "force-dynamic";

// GET: 執行建表 + 塞入初始物品資料
export async function GET() {
  try {
    // 建立 vote_items 表
    await sql(`
      CREATE TABLE IF NOT EXISTS vote_items (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        vote_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // 建立 votes 表
    await sql(`
      CREATE TABLE IF NOT EXISTS votes (
        id SERIAL PRIMARY KEY,
        voter_name TEXT NOT NULL,
        item_name TEXT NOT NULL,
        voted_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(voter_name, item_name)
      )
    `);

    // 塞入 20 個抓周物品（已存在就跳過）
    const items = [
      "手槍", "三角尺", "黑板", "鎚子", "書",
      "鍵盤", "阿公阿嬤的禮物", "麥克風", "算盤", "板手",
      "場記板", "博士帽", "急救箱", "廚師帽", "樂器",
      "飛機", "相機", "調色盤", "特斯拉", "Vtuber",
    ];

    for (const name of items) {
      await sql(`INSERT INTO vote_items (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`, [name]);
    }

    // 回傳目前狀態
    const voteItems = await sql(`SELECT * FROM vote_items ORDER BY id`);
    const voteCount = await sql(`SELECT COUNT(*) as count FROM votes`);

    return NextResponse.json({
      success: true,
      message: "資料表建立完成，物品資料已匯入",
      tables: ["vote_items", "votes"],
      items: voteItems,
      totalVotes: voteCount[0].count,
    });
  } catch (error) {
    console.error("初始化失敗:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
