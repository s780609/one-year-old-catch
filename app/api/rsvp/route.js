import { NextResponse } from "next/server";
import sql from "@/lib/db";

export const dynamic = "force-dynamic";

// POST: 新增或覆寫 RSVP 紀錄
// body: { name, num_attendees }
export async function POST(request) {
  try {
    const { name, num_attendees } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json({ success: false, error: "name 為必填" }, { status: 400 });
    }

    const attendees = parseInt(num_attendees, 10);
    if (!Number.isInteger(attendees) || attendees < 1) {
      return NextResponse.json(
        { success: false, error: "num_attendees 必須為正整數" },
        { status: 400 }
      );
    }

    const result = await sql(
      `INSERT INTO rsvp (name, num_attendees, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW())
       ON CONFLICT (name) DO UPDATE
         SET num_attendees = EXCLUDED.num_attendees,
             updated_at = NOW()
       RETURNING *`,
      [name.trim(), attendees]
    );

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("RSVP POST 失敗:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET: 查詢所有 RSVP 紀錄
export async function GET() {
  try {
    const rows = await sql(
      `SELECT name, num_attendees, created_at, updated_at FROM rsvp ORDER BY created_at ASC`
    );

    const totalAttendees = rows.reduce((sum, row) => sum + row.num_attendees, 0);

    return NextResponse.json({ success: true, data: rows, totalAttendees });
  } catch (error) {
    console.error("RSVP GET 失敗:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
