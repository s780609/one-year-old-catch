"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const API = "/api/test-neondb";

// ====== 常用 PostgreSQL 資料型別 ======
const PG_TYPES = [
  "SERIAL",
  "INTEGER",
  "BIGINT",
  "TEXT",
  "VARCHAR(255)",
  "BOOLEAN",
  "TIMESTAMP",
  "DATE",
  "NUMERIC",
  "REAL",
  "JSONB",
  "UUID",
];

export default function TestNeonDBPage() {
  // ---- 狀態 ----
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [tab, setTab] = useState("data"); // "data" | "create-table"

  // 建立表單
  const [newTableName, setNewTableName] = useState("");
  const [newColumns, setNewColumns] = useState([
    { name: "id", type: "SERIAL", primaryKey: true, nullable: false, defaultValue: "" },
  ]);

  // 新增/編輯資料
  const [insertValues, setInsertValues] = useState({});
  const [editingRow, setEditingRow] = useState(null);
  const [editValues, setEditValues] = useState({});

  // ---- 訊息 ----
  const showMsg = (text, isError = false) => {
    setMessage({ text, isError });
    setTimeout(() => setMessage(null), 4000);
  };

  // ---- 載入所有表 ----
  const fetchTables = useCallback(async () => {
    try {
      const res = await fetch(`${API}?action=tables`);
      const data = await res.json();
      if (data.success) setTables(data.data);
    } catch (err) {
      showMsg(err.message, true);
    }
  }, []);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  // ---- 選擇表 → 載入欄位 + 資料 ----
  const selectTable = useCallback(async (tableName) => {
    if (!tableName) {
      setSelectedTable("");
      setColumns([]);
      setRows([]);
      return;
    }

    setSelectedTable(tableName);
    setLoading(true);
    setEditingRow(null);

    try {
      const [colRes, dataRes] = await Promise.all([
        fetch(`${API}?action=columns&table=${tableName}`),
        fetch(`${API}?action=data&table=${tableName}`),
      ]);
      const colData = await colRes.json();
      const rowData = await dataRes.json();

      if (colData.success) {
        setColumns(colData.data);
        // 初始化新增表單
        const init = {};
        colData.data.forEach((c) => {
          if (!isAutoColumn(c)) init[c.column_name] = "";
        });
        setInsertValues(init);
      }
      if (rowData.success) setRows(rowData.data);
    } catch (err) {
      showMsg(err.message, true);
    } finally {
      setLoading(false);
    }
  }, []);

  // ---- 判斷自動欄位 (SERIAL / 有 DEFAULT) ----
  function isAutoColumn(col) {
    return (
      col.column_default?.startsWith("nextval") ||
      col.data_type === "serial" ||
      col.data_type === "bigserial"
    );
  }

  // ---- 取得主鍵欄位名 ----
  function getIdColumn() {
    // 優先找 serial/nextval，否則用第一個欄位
    const serial = columns.find((c) => c.column_default?.startsWith("nextval"));
    return serial?.column_name || columns[0]?.column_name || "id";
  }

  // ============ CREATE TABLE ============
  const handleCreateTable = async (e) => {
    e.preventDefault();
    if (!newTableName.trim() || newColumns.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_table",
          tableName: newTableName.trim(),
          columns: newColumns.map((c) => ({
            name: c.name.trim(),
            type: c.type,
            primaryKey: c.primaryKey,
            nullable: c.nullable,
            defaultValue: c.defaultValue || undefined,
          })),
        }),
      });
      const data = await res.json();
      if (data.success) {
        showMsg(`✅ 資料表 "${newTableName}" 建立成功`);
        setNewTableName("");
        setNewColumns([
          { name: "id", type: "SERIAL", primaryKey: true, nullable: false, defaultValue: "" },
        ]);
        await fetchTables();
        setTab("data");
        selectTable(newTableName.trim());
      } else {
        showMsg(data.error, true);
      }
    } catch (err) {
      showMsg(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  // ============ INSERT ============
  const handleInsert = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "insert",
          table: selectedTable,
          values: insertValues,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showMsg("✅ 新增成功");
        const init = {};
        columns.forEach((c) => {
          if (!isAutoColumn(c)) init[c.column_name] = "";
        });
        setInsertValues(init);
        selectTable(selectedTable);
      } else {
        showMsg(data.error, true);
      }
    } catch (err) {
      showMsg(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  // ============ UPDATE ============
  const handleUpdate = async () => {
    const idCol = getIdColumn();
    setLoading(true);
    try {
      const res = await fetch(API, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: selectedTable,
          idColumn: idCol,
          id: editingRow[idCol],
          values: editValues,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showMsg("✅ 更新成功");
        setEditingRow(null);
        selectTable(selectedTable);
      } else {
        showMsg(data.error, true);
      }
    } catch (err) {
      showMsg(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  // ============ DELETE ROW ============
  const handleDeleteRow = async (row) => {
    const idCol = getIdColumn();
    if (!confirm(`確定要刪除 ${idCol}=${row[idCol]} 嗎？`)) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${API}?table=${selectedTable}&idColumn=${idCol}&id=${row[idCol]}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        showMsg("✅ 已刪除");
        selectTable(selectedTable);
      } else {
        showMsg(data.error, true);
      }
    } catch (err) {
      showMsg(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  // ============ DROP TABLE ============
  const handleDropTable = async () => {
    if (!confirm(`⚠️ 確定要刪除整張表「${selectedTable}」嗎？此操作無法復原！`)) return;

    setLoading(true);
    try {
      const res = await fetch(`${API}?table=${selectedTable}&drop=true`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showMsg(`✅ 資料表 "${selectedTable}" 已刪除`);
        setSelectedTable("");
        setColumns([]);
        setRows([]);
        fetchTables();
      } else {
        showMsg(data.error, true);
      }
    } catch (err) {
      showMsg(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  // ============ 重置投票 ============
  const handleResetVotes = async () => {
    if (!confirm("⚠️ 確定要清除所有投票紀錄嗎？\n\n這會：\n1. 刪除 votes 表所有投票紀錄\n2. 將 vote_items 所有 vote_count 歸零\n\n此操作無法復原！")) return;
    if (!confirm("再次確認：真的要清除嗎？")) return;

    setLoading(true);
    try {
      const res = await fetch("/api/vote?reset=all", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showMsg("✅ 已清除所有投票紀錄，票數已歸零");
        if (selectedTable === "votes" || selectedTable === "vote_items") {
          selectTable(selectedTable);
        }
      } else {
        showMsg(data.error, true);
      }
    } catch (err) {
      showMsg(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  // ---- 欄位編輯輔助 ----
  const addColumn = () => {
    setNewColumns([
      ...newColumns,
      { name: "", type: "TEXT", primaryKey: false, nullable: true, defaultValue: "" },
    ]);
  };
  const removeColumn = (i) => setNewColumns(newColumns.filter((_, idx) => idx !== i));
  const updateColumn = (i, field, value) => {
    const updated = [...newColumns];
    updated[i] = { ...updated[i], [field]: value };
    setNewColumns(updated);
  };

  // 開始編輯一筆資料
  const startEdit = (row) => {
    setEditingRow(row);
    const vals = {};
    columns.forEach((c) => {
      if (!isAutoColumn(c)) vals[c.column_name] = row[c.column_name] ?? "";
    });
    setEditValues(vals);
  };

  // ---- 登出 ----
  const router = useRouter();
  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  // ============ RENDER ============
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* 標題 + 登出 */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">🐘 Neon DB 管理面板</h1>
            <p className="text-gray-400 text-sm">
              建立 Table、選擇 Table、執行 CRUD
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white
                       rounded-lg text-sm transition-colors"
          >
            登出
          </button>
        </div>

        {/* 重置投票按鈕 */}
        <div className="mb-4 p-4 bg-red-950/40 border border-red-900/50 rounded-xl flex items-center justify-between">
          <div>
            <h3 className="text-red-400 font-bold text-sm">🗑️ 重置投票</h3>
            <p className="text-red-400/60 text-xs mt-0.5">清除 votes 所有紀錄，vote_items 票數歸零</p>
          </div>
          <button
            onClick={handleResetVotes}
            disabled={loading}
            className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white
                       rounded-lg text-sm font-medium transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            清除所有投票
          </button>
        </div>

        {/* 訊息 */}
        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm text-center ${
              message.isError
                ? "bg-red-900/50 text-red-300 border border-red-700"
                : "bg-green-900/50 text-green-300 border border-green-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Tab 切換 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("data")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "data"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            📋 資料管理
          </button>
          <button
            onClick={() => setTab("create-table")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "create-table"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            ➕ 建立 Table
          </button>
        </div>

        {/* ==================== 建立 Table ==================== */}
        {tab === "create-table" && (
          <form onSubmit={handleCreateTable} className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">建立新的 Table</h2>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">Table 名稱</label>
              <input
                type="text"
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
                placeholder="例如: users, products, orders"
                pattern="^[a-zA-Z_][a-zA-Z0-9_]*$"
                required
                className="w-full sm:w-80 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg
                           focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm text-gray-400 mb-2">欄位定義</label>
              <div className="space-y-2">
                {newColumns.map((col, i) => (
                  <div key={i} className="flex flex-wrap items-center gap-2 bg-gray-800/50 p-3 rounded-lg">
                    <input
                      type="text"
                      value={col.name}
                      onChange={(e) => updateColumn(i, "name", e.target.value)}
                      placeholder="欄位名稱"
                      className="w-36 px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm
                                 focus:outline-none focus:border-blue-500"
                      required
                    />
                    <select
                      value={col.type}
                      onChange={(e) => updateColumn(i, "type", e.target.value)}
                      className="w-36 px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm
                                 focus:outline-none focus:border-blue-500"
                    >
                      {PG_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <label className="flex items-center gap-1 text-xs text-gray-400">
                      <input
                        type="checkbox"
                        checked={col.primaryKey}
                        onChange={(e) => updateColumn(i, "primaryKey", e.target.checked)}
                        className="rounded"
                      />
                      PK
                    </label>
                    <label className="flex items-center gap-1 text-xs text-gray-400">
                      <input
                        type="checkbox"
                        checked={col.nullable}
                        onChange={(e) => updateColumn(i, "nullable", e.target.checked)}
                        className="rounded"
                      />
                      Nullable
                    </label>
                    <input
                      type="text"
                      value={col.defaultValue}
                      onChange={(e) => updateColumn(i, "defaultValue", e.target.value)}
                      placeholder="Default"
                      className="w-28 px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm
                                 focus:outline-none focus:border-blue-500"
                    />
                    {newColumns.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeColumn(i)}
                        className="text-red-400 hover:text-red-300 text-sm px-2"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={addColumn}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
              >
                + 新增欄位
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700
                           rounded-lg text-sm font-medium transition-colors"
              >
                建立 Table
              </button>
            </div>
          </form>
        )}

        {/* ==================== 資料管理 ==================== */}
        {tab === "data" && (
          <>
            {/* 選擇 Table */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <label className="text-sm text-gray-400">選擇 Table:</label>
              <select
                value={selectedTable}
                onChange={(e) => selectTable(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm
                           focus:outline-none focus:border-blue-500 min-w-[200px]"
              >
                <option value="">-- 選擇 --</option>
                {tables.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <button
                onClick={fetchTables}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                title="重整列表"
              >
                🔄
              </button>
              {selectedTable && (
                <button
                  onClick={handleDropTable}
                  className="ml-auto px-3 py-2 bg-red-900/30 text-red-400 hover:bg-red-900/60
                             rounded-lg text-sm transition-colors"
                >
                  🗑️ 刪除此 Table
                </button>
              )}
            </div>

            {selectedTable && columns.length > 0 && (
              <>
                {/* 欄位資訊 */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {columns.map((c) => (
                    <span
                      key={c.column_name}
                      className="text-xs px-2 py-1 bg-gray-800 border border-gray-700 rounded-full text-gray-300"
                    >
                      <span className="font-mono font-medium text-blue-400">{c.column_name}</span>
                      <span className="text-gray-500 ml-1">{c.data_type}</span>
                    </span>
                  ))}
                </div>

                {/* INSERT 表單 */}
                <form onSubmit={handleInsert} className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 mb-3">新增一筆資料</h3>
                  <div className="flex flex-wrap gap-3 items-end">
                    {columns
                      .filter((c) => !isAutoColumn(c))
                      .map((c) => (
                        <div key={c.column_name}>
                          <label className="block text-xs text-gray-500 mb-1">{c.column_name}</label>
                          <input
                            type="text"
                            value={insertValues[c.column_name] || ""}
                            onChange={(e) =>
                              setInsertValues({ ...insertValues, [c.column_name]: e.target.value })
                            }
                            placeholder={c.data_type}
                            className="w-40 px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-sm
                                       focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      ))}
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700
                                 rounded text-sm font-medium transition-colors"
                    >
                      新增
                    </button>
                  </div>
                </form>

                {/* 資料表格 */}
                <div className="overflow-x-auto rounded-xl border border-gray-800">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-900 text-gray-400">
                        {columns.map((c) => (
                          <th key={c.column_name} className="px-4 py-3 text-left font-medium whitespace-nowrap">
                            {c.column_name}
                          </th>
                        ))}
                        <th className="px-4 py-3 text-center font-medium w-32">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.length === 0 ? (
                        <tr>
                          <td colSpan={columns.length + 1} className="text-center py-10 text-gray-500">
                            📭 沒有資料
                          </td>
                        </tr>
                      ) : (
                        rows.map((row, ri) => {
                          const idCol = getIdColumn();
                          const isEditing = editingRow && editingRow[idCol] === row[idCol];

                          return (
                            <tr
                              key={ri}
                              className="border-t border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                            >
                              {columns.map((c) => (
                                <td key={c.column_name} className="px-4 py-2.5 whitespace-nowrap">
                                  {isEditing && !isAutoColumn(c) ? (
                                    <input
                                      type="text"
                                      value={editValues[c.column_name] ?? ""}
                                      onChange={(e) =>
                                        setEditValues({ ...editValues, [c.column_name]: e.target.value })
                                      }
                                      className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm
                                                 focus:outline-none focus:border-blue-500"
                                    />
                                  ) : (
                                    <span className="text-gray-300">
                                      {row[c.column_name] === null ? (
                                        <span className="text-gray-600 italic">NULL</span>
                                      ) : (
                                        String(row[c.column_name])
                                      )}
                                    </span>
                                  )}
                                </td>
                              ))}
                              <td className="px-4 py-2.5 text-center whitespace-nowrap">
                                {isEditing ? (
                                  <div className="flex gap-1 justify-center">
                                    <button
                                      onClick={handleUpdate}
                                      className="px-2 py-1 bg-green-600/20 text-green-400 hover:bg-green-600/40
                                                 rounded text-xs transition-colors"
                                    >
                                      儲存
                                    </button>
                                    <button
                                      onClick={() => setEditingRow(null)}
                                      className="px-2 py-1 bg-gray-600/30 text-gray-400 hover:bg-gray-600/50
                                                 rounded text-xs transition-colors"
                                    >
                                      取消
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex gap-1 justify-center">
                                    <button
                                      onClick={() => startEdit(row)}
                                      className="px-2 py-1 bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/40
                                                 rounded text-xs transition-colors"
                                    >
                                      編輯
                                    </button>
                                    <button
                                      onClick={() => handleDeleteRow(row)}
                                      className="px-2 py-1 bg-red-600/20 text-red-400 hover:bg-red-600/40
                                                 rounded text-xs transition-colors"
                                    >
                                      刪除
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {rows.length > 0 && (
                  <p className="text-center text-gray-500 text-xs mt-3">共 {rows.length} 筆資料</p>
                )}
              </>
            )}

            {selectedTable && columns.length === 0 && !loading && (
              <p className="text-center text-gray-500 py-12">載入中...</p>
            )}

            {!selectedTable && (
              <div className="text-center py-16 text-gray-500">
                <p className="text-4xl mb-3">👆</p>
                <p>請先選擇一張 Table，或建立新的 Table</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
