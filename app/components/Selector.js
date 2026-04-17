"use client";

import { useState } from "react";
import { ImageLoader } from "./ImageLoader";
import { AiImageModal } from "./AiImageModal";
import { buildPrompt } from "../data/itemPromptMap";
import { aiImageMap } from "../data/voteData";

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
  const [showAiModal, setShowAiModal] = useState(false);
  const hasVoted = votedItems.includes(title);
  const isDisabledUnvoted = disabled && !hasVoted;

  // 外層 rounded-2xl (16px)；padding 8px；內部圖片區 rounded-lg (8px)
  return (
    <div
      className={`relative flex flex-col rounded-2xl overflow-hidden bg-white
                  transition-all duration-200
                  ${isDisabledUnvoted ? "opacity-40 grayscale" : "active:scale-[0.98]"}`}
      style={
        hasVoted
          ? { boxShadow: "0 0 0 1.5px rgb(16 185 129 / 0.55), 0 8px 24px -8px rgb(16 185 129 / 0.25)" }
          : { boxShadow: "0 0 0 1px rgb(3 7 18 / 0.08), 0 1px 2px rgb(3 7 18 / 0.04), 0 6px 18px -6px rgb(3 7 18 / 0.08)" }
      }
    >
      {/* 圖片區：concentric radius（外 16 - padding 0 = 仍 16，但內層只圓上緣） */}
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

        {hasVoted && (
          <div className="absolute inset-0 bg-emerald-500/15 flex items-center justify-center">
            <div className="w-11 h-11 rounded-full bg-emerald-500 flex items-center justify-center check-animate"
                 style={{ boxShadow: "0 0 0 1px rgb(3 7 18 / 0.1), 0 6px 16px rgb(16 185 129 / 0.4)" }}>
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* 名稱區 */}
      <div className={`px-3 py-2 text-center
        ${hasVoted
          ? "bg-gradient-to-r from-emerald-500 to-teal-500"
          : "bg-white"
        }`}>
        <p className={`font-semibold text-sm leading-snug tracking-tight
          ${hasVoted
            ? "text-white"
            : "text-neutral-900"
          }`}>
          {title}
        </p>
      </div>

      {/* 操作按鈕區：concentric radius 內部 rounded-lg (8px) */}
      <div className="px-2 pb-2 bg-white space-y-1.5">
        {!hasVoted ? (
          <button
            onClick={() => {
              if (!myName) return;
              onVote(title);
            }}
            disabled={isDisabledUnvoted || isVoting}
            className={`w-full h-9 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all
              ${isDisabledUnvoted
                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-orange-400 text-white active:scale-95"
              }`}
            style={isDisabledUnvoted
              ? { boxShadow: "inset 0 0 0 1px rgb(3 7 18 / 0.05)" }
              : { boxShadow: "0 1px 2px rgb(236 72 153 / 0.25), 0 0 0 1px rgb(3 7 18 / 0.05)" }
            }
          >
            {isVoting ? <Spinner /> : "選這個"}
          </button>
        ) : (
          <button
            onClick={() => onCancel(title)}
            disabled={isVoting}
            className="w-full h-9 rounded-lg text-xs font-semibold flex items-center justify-center gap-1
                       bg-white text-neutral-500
                       hover:bg-rose-50 hover:text-rose-500
                       active:scale-95 transition-all"
            style={{ boxShadow: "inset 0 0 0 1px rgb(3 7 18 / 0.08)" }}
          >
            {isVoting ? <Spinner /> : "取消"}
          </button>
        )}

        {buildPrompt(title) && (
          <button
            onClick={() => setShowAiModal(true)}
            className="w-full h-8 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1
                       bg-gradient-to-r from-violet-500 to-indigo-500 text-white
                       hover:shadow-md active:scale-95 transition-all"
            style={{ boxShadow: "0 1px 2px rgb(99 102 241 / 0.25), 0 0 0 1px rgb(3 7 18 / 0.05)" }}
          >
            💭 夢想泡泡
          </button>
        )}
      </div>

      {showAiModal && (
        <AiImageModal
          title={title}
          prompt={buildPrompt(title)}
          itemImageSrc={aiImageMap[title] || src}
          onClose={() => setShowAiModal(false)}
        />
      )}
    </div>
  );
}
