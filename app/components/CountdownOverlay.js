"use client";

import { useRouter } from "next/navigation";

export function CountdownOverlay({ countdownNumber }) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center
                    bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-700
                    countdown-overlay">
      <div className="text-center">
        {countdownNumber > 0 ? (
          <>
            <p className="text-white/80 text-xl md:text-2xl font-bold mb-4 tracking-wider">
              🎉 投票完成！即將揭曉結果
            </p>
            <div key={countdownNumber} className="countdown-number text-white font-black
                        text-[120px] md:text-[180px] leading-none drop-shadow-2xl">
              {countdownNumber}
            </div>
            <div className="mt-8 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300
                    ${i <= 5 - countdownNumber ? "bg-white scale-125" : "bg-white/30"}`}
                />
              ))}
            </div>
            <button
              onClick={() => router.push("/result", { scroll: false })}
              className="mt-8 text-white/60 hover:text-white text-sm underline
                         underline-offset-4 transition-colors"
            >
              跳過倒數 →
            </button>
          </>
        ) : (
          <div className="countdown-final">
            <div className="text-[80px] md:text-[120px] mb-4">🏆</div>
            <p className="text-white text-3xl md:text-4xl font-black">
              來看結果！
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
