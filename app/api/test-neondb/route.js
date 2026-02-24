import { NextResponse } from "next/server";
import sql from "@/lib/db";

export const dynamic = "force-dynamic";

// ============ GET ============
// ?action=tables          → 列出所有使用者資料表
// ?action=columns&table=x → 取得某表的欄位
// ?action=data&table=x    → 取得某表的資料
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "tables";
  const table = searchParams.get("table");

  try {
    if (action === "tables") {
      const tables = await sql`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public' ORDER BY table_name
      `;
      return NextResponse.json({ success: true, data: tables.map((t) => t.table_name) });
    }

    if (!table) {
      return NextResponse.json({ success: false, error: "缺少 table 參數" }, { status: 400 });
    }

    // 驗證表名安全性
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table)) {
      return NextResponse.json({ success: false, error: "不合法的表名" }, { status: 400 });
    }

    if (action === "columns") {
      const columns = await sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = ${table}
        ORDER BY ordinal_position
      `;
      return NextResponse.json({ success: true, data: columns });
    }

    if (action === "data") {
      // 表名不能用參數化，直接以字串呼叫 sql()
      const rows = await sql(`SELECT * FROM "${table}" ORDER BY 1 DESC LIMIT 200`);
      return NextResponse.json({ success: true, data: rows });
    }

    return NextResponse.json({ success: false, error: "未知的 action" }, { status: 400 });
  } catch (error) {
    console.error("GET 失敗:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ============ POST ============
// action: "create_table" | "insert"
export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "create_table") {
      const { tableName, columns } = body;

      if (!tableName || !columns?.length) {
        return NextResponse.json(
          { success: false, error: "tableName 和 columns 為必填" },
          { status: 400 }
        );
      }
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
        return NextResponse.json({ success: false, error: "不合法的表名" }, { status: 400 });
      }

      // 構建欄位定義
      const colDefs = columns.map((col) => {
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(col.name)) {
          throw new Error(`不合法的欄位名: ${col.name}`);
        }
        const nullable = col.nullable ? "" : " NOT NULL";
        const defaultVal = col.defaultValue ? ` DEFAULT ${col.defaultValue}` : "";
        const primaryKey = col.primaryKey ? " PRIMARY KEY" : "";
        return `"${col.name}" ${col.type}${primaryKey}${nullable}${defaultVal}`;
      });

      const query = `CREATE TABLE IF NOT EXISTS "${tableName}" (${colDefs.join(", ")})`;
      await sql(query);

      return NextResponse.json({
        success: true,
        message: `資料表 ${tableName} 建立成功`,
      }, { status: 201 });
    }

    if (action === "insert") {
      const { table, values } = body;

      if (!table || !values || Object.keys(values).length === 0) {
        return NextResponse.json(
          { success: false, error: "table 和 values 為必填" },
          { status: 400 }
        );
      }
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table)) {
        return NextResponse.json({ success: false, error: "不合法的表名" }, { status: 400 });
      }

      // 過濾掉空字串的欄位，讓 DB 使用 DEFAULT 值
      const keys = Object.keys(values).filter((k) => values[k] !== "" && values[k] != null);

      if (keys.length === 0) {
        return NextResponse.json(
          { success: false, error: "至少需要填入一個欄位的值" },
          { status: 400 }
        );
      }

      const cols = keys.map((k) => `"${k}"`).join(", ");
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
      const vals = keys.map((k) => values[k]);

      const query = `INSERT INTO "${table}" (${cols}) VALUES (${placeholders}) RETURNING *`;
      const result = await sql(query, vals);

      return NextResponse.json({ success: true, data: result[0] }, { status: 201 });
    }

    return NextResponse.json({ success: false, error: "未知的 action" }, { status: 400 });
  } catch (error) {
    console.error("POST 失敗:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ============ PUT — 更新資料 ============
export async function PUT(request) {
  try {
    const { table, id, idColumn, values } = await request.json();

    if (!table || id == null || !idColumn || !values) {
      return NextResponse.json(
        { success: false, error: "table, idColumn, id 和 values 為必填" },
        { status: 400 }
      );
    }
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table)) {
      return NextResponse.json({ success: false, error: "不合法的表名" }, { status: 400 });
    }

    const keys = Object.keys(values);
    const sets = keys.map((k, i) => `"${k}" = $${i + 1}`).join(", ");
    const vals = [...keys.map((k) => values[k]), id];

    const query = `UPDATE "${table}" SET ${sets} WHERE "${idColumn}" = $${keys.length + 1} RETURNING *`;
    const result = await sql(query, vals);

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "找不到該筆資料" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("PUT 失敗:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ============ DELETE ============
// ?table=x&idColumn=col&id=1  → 刪除一筆
// ?table=x&drop=true          → 刪除整張表
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const table = searchParams.get("table");
    const drop = searchParams.get("drop");
    const id = searchParams.get("id");
    const idColumn = searchParams.get("idColumn");

    if (!table) {
      return NextResponse.json({ success: false, error: "缺少 table 參數" }, { status: 400 });
    }
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table)) {
      return NextResponse.json({ success: false, error: "不合法的表名" }, { status: 400 });
    }

    // 刪除整張表
    if (drop === "true") {
      await sql(`DROP TABLE IF EXISTS "${table}"`);
      return NextResponse.json({ success: true, message: `資料表 ${table} 已刪除` });
    }

    // 刪除單筆資料
    if (!id || !idColumn) {
      return NextResponse.json(
        { success: false, error: "刪除資料需要 idColumn 和 id 參數" },
        { status: 400 }
      );
    }

    const result = await sql(
      `DELETE FROM "${table}" WHERE "${idColumn}" = $1 RETURNING *`,
      [id]
    );

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "找不到該筆資料" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("DELETE 失敗:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
