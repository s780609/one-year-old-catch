"use client";

import { useRouter } from "next/navigation";

export function CountdownOverlay({ countdownNumber }) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center
                    bg-gradient-to-br from-pink-600 via-rose-500 to-orange-500
                    countdown-overlay px-6">
      <div className="text-center w-full max-w-md">
        {countdownNumber > 0 ? (
          <>
            <p className="eyebrow text-white/70 mb-3">即將揭曉…</p>
            <p className="text-white text-lg md:text-xl font-semibold tracking-tight mb-6 text-balance">
              🎉 投票完成！即將揭曉結果
            </p>

            <div key={countdownNumber} className="countdown-number text-white font-bold
                        text-[140px] md:text-[200px] leading-none tracking-tight">
              {countdownNumber}
            </div>

            <div className="mt-6 flex justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300
                    ${i <= 5 - countdownNumber ? "bg-white w-8" : "bg-white/30 w-4"}`}
                />
              ))}
            </div>

            <button
              onClick={() => router.push("/result", { scroll: false })}
              className="mt-8 text-white/70 hover:text-white text-xs font-medium underline
                         underline-offset-4 transition-colors"
            >
              跳過倒數 →
            </button>
          </>
        ) : (
          <div className="countdown-final">
            <div className="text-[80px] md:text-[120px] mb-3">🏆</div>
            <p className="text-white text-2xl md:text-3xl font-bold tracking-tight">
              來看結果！
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
