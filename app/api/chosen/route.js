import { NextResponse } from "next/server";
import sql from "@/lib/db";

export const dynamic = "force-dynamic";

const HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
};

// GET: 取得目前寶寶抓周順序
export async function GET() {
  try {
    const rows = await sql`
      SELECT item_order, item_name, chosen_at
      FROM chosen_items
      ORDER BY item_order ASC
    `;
    return NextResponse.json({ success: true, items: rows }, { headers: HEADERS });
  } catch (error) {
    console.error("查詢 chosen_items 失敗:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: 新增或更新一筆抓周紀錄（管理員用，需驗證）
export async function POST(request) {
  try {
    const { item_order, item_name } = await request.json();

    if (!item_order || !item_name?.trim()) {
      return NextResponse.json(
        { success: false, error: "缺少 item_order 或 item_name" },
        { status: 400 }
      );
    }
    if (item_order < 1 || item_order > 5) {
      return NextResponse.json(
        { success: false, error: "item_order 必須在 1~5 之間" },
        { status: 400 }
      );
    }

    // 檢查 item_name 是否已被其他順位使用
    const existing = await sql`
      SELECT item_order FROM chosen_items
      WHERE item_name = ${item_name.trim()} AND item_order != ${item_order}
    `;
    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: `「${item_name.trim()}」已被第 ${existing[0].item_order} 順位使用` },
        { status: 400 }
      );
    }

    // UPSERT：存在就更新，不存在就新增
    await sql`
      INSERT INTO chosen_items (item_order, item_name, chosen_at)
      VALUES (${item_order}, ${item_name.trim()}, NOW())
      ON CONFLICT (item_order)
      DO UPDATE SET item_name = ${item_name.trim()}, chosen_at = NOW()
    `;

    return NextResponse.json({ success: true, message: `第 ${item_order} 順位已更新為「${item_name.trim()}」` });
  } catch (error) {
    console.error("更新 chosen_items 失敗:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: 刪除一筆抓周紀錄（管理員用）
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const order = searchParams.get("order");

    if (order === "all") {
      await sql`DELETE FROM chosen_items`;
      return NextResponse.json({ success: true, message: "已清除所有抓周紀錄" });
    }

    if (!order) {
      return NextResponse.json({ success: false, error: "缺少 order 參數" }, { status: 400 });
    }

    await sql`DELETE FROM chosen_items WHERE item_order = ${Number(order)}`;
    return NextResponse.json({ success: true, message: `已刪除第 ${order} 順位` });
  } catch (error) {
    console.error("刪除 chosen_items 失敗:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
