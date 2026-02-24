import { NextResponse } from "next/server";
import sql from "@/lib/db";
import { checkOrigin } from "@/lib/checkOrigin";

// POST: 投票
// body: { voterName: "五股阿公", itemName: "手槍" }
export async function POST(request) {
  const originError = checkOrigin(request);
  if (originError) return originError;

  try {
    const { voterName, itemName } = await request.json();

    if (!voterName?.trim() || !itemName?.trim()) {
      return NextResponse.json(
        { success: false, error: "voterName 和 itemName 為必填" },
        { status: 400 }
      );
    }

    // 1. 檢查此人已投幾票
    const countResult = await sql(
      `SELECT COUNT(*) as count FROM votes WHERE voter_name = $1`,
      [voterName]
    );
    const currentCount = parseInt(countResult[0].count);

    if (currentCount >= 3) {
      return NextResponse.json(
        { success: false, error: "你已經投滿 3 票囉！" },
        { status: 400 }
      );
    }

    // 2. 檢查物品是否存在
    const itemExists = await sql(
      `SELECT id FROM vote_items WHERE name = $1`,
      [itemName]
    );
    if (itemExists.length === 0) {
      return NextResponse.json(
        { success: false, error: `找不到物品: ${itemName}` },
        { status: 404 }
      );
    }

    // 3. 新增投票紀錄（UNIQUE 約束防止重複投同一個）
    await sql(
      `INSERT INTO votes (voter_name, item_name) VALUES ($1, $2)`,
      [voterName, itemName]
    );

    // 4. 更新物品的得票數
    await sql(
      `UPDATE vote_items SET vote_count = vote_count + 1 WHERE name = $1`,
      [itemName]
    );

    // 5. 回傳此人目前的投票狀態
    const myVotes = await sql(
      `SELECT item_name FROM votes WHERE voter_name = $1`,
      [voterName]
    );

    return NextResponse.json({
      success: true,
      message: `投票成功！已投 ${myVotes.length}/3 票`,
      votedItems: myVotes.map((v) => v.item_name),
      remainingVotes: 3 - myVotes.length,
    });
  } catch (error) {
    // UNIQUE 違反 → 重複投同一個
    if (error.message?.includes("unique") || error.message?.includes("duplicate")) {
      return NextResponse.json(
        { success: false, error: "你已經投過這個物品了！" },
        { status: 400 }
      );
    }
    console.error("投票失敗:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET: 查詢投票狀態
// ?voter=名稱  → 查某人投了哪些
// 不帶參數     → 查所有物品排行 + 所有投票紀錄
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const voter = searchParams.get("voter");

    if (voter) {
      // 查某人的投票紀錄
      const myVotes = await sql(
        `SELECT item_name, voted_at FROM votes WHERE voter_name = $1 ORDER BY voted_at`,
        [voter]
      );
      return NextResponse.json({
        success: true,
        voter,
        votedItems: myVotes.map((v) => v.item_name),
        votedCount: myVotes.length,
        remainingVotes: 3 - myVotes.length,
      });
    }

    // 查所有排行
    const ranking = await sql(
      `SELECT name, vote_count FROM vote_items ORDER BY vote_count DESC, name`
    );

    // 查所有投票紀錄
    const allVotes = await sql(
      `SELECT voter_name, item_name, voted_at FROM votes ORDER BY voted_at DESC`
    );

    // 統計每人投票數
    const voterStats = await sql(
      `SELECT voter_name, COUNT(*) as count FROM votes GROUP BY voter_name ORDER BY voter_name`
    );

    return NextResponse.json({
      success: true,
      ranking,
      votes: allVotes,
      voterStats,
    });
  } catch (error) {
    console.error("查詢失敗:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: 取消投票（撤回一票）
// body: { voterName: "五股阿公", itemName: "手槍" }
export async function DELETE(request) {
  const originError = checkOrigin(request);
  if (originError) return originError;

  try {
    const { searchParams } = new URL(request.url);
    const voterName = searchParams.get("voter");
    const itemName = searchParams.get("item");

    // ===== 重置全部投票 =====
    if (searchParams.get("reset") === "all") {
      await sql(`DELETE FROM votes`);
      await sql(`UPDATE vote_items SET vote_count = 0`);
      return NextResponse.json({ success: true, message: "已清除所有投票紀錄並重置票數" });
    }

    // ===== 清除某人的全部投票（重新投票用）=====
    if (searchParams.get("reset") === "voter" && voterName) {
      // 先查出此人投了哪些
      const myVotes = await sql(
        `SELECT item_name FROM votes WHERE voter_name = $1`,
        [voterName]
      );
      if (myVotes.length === 0) {
        return NextResponse.json({ success: true, message: "此人沒有投票紀錄" });
      }
      // 刪除投票紀錄
      await sql(`DELETE FROM votes WHERE voter_name = $1`, [voterName]);
      // 更新每個物品的得票數
      for (const v of myVotes) {
        await sql(
          `UPDATE vote_items SET vote_count = vote_count - 1 WHERE name = $1`,
          [v.item_name]
        );
      }
      return NextResponse.json({
        success: true,
        message: `已清除 ${voterName} 的 ${myVotes.length} 筆投票`,
      });
    }

    if (!voterName || !itemName) {
      return NextResponse.json(
        { success: false, error: "voter 和 item 參數為必填" },
        { status: 400 }
      );
    }

    const result = await sql(
      `DELETE FROM votes WHERE voter_name = $1 AND item_name = $2 RETURNING *`,
      [voterName, itemName]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "找不到該投票紀錄" },
        { status: 404 }
      );
    }

    // 更新得票數
    await sql(
      `UPDATE vote_items SET vote_count = vote_count - 1 WHERE name = $1`,
      [itemName]
    );

    return NextResponse.json({ success: true, message: "已取消投票" });
  } catch (error) {
    console.error("取消投票失敗:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
