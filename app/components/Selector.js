"use client";

import { ImageLoader } from "./ImageLoader";

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

export function Selector({
  myName,
  src,
  title,
  count,
  disabled,
  votedItems,
  onVote,
  onCancel,
  isVoting,
}) {
  const hasVoted = votedItems.includes(title);
  const isDisabledUnvoted = disabled && !hasVoted;

  return (
    <div
      className={`relative flex flex-col rounded-2xl overflow-hidden
        bg-white shadow-md transition-all duration-200
        ${hasVoted
          ? "ring-2 ring-emerald-400 shadow-emerald-100 shadow-lg"
          : isDisabledUnvoted
            ? "opacity-40 grayscale"
            : "active:scale-[0.98]"
        }`}
    >
      {/* ── 圖片區 ── */}
      <div className="relative aspect-[3/4] overflow-hidden
                      bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
        {typeof src === "string" && src.endsWith(".mp4") ? (
          <video
            src={src}
            muted
            loop
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />
        ) : (
          <ImageLoader
            src={src}
            style={{ objectFit: "contain" }}
            sizes="(max-width: 640px) 48vw, 25vw"
          />
        )}

        {/* 已投票：綠色半透明遮罩 */}
        {hasVoted && (
          <div className="absolute inset-0 bg-emerald-500/15 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center
                            shadow-lg check-animate">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* ── 名稱區 ── */}
      <div className={`px-2 py-2 text-center
        ${hasVoted
          ? "bg-gradient-to-r from-emerald-500 to-teal-500"
          : "bg-white"
        }`}>
        <p className={`font-black text-[14px] leading-snug tracking-wide
          ${hasVoted
            ? "text-white drop-shadow-sm"
            : "bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent"
          }`}>
          {title}
        </p>
      </div>

      {/* ── 操作按鈕 ── */}
      <div className="px-2.5 pb-2.5 bg-white">
        {!hasVoted ? (
          <button
            onClick={() => {
              if (!myName) return;
              onVote(title);
            }}
            disabled={isDisabledUnvoted || isVoting}
            className={`w-full h-10 rounded-xl text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all
              ${isDisabledUnvoted
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-orange-400 text-white active:scale-95 shadow-sm shadow-pink-200"
              }`}
          >
            {isVoting ? <Spinner /> : <><span className="text-base">🗳️</span> 選這個</>}
          </button>
        ) : (
          <button
            onClick={() => onCancel(title)}
            disabled={isVoting}
            className="w-full h-10 rounded-xl text-[13px] font-bold flex items-center justify-center gap-1.5
                       bg-gray-50 text-gray-400 border border-gray-200
                       hover:bg-red-50 hover:text-red-400 hover:border-red-200
                       active:scale-95 transition-all"
          >
            {isVoting ? <Spinner /> : <><span>↩</span> 取消</>}
          </button>
        )}
      </div>
    </div>
  );
}
