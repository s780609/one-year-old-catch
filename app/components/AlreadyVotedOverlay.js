"use client";

import { useRouter } from "next/navigation";

export function AlreadyVotedOverlay({ myName, votedItems, isResetting, onRevote }) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center
                    bg-gradient-to-br from-indigo-700 via-violet-700 to-purple-800
                    countdown-overlay px-6">
      <div className="w-full max-w-md text-center">
        <div className="text-5xl mb-4">🗳️</div>

        <p className="eyebrow text-white/60 mb-2">已投票</p>
        <h2 className="text-white text-2xl md:text-3xl font-bold tracking-tight mb-4 text-balance">
          {myName}，你已經投過囉
        </h2>

        <div className="mb-6">
          <p className="eyebrow text-white/50 mb-2">你投了</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {votedItems.map((item) => (
              <span
                key={item}
                className="bg-white/15 text-white px-3 py-1 rounded-full text-xs font-medium"
                style={{ boxShadow: "inset 0 0 0 1px rgb(255 255 255 / 0.2)" }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={() => router.push("/result", { scroll: false })}
            className="w-full rounded-full px-6 py-3 text-sm font-semibold
                       bg-white text-indigo-700 hover:bg-indigo-50
                       transition-all active:scale-[0.98]"
            style={{ boxShadow: "0 4px 12px rgb(0 0 0 / 0.15), 0 0 0 1px rgb(255 255 255 / 0.2)" }}
          >
            去看結果
          </button>
          <button
            onClick={onRevote}
            disabled={isResetting}
            className="w-full rounded-full px-6 py-3 text-sm font-semibold
                       bg-white/10 text-white
                       hover:bg-white/20 transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2 active:scale-[0.98]"
            style={{ boxShadow: "inset 0 0 0 1px rgb(255 255 255 / 0.3)" }}
          >
            {isResetting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                清除中…
              </>
            ) : (
              "我要重新投票"
            )}
          </button>
        </div>

        <p className="text-white/45 text-xs mt-4 leading-7">
          重新投票會清除你之前的 3 票
        </p>
      </div>
    </div>
  );
}
