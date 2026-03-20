"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { PhotoCarousel } from "./PhotoCarousel";
import { familyNames } from "../data/voteData";

export function NameSelector({ myName, setMyName, nameConfirmed, setNameConfirmed, onConfirm, onComposingChange }) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-6">
      <PhotoCarousel />

      <div className="w-full flex flex-col items-center fade-in-up">
        {/* 標題 */}
        <div className="text-center mb-4">
          <h1 className="text-2xl md:text-3xl font-black">
            <span>🎂 </span>
            <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              秧予抓周猜猜看
            </span>
          </h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            猜猜寶寶會選什麼？每人可以投 <span className="text-teal-500 font-bold">3</span> 票
          </p>
        </div>

        {/* 選人卡片：用 key 讓切換時觸發 fade-in-up 動畫 */}
        <div
          key={nameConfirmed ? "confirmed" : "choosing"}
          className="fade-in-up w-full max-w-lg mb-4"
        >
          {!nameConfirmed ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-5">
              <h2 className="text-center text-xl font-black mb-4">
                <span>👋 </span>
                <span className="bg-gradient-to-r from-rose-500 to-pink-400 bg-clip-text text-transparent">
                  你是秧予的誰？
                </span>
              </h2>
              <div className="grid grid-cols-2 gap-2.5">
                {familyNames.map((name) => (
                  <button
                    key={name}
                    onClick={() => setMyName(name)}
                    className={`py-2 px-2 rounded-2xl text-[17px] font-bold transition-all duration-200
                      ${myName === name
                        ? "bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold shadow-md shadow-pink-200 scale-[1.03]"
                        : "bg-rose-50 text-rose-900 border border-rose-100 shadow-sm active:scale-95"
                      }`}
                  >
                    {name}
                  </button>
                ))}
              </div>

              {/* 自行輸入 */}
              <div className="mt-3">
                <input
                  className="w-full px-4 py-3 rounded-2xl border border-rose-100
                             focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100
                             bg-rose-50 text-rose-900 placeholder-rose-300 text-center text-[15px] font-semibold"
                  placeholder="找不到你的名字？在這裡輸入"
                  value={myName || ""}
                  onCompositionStart={() => onComposingChange(true)}
                  onCompositionEnd={() => onComposingChange(false)}
                  onChange={(e) => { setMyName(e.target.value); setNameConfirmed(false); }}
                />
              </div>

              {/* 選好名字後顯示進度條，key 綁 myName 讓切換名字時重新動畫 */}
              {myName?.trim().length >= 2 && (
                <div className="mt-4">
                  <p className="text-center text-xs text-pink-400 font-medium mb-1.5">
                    確認中，稍等一下…
                  </p>
                  <div className="h-1.5 bg-pink-100 rounded-full overflow-hidden">
                    <div key={myName} className="h-full rounded-full name-confirm-fill
                                                  bg-gradient-to-r from-pink-400 to-orange-400" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-5">
              <div className="text-center">
                <div className="text-4xl mb-3">🤗</div>
                <h2 className="text-xl md:text-2xl font-black text-gray-700">
                  你是秧予的{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">
                    {myName}
                  </span>{" "}
                  嗎？
                </h2>
              </div>
            </div>
          )}
        </div>

        {/* 按鈕區：同樣用 key 讓確認後的按鈕群組也有動畫 */}
        <div
          key={nameConfirmed ? "btn-confirmed" : "btn-choosing"}
          className="fade-in-up flex flex-col items-center gap-3 w-full max-w-sm"
        >
          <button
            onClick={() => {
              if (!myName?.trim()) {
                toast.error("請先選擇或輸入你的名字");
                return;
              }
              if (myName.trim().length < 2) {
                toast.error("名字至少要兩個字喔！");
                return;
              }
              onConfirm();
            }}
            disabled={!myName?.trim()}
            className={`w-full py-3.5 rounded-xl font-bold text-lg shadow-lg transition-all
              ${myName?.trim()
                ? "bg-gradient-to-r from-pink-500 to-orange-400 text-white hover:shadow-xl hover:scale-[1.02] pulse-gentle"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            🗳️ 是，去投票
          </button>
          {nameConfirmed && (
            <button
              onClick={() => { setMyName(""); setNameConfirmed(false); }}
              className="w-full py-2.5 rounded-xl font-bold text-sm
                         bg-white text-gray-500 border border-gray-200
                         hover:bg-red-50 hover:text-red-500 hover:border-red-300
                         transition-all active:scale-95"
            >
              😅 不是，我選錯了！
            </button>
          )}
          <button
            onClick={() => router.push("/result", { scroll: false })}
            className="text-gray-500 hover:text-pink-500 transition-colors text-sm underline underline-offset-2"
          >
            我想先偷看結果 👀
          </button>
        </div>
      </div>
    </div>
  );
}
