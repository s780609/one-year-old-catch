"use client";

import { useRouter } from "next/navigation";

export function AlreadyVotedOverlay({ myName, votedItems, isResetting, onRevote }) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center
                    bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700
                    countdown-overlay">
      <div className="text-center px-6 max-w-sm">
        <div className="text-6xl mb-4">🗳️</div>
        <h2 className="text-white text-2xl md:text-3xl font-black mb-2">
          {myName}，你已經投過囉！
        </h2>
        <p className="text-white/70 mb-2 text-sm">你投了：</p>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {votedItems.map((item) => (
            <span
              key={item}
              className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push("/result", { scroll: false })}
            className="w-full py-3.5 rounded-xl font-bold text-lg
                       bg-white text-indigo-700 hover:bg-indigo-50
                       shadow-lg transition-all hover:scale-[1.02]"
          >
            🏆 去看結果
          </button>
          <button
            onClick={onRevote}
            disabled={isResetting}
            className="w-full py-3.5 rounded-xl font-bold text-lg
                       bg-white/10 text-white border-2 border-white/30
                       hover:bg-white/20 transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
          >
            {isResetting ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                清除中...
              </>
            ) : (
              "🔄 我要重新投票"
            )}
          </button>
        </div>

        <p className="text-white/40 text-xs mt-4">
          重新投票會清除你之前的 3 票
        </p>
      </div>
    </div>
  );
}
