"use client";

import { useState } from "react";

const tables = [
  {
    id: "A23",
    name: "主桌",
    size: "large",
    capacity: "8大1BC",
    guests: "自家 + 乾阿嬤乾阿公",
    count: "約 9 人",
    highlight: true,
  },
  {
    id: "A21",
    name: "大長桌",
    size: "large",
    capacity: "8大1BC",
    guests: "大舅公一家 + 阿祖 + 姨嬤",
    count: "約 9 人",
  },
  {
    id: "A22",
    name: "大長桌",
    size: "large",
    capacity: "9大",
    guests: "大姑婆 4 人 + 小姑婆 4 人",
    count: "約 8 人",
  },
  {
    id: "A09",
    size: "small",
    guests: "揚逸阿北一家",
    count: "4 人",
  },
  {
    id: "A08",
    size: "small",
    guests: "小如阿姆一家",
    count: "4 人",
  },
  {
    id: "A07",
    size: "small",
    guests: "北投阿公一家",
    count: "4 人",
  },
  {
    id: "A06",
    size: "small",
    guests: "大叔公 + 高家姐妹",
    count: "4 人",
  },
  {
    id: "A05",
    size: "small",
    guests: "二舅公一家",
    count: "4 人",
  },
  {
    id: "A03",
    size: "small",
    guests: "長綋長亭",
    count: "4 人",
  },
  {
    id: "A25",
    size: "small",
    guests: "小舅公一家",
    count: "4 人",
  },
];

const tableMap = Object.fromEntries(tables.map((t) => [t.id, t]));
const largeTables = tables.filter((t) => t.size === "large");
const smallTables = tables.filter((t) => t.size === "small");

/* ---- Interactive SVG Floor Map ---- */
function FloorMap({ activeId, onSelect }) {
  const isActive = (id) => activeId === id;
  const t = (id) => tableMap[id];

  // Colors
  const smallFill = (id) =>
    isActive(id) ? "#ec4899" : "#fce7f3";
  const smallStroke = (id) =>
    isActive(id) ? "#be185d" : "#f9a8d4";
  const largeFill = (id) =>
    isActive(id)
      ? t(id)?.highlight
        ? "#ec4899"
        : "#f59e0b"
      : t(id)?.highlight
      ? "#fce7f3"
      : "#fef3c7";
  const largeStroke = (id) =>
    isActive(id)
      ? t(id)?.highlight
        ? "#be185d"
        : "#d97706"
      : t(id)?.highlight
      ? "#f9a8d4"
      : "#fcd34d";
  const textColor = (id) => (isActive(id) ? "#ffffff" : "#374151");
  const subTextColor = (id) => (isActive(id) ? "#fce7f3" : "#9ca3af");

  return (
    <svg
      viewBox="0 0 480 720"
      className="w-full h-auto"
      style={{ maxWidth: 480 }}
    >
      {/* Background */}
      <defs>
        <linearGradient id="bg-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff8fb" />
          <stop offset="100%" stopColor="#fef9ef" />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.08" />
        </filter>
        <filter id="shadow-active">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#ec4899" floodOpacity="0.3" />
        </filter>
      </defs>
      <rect width="480" height="720" rx="24" fill="url(#bg-grad)" />

      {/* Wall / room outline */}
      <rect x="20" y="20" width="440" height="680" rx="16" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="6 3" />

      {/* Top Deco area */}
      <rect x="260" y="40" width="180" height="36" rx="8" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" />
      <text x="350" y="63" textAnchor="middle" fontSize="12" fill="#9ca3af" fontFamily="monospace">Deco.</text>

      {/* Entrance label */}
      <text x="240" y="700" textAnchor="middle" fontSize="11" fill="#9ca3af" fontFamily="monospace" letterSpacing="0.1em">ENTRANCE</text>
      <line x1="140" y1="690" x2="340" y2="690" stroke="#d1d5db" strokeWidth="1" strokeDasharray="4 2" />

      {/* ====== SMALL TABLES (left column) ====== */}
      {[
        { id: "A09", y: 100 },
        { id: "A08", y: 190 },
        { id: "A07", y: 280 },
        { id: "A06", y: 370 },
        { id: "A05", y: 460 },
        { id: "A03", y: 550 },
      ].map(({ id, y }) => (
        <g
          key={id}
          onClick={() => onSelect(id)}
          style={{ cursor: "pointer" }}
          className="transition-transform"
        >
          {/* Chairs */}
          <circle cx="58" cy={y + 5} r="6" fill={isActive(id) ? "#fbcfe8" : "#f3f4f6"} stroke={isActive(id) ? "#f9a8d4" : "#d1d5db"} strokeWidth="1" />
          <circle cx="58" cy={y + 65} r="6" fill={isActive(id) ? "#fbcfe8" : "#f3f4f6"} stroke={isActive(id) ? "#f9a8d4" : "#d1d5db"} strokeWidth="1" />
          <circle cx="178" cy={y + 5} r="6" fill={isActive(id) ? "#fbcfe8" : "#f3f4f6"} stroke={isActive(id) ? "#f9a8d4" : "#d1d5db"} strokeWidth="1" />
          <circle cx="178" cy={y + 65} r="6" fill={isActive(id) ? "#fbcfe8" : "#f3f4f6"} stroke={isActive(id) ? "#f9a8d4" : "#d1d5db"} strokeWidth="1" />
          {/* Table */}
          <rect
            x="70" y={y + 10} width="96" height="50" rx="12"
            fill={smallFill(id)} stroke={smallStroke(id)} strokeWidth="2"
            filter={isActive(id) ? "url(#shadow-active)" : "url(#shadow)"}
          />
          <text x="118" y={y + 32} textAnchor="middle" fontSize="13" fontWeight="700" fill={textColor(id)}>
            {id}
          </text>
          <text x="118" y={y + 48} textAnchor="middle" fontSize="9" fill={subTextColor(id)}>
            {t(id)?.guests}
          </text>
        </g>
      ))}

      {/* ====== A25 (small, top right) ====== */}
      <g onClick={() => onSelect("A25")} style={{ cursor: "pointer" }}>
        <circle cx="268" cy={115} r="6" fill={isActive("A25") ? "#fbcfe8" : "#f3f4f6"} stroke={isActive("A25") ? "#f9a8d4" : "#d1d5db"} strokeWidth="1" />
        <circle cx="268" cy={175} r="6" fill={isActive("A25") ? "#fbcfe8" : "#f3f4f6"} stroke={isActive("A25") ? "#f9a8d4" : "#d1d5db"} strokeWidth="1" />
        <circle cx="388" cy={115} r="6" fill={isActive("A25") ? "#fbcfe8" : "#f3f4f6"} stroke={isActive("A25") ? "#f9a8d4" : "#d1d5db"} strokeWidth="1" />
        <circle cx="388" cy={175} r="6" fill={isActive("A25") ? "#fbcfe8" : "#f3f4f6"} stroke={isActive("A25") ? "#f9a8d4" : "#d1d5db"} strokeWidth="1" />
        <rect
          x="280" y={120} width="96" height="50" rx="12"
          fill={smallFill("A25")} stroke={smallStroke("A25")} strokeWidth="2"
          filter={isActive("A25") ? "url(#shadow-active)" : "url(#shadow)"}
        />
        <text x="328" y={142} textAnchor="middle" fontSize="13" fontWeight="700" fill={textColor("A25")}>
          A25
        </text>
        <text x="328" y={158} textAnchor="middle" fontSize="9" fill={subTextColor("A25")}>
          {t("A25")?.guests}
        </text>
      </g>

      {/* ====== LARGE TABLES (right side) ====== */}
      {/* A23 - 主桌 */}
      <g onClick={() => onSelect("A23")} style={{ cursor: "pointer" }}>
        {/* Chairs around large table */}
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={`a23-top-${i}`} cx={250 + i * 36} cy={230} r="7"
            fill={isActive("A23") ? "#fbcfe8" : "#f3f4f6"} stroke={isActive("A23") ? "#f9a8d4" : "#d1d5db"} strokeWidth="1" />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={`a23-bot-${i}`} cx={250 + i * 36} cy={320} r="7"
            fill={isActive("A23") ? "#fbcfe8" : "#f3f4f6"} stroke={isActive("A23") ? "#f9a8d4" : "#d1d5db"} strokeWidth="1" />
        ))}
        <rect
          x="230" y="240" width="200" height="70" rx="16"
          fill={largeFill("A23")} stroke={largeStroke("A23")} strokeWidth="2.5"
          filter={isActive("A23") ? "url(#shadow-active)" : "url(#shadow)"}
        />
        {t("A23")?.highlight && (
          <rect x="290" y="246" width="36" height="14" rx="7" fill={isActive("A23") ? "#ffffff33" : "#ec489933"} />
        )}
        {t("A23")?.highlight && (
          <text x="308" y="256" textAnchor="middle" fontSize="7" fontWeight="600" fill={isActive("A23") ? "#fff" : "#be185d"}>
            主桌
          </text>
        )}
        <text x="330" y={275} textAnchor="middle" fontSize="16" fontWeight="700" fill={textColor("A23")}>
          A23
        </text>
        <text x="330" y={296} textAnchor="middle" fontSize="10" fill={subTextColor("A23")}>
          {t("A23")?.guests}
        </text>
      </g>

      {/* Deco between A23 & A22 */}
      <rect x="260" y="335" width="100" height="24" rx="6" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" />
      <text x="310" y="351" textAnchor="middle" fontSize="10" fill="#9ca3af" fontFamily="monospace">Deco.</text>

      {/* A22 */}
      <g onClick={() => onSelect("A22")} style={{ cursor: "pointer" }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={`a22-top-${i}`} cx={250 + i * 36} cy={375} r="7"
            fill={isActive("A22") ? "#fde68a" : "#f3f4f6"} stroke={isActive("A22") ? "#fbbf24" : "#d1d5db"} strokeWidth="1" />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={`a22-bot-${i}`} cx={250 + i * 36} cy={465} r="7"
            fill={isActive("A22") ? "#fde68a" : "#f3f4f6"} stroke={isActive("A22") ? "#fbbf24" : "#d1d5db"} strokeWidth="1" />
        ))}
        <rect
          x="230" y="385" width="200" height="70" rx="16"
          fill={largeFill("A22")} stroke={largeStroke("A22")} strokeWidth="2.5"
          filter={isActive("A22") ? "url(#shadow-active)" : "url(#shadow)"}
        />
        <text x="330" y={418} textAnchor="middle" fontSize="16" fontWeight="700" fill={textColor("A22")}>
          A22
        </text>
        <text x="330" y={440} textAnchor="middle" fontSize="10" fill={subTextColor("A22")}>
          {t("A22")?.guests}
        </text>
      </g>

      {/* A21 */}
      <g onClick={() => onSelect("A21")} style={{ cursor: "pointer" }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={`a21-top-${i}`} cx={250 + i * 36} cy={510} r="7"
            fill={isActive("A21") ? "#fde68a" : "#f3f4f6"} stroke={isActive("A21") ? "#fbbf24" : "#d1d5db"} strokeWidth="1" />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={`a21-bot-${i}`} cx={250 + i * 36} cy={600} r="7"
            fill={isActive("A21") ? "#fde68a" : "#f3f4f6"} stroke={isActive("A21") ? "#fbbf24" : "#d1d5db"} strokeWidth="1" />
        ))}
        <rect
          x="230" y="520" width="200" height="70" rx="16"
          fill={largeFill("A21")} stroke={largeStroke("A21")} strokeWidth="2.5"
          filter={isActive("A21") ? "url(#shadow-active)" : "url(#shadow)"}
        />
        <text x="330" y={553} textAnchor="middle" fontSize="16" fontWeight="700" fill={textColor("A21")}>
          A21
        </text>
        <text x="330" y={575} textAnchor="middle" fontSize="10" fill={subTextColor("A21")}>
          {t("A21")?.guests}
        </text>
      </g>

      {/* Legend */}
      <g transform="translate(40, 650)">
        <circle cx="0" cy="0" r="5" fill="#fce7f3" stroke="#f9a8d4" strokeWidth="1" />
        <text x="10" y="4" fontSize="9" fill="#6b7280">四人桌</text>
        <rect x="70" y="-7" width="14" height="14" rx="4" fill="#fef3c7" stroke="#fcd34d" strokeWidth="1" />
        <text x="90" y="4" fontSize="9" fill="#6b7280">大桌</text>
        <rect x="140" y="-7" width="14" height="14" rx="4" fill="#fce7f3" stroke="#f9a8d4" strokeWidth="1" />
        <text x="160" y="4" fontSize="9" fill="#6b7280">主桌</text>
        <text x="210" y="4" fontSize="9" fill="#9ca3af">| 點擊桌子查看</text>
      </g>
    </svg>
  );
}

export default function SeatingPage() {
  const [activeTable, setActiveTable] = useState(null);
  const [search, setSearch] = useState("");

  const matchTable = search.trim()
    ? tables.filter(
        (t) =>
          t.guests.includes(search.trim()) ||
          t.id.toLowerCase().includes(search.trim().toLowerCase())
      )
    : null;

  function handleMapSelect(id) {
    setActiveTable((prev) => (prev === id ? null : id));
    setSearch("");
  }

  const cardRing =
    "0 0 0 1px rgb(3 7 18 / 0.06), 0 1px 2px rgb(3 7 18 / 0.04), 0 12px 32px -12px rgb(236 72 153 / 0.14)";
  const insetRing = "inset 0 0 0 1px rgb(3 7 18 / 0.08)";

  const activeInfo = activeTable ? tableMap[activeTable] : null;

  return (
    <main
      className="min-h-screen text-neutral-900"
      style={{
        background:
          "linear-gradient(180deg, #fff8fb 0%, #fff0f6 40%, #fef3c7 100%)",
      }}
    >
      {/* Hero */}
      <section className="relative w-full overflow-hidden">
        <div
          className="relative w-full max-w-[640px] mx-auto pt-16 pb-24 px-5 text-center"
          style={{
            background:
              "linear-gradient(180deg, #fce7f3 0%, #fff0f6 60%, transparent 100%)",
          }}
        >
          <p className="font-mono uppercase tracking-[0.2em] text-[10px] text-pink-700/70 mb-3">
            Yangyu · 2026·04·18 · Seating
          </p>
          <h1
            className="text-[clamp(36px,10vw,56px)] font-bold tracking-tight leading-[1.1] text-neutral-900"
            style={{ fontFamily: "'Noto Serif TC', serif" }}
          >
            周歲宴座位表
          </h1>
          <p className="text-neutral-600 text-sm mt-3 leading-7">
            點擊桌子查看座位安排！
          </p>
        </div>
      </section>

      <div className="max-w-[640px] mx-auto px-4 -mt-12 pb-24 space-y-5 relative z-10">
        {/* 活動資訊 */}
        <section
          className="rounded-3xl bg-white/90 backdrop-blur-sm p-5"
          style={{ boxShadow: cardRing }}
        >
          <div className="flex items-baseline gap-2 mb-4">
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-wider text-amber-800">
              晚上場
            </span>
            <h2 className="text-lg font-bold tracking-tight text-neutral-900">
              周歲宴
            </h2>
          </div>
          <div className="space-y-3">
            <InfoRow icon="📅" label="日期" value="2026 年 4 月 18 日（六）" />
            <InfoRow icon="🕔" label="時間" value="下午 5:00 一樓報到" />
            <InfoRow icon="📍" label="地點" value="新莊宏匯廣場" />
            <InfoRow
              icon="🗝️"
              label="報到"
              value={
                <>
                  在一樓報到，跟櫃台人員說{" "}
                  <strong className="text-pink-700">「周歲宴」</strong> 或{" "}
                  <strong className="text-pink-700 tabular-nums">
                    「1002」
                  </strong>
                </>
              }
            />
            <InfoRow
              icon="🙋"
              label="帶位"
              value="可以跟服務生報桌號，由他們帶入場"
            />
          </div>
        </section>

        {/* 搜尋座位 */}
        <section
          className="rounded-3xl bg-white/90 backdrop-blur-sm p-5"
          style={{ boxShadow: cardRing }}
        >
          <p className="font-mono uppercase tracking-[0.18em] text-[11px] text-pink-700/70 mb-2">
            找座位
          </p>
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            <span className="text-neutral-900">🔍 我坐哪裡？</span>
          </h2>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setActiveTable(null);
            }}
            placeholder="輸入關鍵字，例如：阿公、舅、姑婆…"
            className="w-full px-4 py-3.5 rounded-2xl bg-white text-neutral-900 text-[15px]
                       outline-none transition-all
                       focus:shadow-[inset_0_0_0_1.5px_rgb(236_72_153_/_0.5)]"
            style={{ boxShadow: insetRing }}
          />
          {matchTable && (
            <div className="mt-4 space-y-2">
              {matchTable.length === 0 ? (
                <p className="text-neutral-500 text-sm text-center py-3">
                  找不到符合的桌次，請試試其他關鍵字
                </p>
              ) : (
                matchTable.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveTable(t.id);
                      setSearch("");
                      document.getElementById("floor-map")?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                    className="w-full rounded-2xl bg-pink-50 px-4 py-3 flex items-center gap-3 text-left transition-all active:scale-[0.98]"
                    style={{
                      boxShadow: "inset 0 0 0 1px rgb(236 72 153 / 0.2)",
                    }}
                  >
                    <span className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-amber-400 flex items-center justify-center text-white text-sm font-bold">
                      {t.id}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-semibold text-neutral-800 tracking-tight">
                        {t.guests}
                      </p>
                      <p className="text-xs text-neutral-500">{t.count}</p>
                    </div>
                    <span className="text-xs text-pink-500 font-medium shrink-0">點我定位 →</span>
                  </button>
                ))
              )}
            </div>
          )}
        </section>

        {/* 互動式座位圖 */}
        <section
          id="floor-map"
          className="rounded-3xl bg-white/90 backdrop-blur-sm p-5 scroll-mt-6"
          style={{ boxShadow: cardRing }}
        >
          <div className="mb-4">
            <p className="font-mono uppercase tracking-[0.18em] text-[11px] text-pink-700/70 mb-1">
              場地平面圖
            </p>
            <h2 className="text-2xl font-bold tracking-tight">
              <span className="text-neutral-900">🗺️ 互動座位圖</span>
            </h2>
          </div>

          <FloorMap activeId={activeTable} onSelect={handleMapSelect} />

          {/* Active table info popup */}
          {activeInfo && (
            <div
              className="mt-4 rounded-2xl p-4 flex items-center gap-4 animate-[fadeIn_0.2s_ease-out]"
              style={{
                background: activeInfo.highlight
                  ? "linear-gradient(135deg, #fce7f3, #fdf2f8)"
                  : "linear-gradient(135deg, #fef3c7, #fffbeb)",
                boxShadow: activeInfo.highlight
                  ? "inset 0 0 0 1px rgb(236 72 153 / 0.2), 0 4px 12px -4px rgb(236 72 153 / 0.2)"
                  : "inset 0 0 0 1px rgb(245 158 11 / 0.2), 0 4px 12px -4px rgb(245 158 11 / 0.2)",
              }}
            >
              <div
                className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-white text-base font-bold
                  ${activeInfo.highlight
                    ? "bg-gradient-to-br from-pink-500 to-rose-500"
                    : activeInfo.size === "large"
                    ? "bg-gradient-to-br from-amber-400 to-orange-500"
                    : "bg-gradient-to-br from-pink-400 to-pink-500"
                  }`}
              >
                {activeInfo.id}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-[17px] font-bold tracking-tight text-neutral-900">
                    {activeInfo.guests}
                  </h3>
                  {activeInfo.highlight && (
                    <span className="rounded-full bg-pink-200/60 px-2 py-0.5 text-[10px] font-semibold text-pink-700">
                      主桌
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono tabular-nums text-neutral-500">{activeInfo.id}</span>
                  {activeInfo.capacity && (
                    <span className="text-xs text-neutral-400">· {activeInfo.capacity}</span>
                  )}
                  <span className="text-xs text-pink-600 font-medium">· {activeInfo.count}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveTable(null)}
                className="shrink-0 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors"
                style={{ boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.06)" }}
              >
                ✕
              </button>
            </div>
          )}
        </section>

        {/* 大桌區 */}
        <section>
          <div className="px-1 mb-4">
            <p className="font-mono uppercase tracking-[0.18em] text-[11px] text-pink-700/70 mb-1">
              大長桌區
            </p>
            <h2 className="text-2xl font-bold tracking-tight">
              <span className="text-neutral-900">🎪 大桌 </span>
              <span className="text-neutral-500 text-sm font-medium">
                9 大
              </span>
            </h2>
          </div>
          <div className="space-y-3">
            {largeTables.map((t) => (
              <TableCard
                key={t.id}
                table={t}
                cardRing={cardRing}
                active={activeTable === t.id}
                onSelect={() => handleMapSelect(t.id)}
              />
            ))}
          </div>
        </section>

        {/* 小桌區 */}
        <section>
          <div className="px-1 mb-4 mt-2">
            <p className="font-mono uppercase tracking-[0.18em] text-[11px] text-pink-700/70 mb-1">
              四人桌區
            </p>
            <h2 className="text-2xl font-bold tracking-tight">
              <span className="text-neutral-900">🪑 四人桌 </span>
              <span className="text-neutral-500 text-sm font-medium">
                每桌 4 位
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {smallTables.map((t) => (
              <TableCard
                key={t.id}
                table={t}
                cardRing={cardRing}
                active={activeTable === t.id}
                onSelect={() => handleMapSelect(t.id)}
              />
            ))}
          </div>
        </section>

        {/* 溫馨提醒 */}
        <section
          className="rounded-3xl bg-white/90 backdrop-blur-sm p-5"
          style={{ boxShadow: cardRing }}
        >
          <h2 className="text-lg font-bold tracking-tight text-neutral-900 mb-3">
            💡 溫馨提醒
          </h2>
          <ul className="space-y-2 text-[15px] text-neutral-700 leading-7">
            <li className="flex gap-2">
              <span className="shrink-0">🕔</span>
              <span>下午 5:00 一樓報到，請準時出席</span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0">💳</span>
              <span>小朋友記得帶健保卡</span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0">🅿️</span>
              <span>宏匯廣場有停車場，開車前來也方便</span>
            </li>
          </ul>
        </section>

        {/* 返回邀請函 */}
        <div className="text-center pt-4">
          <a
            href="/invitation"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold
                       text-white bg-gradient-to-r from-pink-500 to-amber-500
                       active:scale-95 transition-all"
            style={{
              boxShadow: "0 8px 20px -6px rgb(236 72 153 / 0.45)",
            }}
          >
            💌 返回邀請函
          </a>
        </div>

        {/* 頁尾 */}
        <div className="pt-6 text-center">
          <p className="font-mono uppercase tracking-[0.18em] text-[11px] text-pink-700/70">
            💗 2026·04·18 敬候光臨
          </p>
          <p className="text-neutral-500 text-xs mt-2">
            期待與您共同慶祝秧予一歲生日
          </p>
        </div>
      </div>
    </main>
  );
}

function TableCard({ table, cardRing, active, onSelect }) {
  const isHighlight = table.highlight;
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-3xl backdrop-blur-sm p-5 transition-all active:scale-[0.98] ${
        active
          ? isHighlight
            ? "bg-pink-100/90 ring-2 ring-pink-400"
            : "bg-amber-50/90 ring-2 ring-amber-400"
          : isHighlight
          ? "bg-pink-50/90"
          : "bg-white/90"
      }`}
      style={{ boxShadow: cardRing }}
    >
      <div className="flex items-center gap-4">
        <div
          className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-white text-base font-bold
            ${
              isHighlight
                ? "bg-gradient-to-br from-pink-500 to-rose-500"
                : table.size === "large"
                ? "bg-gradient-to-br from-amber-400 to-orange-500"
                : "bg-gradient-to-br from-pink-400 to-pink-500"
            }`}
        >
          {table.id}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[17px] font-bold tracking-tight text-neutral-900">
              {table.guests}
            </h3>
            {isHighlight && (
              <span className="rounded-full bg-pink-200/60 px-2 py-0.5 text-[10px] font-semibold text-pink-700">
                主桌
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-mono tabular-nums text-neutral-500">
              {table.id}
            </span>
            {table.capacity && (
              <span className="text-xs text-neutral-400">
                · {table.capacity}
              </span>
            )}
            <span className="text-xs text-pink-600 font-medium">
              · {table.count}
            </span>
          </div>
        </div>
        {active && (
          <span className="shrink-0 text-xs text-pink-500 font-medium">📍</span>
        )}
      </div>
    </button>
  );
}

function InfoRow({ icon, label, value, hint }) {
  return (
    <div
      className="flex items-start gap-3 rounded-2xl bg-neutral-950/[0.02] px-4 py-3"
      style={{ boxShadow: "inset 0 0 0 1px rgb(3 7 18 / 0.05)" }}
    >
      <span className="text-lg shrink-0 leading-7">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-0.5">
          {label}
        </p>
        <div className="text-[15px] text-neutral-800 leading-7">{value}</div>
        {hint && <p className="text-xs text-neutral-400 mt-0.5">（{hint}）</p>}
      </div>
    </div>
  );
}
