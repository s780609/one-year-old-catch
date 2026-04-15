"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const API = "/api/test-neondb";

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

const TABS = [
  { key: "data", label: "資料管理", icon: "📋" },
  { key: "chosen", label: "抓周紀錄", icon: "🍼" },
  { key: "create-table", label: "建立 Table", icon: "➕" },
];

const DARK_CARD =
  "0 0 0 1px rgb(255 255 255 / 0.06), 0 1px 2px rgb(0 0 0 / 0.3), 0 8px 24px -8px rgb(0 0 0 / 0.5)";
const DARK_INSET = "inset 0 0 0 1px rgb(255 255 255 / 0.08)";

function Eyebrow({ children, className = "" }) {
  return (
    <p
      className={`font-mono uppercase tracking-[0.18em] text-[11px] text-white/40 ${className}`}
    >
      {children}
    </p>
  );
}

function PillButton({ children, variant = "default", className = "", ...props }) {
  const variants = {
    default:
      "bg-white/5 text-white/80 hover:bg-white/10 hover:text-white",
    primary: "bg-blue-600 text-white hover:bg-blue-500",
    danger: "bg-red-600/80 text-white hover:bg-red-500",
    ghost: "bg-transparent text-white/60 hover:text-white hover:bg-white/5",
  };
  return (
    <button
      className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-tight transition-all
                  disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      style={{ boxShadow: DARK_INSET }}
      {...props}
    >
      {children}
    </button>
  );
}

export default function TestNeonDBPage() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [tab, setTab] = useState("data");

  const [newTableName, setNewTableName] = useState("");
  const [newColumns, setNewColumns] = useState([
    { name: "id", type: "SERIAL", primaryKey: true, nullable: false, defaultValue: "" },
  ]);

  const [insertValues, setInsertValues] = useState({});
  const [editingRow, setEditingRow] = useState(null);
  const [editValues, setEditValues] = useState({});

  const showMsg = (text, isError = false) => {
    setMessage({ text, isError });
    setTimeout(() => setMessage(null), 4000);
  };

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

  function isAutoColumn(col) {
    return (
      col.column_default?.startsWith("nextval") ||
      col.column_default?.startsWith("now()") ||
      col.data_type === "serial" ||
      col.data_type === "bigserial"
    );
  }

  function getIdColumn() {
    const serial = columns.find((c) => c.column_default?.startsWith("nextval"));
    return serial?.column_name || columns[0]?.column_name || "id";
  }

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

  const handleInsert = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "insert", table: selectedTable, values: insertValues }),
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

  const handleDropTable = async () => {
    if (!confirm(`⚠️ 確定要刪除整張表「${selectedTable}」嗎？此操作無法復原！`)) return;

    setLoading(true);
    try {
      const res = await fetch(`${API}?table=${selectedTable}&drop=true`, { method: "DELETE" });
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

  const handleResetVotes = async () => {
    if (
      !confirm(
        "⚠️ 確定要清除所有投票紀錄嗎？\n\n這會：\n1. 刪除 votes 表所有投票紀錄\n2. 將 vote_items 所有 vote_count 歸零\n\n此操作無法復原！"
      )
    )
      return;
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

  const startEdit = (row) => {
    setEditingRow(row);
    const vals = {};
    columns.forEach((c) => {
      if (!isAutoColumn(c)) vals[c.column_name] = row[c.column_name] ?? "";
    });
    setEditValues(vals);
  };

  const router = useRouter();
  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div
      className="min-h-screen text-white antialiased"
      style={{
        background:
          "radial-gradient(ellipse at top, rgb(30 41 59), rgb(3 7 18) 60%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10">
        {/* Hero: split headline + logout */}
        <div className="flex items-start justify-between gap-4 flex-wrap mb-10">
          <div>
            <Eyebrow className="mb-2">管理面板 · 資料庫</Eyebrow>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              🐘 Neon DB 管理面板
            </h1>
            <p className="text-white/50 text-sm mt-2 text-pretty max-w-[48ch]">
              建立 Table、執行 CRUD、管理寶寶的即時抓周紀錄。
            </p>
          </div>
          <PillButton onClick={handleLogout} variant="ghost">
            登出 →
          </PillButton>
        </div>

        {/* Danger zone — reset votes */}
        <div
          className="mb-8 rounded-2xl px-5 py-4 flex items-center justify-between gap-4 flex-wrap"
          style={{
            background:
              "linear-gradient(135deg, rgb(127 29 29 / 0.25), rgb(127 29 29 / 0.1))",
            boxShadow: "inset 0 0 0 1px rgb(239 68 68 / 0.2)",
          }}
        >
          <div>
            <Eyebrow className="text-red-300/60 mb-1">危險區</Eyebrow>
            <p className="text-sm font-semibold text-red-200 tracking-tight">🗑️ 重置投票</p>
            <p className="text-red-300/60 text-[11px] mt-0.5">
              清除 votes 所有紀錄，vote_items 票數歸零
            </p>
          </div>
          <PillButton onClick={handleResetVotes} disabled={loading} variant="danger">
            清除所有投票
          </PillButton>
        </div>

        {/* Toast message */}
        {message && (
          <div
            className={`mb-6 rounded-xl px-4 py-3 text-xs text-center
              ${message.isError
                ? "bg-red-500/10 text-red-300"
                : "bg-emerald-500/10 text-emerald-300"}`}
            style={{
              boxShadow: message.isError
                ? "inset 0 0 0 1px rgb(239 68 68 / 0.25)"
                : "inset 0 0 0 1px rgb(16 185 129 / 0.25)",
            }}
          >
            {message.text}
          </div>
        )}

        {/* Segmented tab control */}
        <div className="mb-8">
          <div
            className="inline-flex rounded-full bg-white/5 p-1"
            style={{ boxShadow: DARK_INSET }}
          >
            {TABS.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold tracking-tight transition-all
                    ${active ? "bg-white text-neutral-900" : "text-white/60 hover:text-white"}`}
                >
                  <span className="mr-1.5">{t.icon}</span>
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {tab === "chosen" && <ChosenManager showMsg={showMsg} />}

        {tab === "create-table" && (
          <form
            onSubmit={handleCreateTable}
            className="rounded-3xl bg-white/[0.03] p-6 md:p-8"
            style={{ boxShadow: DARK_CARD }}
          >
            <Eyebrow className="mb-2">建立新表</Eyebrow>
            <h2 className="text-xl font-bold tracking-tight mb-6">建立新的 Table</h2>

            <div className="mb-6">
              <label className="block font-mono uppercase tracking-wider text-[11px] text-white/50 mb-2">
                Table 名稱
              </label>
              <input
                type="text"
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
                placeholder="例如：users, products, orders"
                pattern="^[a-zA-Z_][a-zA-Z0-9_]*$"
                required
                className="w-full sm:w-96 px-3 py-2 rounded-lg bg-white/5 text-white text-sm font-mono
                           outline-none transition-all placeholder:text-white/30
                           focus:bg-white/[0.08] focus:shadow-[inset_0_0_0_1.5px_rgb(59_130_246_/_0.55)]"
                style={{ boxShadow: DARK_INSET }}
              />
            </div>

            <div className="mb-6">
              <label className="block font-mono uppercase tracking-wider text-[11px] text-white/50 mb-3">
                欄位定義
              </label>
              <div className="space-y-2">
                {newColumns.map((col, i) => (
                  <div
                    key={i}
                    className="flex flex-wrap items-center gap-2 rounded-xl bg-white/[0.03] p-3"
                    style={{ boxShadow: DARK_INSET }}
                  >
                    <input
                      type="text"
                      value={col.name}
                      onChange={(e) => updateColumn(i, "name", e.target.value)}
                      placeholder="欄位名稱"
                      className="w-36 px-2 py-1.5 rounded bg-white/5 text-white text-sm font-mono outline-none
                                 placeholder:text-white/30 focus:bg-white/10"
                      style={{ boxShadow: DARK_INSET }}
                      required
                    />
                    <select
                      value={col.type}
                      onChange={(e) => updateColumn(i, "type", e.target.value)}
                      className="w-36 px-2 py-1.5 rounded bg-white/5 text-white text-sm font-mono outline-none"
                      style={{ boxShadow: DARK_INSET }}
                    >
                      {PG_TYPES.map((t) => (
                        <option key={t} value={t} className="bg-neutral-900">
                          {t}
                        </option>
                      ))}
                    </select>
                    <label className="flex items-center gap-1.5 text-[11px] text-white/60 px-2">
                      <input
                        type="checkbox"
                        checked={col.primaryKey}
                        onChange={(e) => updateColumn(i, "primaryKey", e.target.checked)}
                        className="rounded accent-blue-500"
                      />
                      PK
                    </label>
                    <label className="flex items-center gap-1.5 text-[11px] text-white/60 px-2">
                      <input
                        type="checkbox"
                        checked={col.nullable}
                        onChange={(e) => updateColumn(i, "nullable", e.target.checked)}
                        className="rounded accent-blue-500"
                      />
                      Nullable
                    </label>
                    <input
                      type="text"
                      value={col.defaultValue}
                      onChange={(e) => updateColumn(i, "defaultValue", e.target.value)}
                      placeholder="Default"
                      className="w-28 px-2 py-1.5 rounded bg-white/5 text-white text-sm font-mono outline-none
                                 placeholder:text-white/30"
                      style={{ boxShadow: DARK_INSET }}
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
              <PillButton type="button" onClick={addColumn}>
                + 新增欄位
              </PillButton>
              <PillButton type="submit" disabled={loading} variant="primary">
                建立 Table
              </PillButton>
            </div>
          </form>
        )}

        {tab === "data" && (
          <>
            {/* Table selector toolbar */}
            <div
              className="rounded-2xl bg-white/[0.03] p-4 mb-6 flex flex-wrap items-center gap-3"
              style={{ boxShadow: DARK_CARD }}
            >
              <label className="text-[11px] font-mono uppercase tracking-wider text-white/50">
                資料表
              </label>
              <select
                value={selectedTable}
                onChange={(e) => selectTable(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white/5 text-white text-sm font-mono outline-none min-w-[200px]
                           focus:bg-white/10"
                style={{ boxShadow: DARK_INSET }}
              >
                <option value="" className="bg-neutral-900">
                  -- 選擇 --
                </option>
                {tables.map((t) => (
                  <option key={t} value={t} className="bg-neutral-900">
                    {t}
                  </option>
                ))}
              </select>
              <PillButton onClick={fetchTables} title="重整列表">
                🔄
              </PillButton>
              {selectedTable && (
                <PillButton onClick={handleDropTable} variant="danger" className="ml-auto">
                  🗑️ 刪除此 Table
                </PillButton>
              )}
            </div>

            {selectedTable && columns.length > 0 && (
              <>
                {/* Column chips */}
                <div className="mb-5">
                  <Eyebrow className="mb-3">欄位</Eyebrow>
                  <div className="flex flex-wrap gap-1.5">
                    {columns.map((c) => (
                      <span
                        key={c.column_name}
                        className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full
                                   bg-white/[0.04] text-white/80"
                        style={{ boxShadow: DARK_INSET }}
                      >
                        <span className="font-mono font-semibold text-blue-300">
                          {c.column_name}
                        </span>
                        <span className="text-white/40 font-mono">{c.data_type}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Insert form */}
                <form
                  onSubmit={handleInsert}
                  className="rounded-2xl bg-white/[0.03] p-5 mb-6"
                  style={{ boxShadow: DARK_CARD }}
                >
                  <Eyebrow className="mb-4">新增一筆資料</Eyebrow>
                  <div className="flex flex-wrap gap-3 items-end">
                    {columns
                      .filter((c) => !isAutoColumn(c))
                      .map((c) => (
                        <div key={c.column_name}>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1">
                            {c.column_name}
                          </label>
                          <input
                            type="text"
                            value={insertValues[c.column_name] || ""}
                            onChange={(e) =>
                              setInsertValues({
                                ...insertValues,
                                [c.column_name]: e.target.value,
                              })
                            }
                            placeholder={c.data_type}
                            className="w-40 px-2 py-1.5 rounded bg-white/5 text-white text-sm font-mono outline-none
                                       placeholder:text-white/30 focus:bg-white/10"
                            style={{ boxShadow: DARK_INSET }}
                          />
                        </div>
                      ))}
                    <PillButton type="submit" disabled={loading} variant="primary">
                      新增
                    </PillButton>
                  </div>
                </form>

                {/* Data table */}
                <div
                  className="overflow-x-auto rounded-2xl bg-white/[0.02]"
                  style={{ boxShadow: DARK_CARD }}
                >
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left">
                        {columns.map((c) => (
                          <th
                            key={c.column_name}
                            className="px-4 py-3 font-mono uppercase tracking-wider text-[10px] text-white/45 whitespace-nowrap"
                          >
                            {c.column_name}
                          </th>
                        ))}
                        <th className="px-4 py-3 text-center font-mono uppercase tracking-wider text-[10px] text-white/45 w-32">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.length === 0 ? (
                        <tr>
                          <td
                            colSpan={columns.length + 1}
                            className="text-center py-12 text-white/30 text-sm"
                          >
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
                              className="hover:bg-white/[0.03] transition-colors"
                              style={{ borderTop: "1px solid rgb(255 255 255 / 0.05)" }}
                            >
                              {columns.map((c) => (
                                <td
                                  key={c.column_name}
                                  className="px-4 py-2.5 whitespace-nowrap"
                                >
                                  {isEditing && !isAutoColumn(c) ? (
                                    <input
                                      type="text"
                                      value={editValues[c.column_name] ?? ""}
                                      onChange={(e) =>
                                        setEditValues({
                                          ...editValues,
                                          [c.column_name]: e.target.value,
                                        })
                                      }
                                      className="w-full px-2 py-1 rounded bg-white/10 text-white text-sm font-mono outline-none
                                                 focus:bg-white/15"
                                      style={{ boxShadow: DARK_INSET }}
                                    />
                                  ) : (
                                    <span className="text-white/85 font-mono text-[13px] tabular-nums">
                                      {row[c.column_name] === null ? (
                                        <span className="text-white/30 italic">NULL</span>
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
                                      className="rounded-full px-3 py-1 bg-emerald-500/20 text-emerald-300
                                                 hover:bg-emerald-500/30 text-[11px] font-semibold transition-colors"
                                    >
                                      儲存
                                    </button>
                                    <button
                                      onClick={() => setEditingRow(null)}
                                      className="rounded-full px-3 py-1 bg-white/5 text-white/60
                                                 hover:bg-white/10 hover:text-white text-[11px] font-semibold transition-colors"
                                    >
                                      取消
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex gap-1 justify-center">
                                    <button
                                      onClick={() => startEdit(row)}
                                      className="rounded-full px-3 py-1 bg-amber-500/20 text-amber-300
                                                 hover:bg-amber-500/30 text-[11px] font-semibold transition-colors"
                                    >
                                      編輯
                                    </button>
                                    <button
                                      onClick={() => handleDeleteRow(row)}
                                      className="rounded-full px-3 py-1 bg-red-500/20 text-red-300
                                                 hover:bg-red-500/30 text-[11px] font-semibold transition-colors"
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
                  <p className="text-center text-white/35 text-[11px] font-mono tabular-nums mt-3">
                    共 {rows.length} 筆資料
                  </p>
                )}
              </>
            )}

            {selectedTable && columns.length === 0 && !loading && (
              <p className="text-center text-white/40 py-12 text-sm">載入中…</p>
            )}

            {!selectedTable && (
              <div className="text-center py-20 text-white/40">
                <p className="text-4xl mb-3">👆</p>
                <p className="text-sm">請先選擇一張 Table，或建立新的 Table</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ==================== 抓周紀錄管理元件 ==================== */
const VOTE_ITEMS = [
  "手槍", "三角尺", "黑板", "鎚子", "書",
  "鍵盤", "阿公阿嬤的禮物", "麥克風", "算盤", "板手",
  "場記板", "博士帽", "急救箱", "廚師帽", "樂器",
  "飛機", "相機", "調色盤", "特斯拉", "Vtuber",
];

const ORDER_LABELS = ["第 1 個抓", "第 2 個抓", "第 3 個抓", "第 4 個抓", "第 5 個抓"];
const ORDER_EMOJI = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];

function ChosenManager({ showMsg }) {
  const [items, setItems] = useState([null, null, null, null, null]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);

  const fetchChosen = async () => {
    try {
      const res = await fetch("/api/chosen");
      const data = await res.json();
      if (data.success) {
        const arr = [null, null, null, null, null];
        data.items.forEach((r) => {
          arr[r.item_order - 1] = r.item_name;
        });
        setItems(arr);
      }
    } catch (err) {
      showMsg(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChosen();
  }, []);

  const handleSelect = async (order, itemName) => {
    if (!itemName) {
      setSaving(order);
      try {
        const res = await fetch(`/api/chosen?order=${order}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          const updated = [...items];
          updated[order - 1] = null;
          setItems(updated);
          showMsg(`✅ 已清除第 ${order} 順位`);
        } else {
          showMsg(data.error, true);
        }
      } catch (err) {
        showMsg(err.message, true);
      } finally {
        setSaving(null);
      }
      return;
    }

    setSaving(order);
    try {
      const res = await fetch("/api/chosen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_order: order, item_name: itemName }),
      });
      const data = await res.json();
      if (data.success) {
        const updated = [...items];
        updated[order - 1] = itemName;
        setItems(updated);
        showMsg(`✅ ${data.message}`);
      } else {
        showMsg(data.error, true);
      }
    } catch (err) {
      showMsg(err.message, true);
    } finally {
      setSaving(null);
    }
  };

  const handleClearAll = async () => {
    if (!confirm("確定要清除所有抓周紀錄嗎？")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/chosen?order=all", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setItems([null, null, null, null, null]);
        showMsg("✅ 已清除所有抓周紀錄");
      } else {
        showMsg(data.error, true);
      }
    } catch (err) {
      showMsg(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-16 text-white/40 text-sm">載入中…</div>;
  }

  const usedItems = items.filter(Boolean);

  return (
    <div
      className="rounded-3xl bg-white/[0.03] p-6 md:p-8"
      style={{ boxShadow: DARK_CARD }}
    >
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <p className="font-mono uppercase tracking-[0.18em] text-[11px] text-amber-300/70 mb-2">
            即時抓周紀錄
          </p>
          <h2 className="text-xl font-bold tracking-tight">🍼 寶寶即時抓周紀錄</h2>
          <p className="text-white/50 text-sm mt-1">選擇寶寶依序抓取的物品（最多 5 個）</p>
        </div>
        <PillButton onClick={handleClearAll} variant="danger">
          全部清除
        </PillButton>
      </div>

      <div className="space-y-3">
        {ORDER_LABELS.map((label, i) => {
          const order = i + 1;
          const current = items[i];
          const isSaving = saving === order;

          return (
            <div
              key={order}
              className={`flex items-center gap-4 rounded-2xl px-4 py-4 transition-all
                ${current ? "bg-amber-500/10" : "bg-white/[0.02]"}`}
              style={{
                boxShadow: current
                  ? "inset 0 0 0 1px rgb(245 158 11 / 0.3)"
                  : DARK_INSET,
              }}
            >
              <span className="text-3xl w-10 text-center">{ORDER_EMOJI[i]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-mono uppercase tracking-wider text-white/40 mb-1.5">
                  {label}
                </p>
                <select
                  value={current || ""}
                  onChange={(e) => handleSelect(order, e.target.value)}
                  disabled={isSaving}
                  className={`w-full px-3 py-2 rounded-lg text-sm outline-none transition-all
                    ${current
                      ? "bg-amber-500/10 text-amber-200 font-semibold"
                      : "bg-white/5 text-white/80"
                    }
                    ${isSaving ? "opacity-50 cursor-wait" : ""}`}
                  style={{
                    boxShadow: current
                      ? "inset 0 0 0 1px rgb(245 158 11 / 0.35)"
                      : DARK_INSET,
                  }}
                >
                  <option value="" className="bg-neutral-900">-- 尚未選擇 --</option>
                  {VOTE_ITEMS.map((item) => {
                    const usedByOther = usedItems.includes(item) && item !== current;
                    return (
                      <option
                        key={item}
                        value={item}
                        disabled={usedByOther}
                        className="bg-neutral-900"
                      >
                        {item}
                        {usedByOther ? "（已選）" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
              {current && (
                <span className="text-amber-300 font-bold tracking-tight hidden sm:block">
                  {current}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
