"use client";

export function VotingStatusBar({ myName, count, isVoting }) {
  return (
    <div className="sticky top-0 z-40">
      <div
        className="bg-white/85 backdrop-blur-md py-3 px-4"
        style={{ boxShadow: "inset 0 -1px 0 rgb(3 7 18 / 0.06)" }}
      >
        <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-3">
          {/* 左：身份 — 同首頁風格 */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-gray-600 text-sm shrink-0">投票者：</span>
            <span className="font-bold text-teal-500 truncate">{myName}</span>
          </div>

          {/* 右：進度 */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold transition-all
                    ${i <= count
                      ? "bg-gradient-to-r from-pink-500 to-orange-400 text-white"
                      : "bg-neutral-100 text-neutral-400"
                    }`}
                  style={i <= count
                    ? { boxShadow: "0 0 0 1px rgb(3 7 18 / 0.08)" }
                    : { boxShadow: "inset 0 0 0 1px rgb(3 7 18 / 0.05)" }
                  }
                >
                  {i <= count ? "✓" : i}
                </div>
              ))}
            </div>
            <span className="text-xs font-medium text-neutral-500 tabular-nums">{count}/3</span>
          </div>
        </div>
      </div>

      {isVoting && (
        <div
          className="bg-gradient-to-r from-pink-500 to-orange-400 text-white text-center
                     py-1.5 text-xs font-medium flex items-center justify-center gap-2"
        >
          <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          投票送出中…
        </div>
      )}
    </div>
  );
}
