"use client";

export function VotingStatusBar({ myName, count, isVoting }) {
  return (
    <div className="sticky top-0 z-40">
      <div className="bg-white/90 backdrop-blur-md border-b border-pink-100 py-3 px-4 shadow-sm">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">投票者：</span>
            <span className="font-bold text-pink-500">{myName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${i <= count
                    ? "bg-gradient-to-r from-pink-500 to-orange-400 text-white"
                    : "bg-gray-200 text-gray-400"
                  }`}
              >
                {i <= count ? "✓" : i}
              </div>
            ))}
            <span className="ml-2 text-sm text-gray-500">{count}/3</span>
          </div>
        </div>
      </div>

      {/* 投票中提示條 */}
      {isVoting && (
        <div className="bg-gradient-to-r from-pink-500 to-orange-400 text-white text-center
                        py-1.5 text-sm font-medium flex items-center justify-center gap-2 shadow-md">
          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          投票送出中，請稍候...
        </div>
      )}
    </div>
  );
}
