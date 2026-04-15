"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

import { Selector } from "./components/Selector";
import { AlreadyVotedOverlay } from "./components/AlreadyVotedOverlay";
import { CountdownOverlay } from "./components/CountdownOverlay";
import { IntroAnimation } from "./components/IntroAnimation";
import { NameSelector } from "./components/NameSelector";
import { VotingStatusBar } from "./components/VotingStatusBar";
import { useVoting } from "./hooks/useVoting";
import { imageMap } from "./data/voteData";

const items = [
  "手槍", "三角尺", "黑板", "鎚子", "書",
  "鍵盤", "阿公阿嬤的禮物", "麥克風", "算盤", "板手",
  "場記板", "博士帽", "急救箱", "廚師帽", "樂器",
  "飛機", "相機", "調色盤", "特斯拉", "Vtuber",
];

export default function Home() {
  const router = useRouter();

  // 身份識別
  const [myName, setMyName] = useState();
  const [nameCheck, setNameCheck] = useState(false);
  const [nameConfirmed, setNameConfirmed] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const nameTimerRef = useRef(null);

  useEffect(() => {
    if (nameTimerRef.current) clearTimeout(nameTimerRef.current);
    if (myName?.trim().length >= 2 && !isComposing) {
      nameTimerRef.current = setTimeout(() => setNameConfirmed(true), 1200);
    } else {
      setNameConfirmed(false);
    }
    return () => { if (nameTimerRef.current) clearTimeout(nameTimerRef.current); };
  }, [myName, isComposing]);

  // 開場動畫
  const [showIntro, setShowIntro] = useState(true);
  const [introFading, setIntroFading] = useState(false);

  useEffect(() => {
    if (nameCheck) { setShowIntro(false); return; }
    const fadeTimer = setTimeout(() => setIntroFading(true), 2500);
    const hideTimer = setTimeout(() => setShowIntro(false), 3500);
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
  }, [nameCheck]);

  const {
    count,
    votedItems,
    isVoting,
    checkingVotes,
    showAlreadyVoted,
    isResetting,
    showCountdown,
    countdownNumber,
    handleVote,
    handleCancelVote,
    handleRevote,
  } = useVoting(myName, nameCheck);

  return (
    <main className="min-h-screen">
      <Toaster position="top-center" />

      {showAlreadyVoted && (
        <AlreadyVotedOverlay
          myName={myName}
          votedItems={votedItems}
          isResetting={isResetting}
          onRevote={handleRevote}
        />
      )}

      {showCountdown && <CountdownOverlay countdownNumber={countdownNumber} />}

      {/* 投票完成橫幅 */}
      {count >= 3 && (
        <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md"
             style={{ boxShadow: "inset 0 -1px 0 rgb(3 7 18 / 0.06), 0 1px 2px rgb(3 7 18 / 0.04)" }}>
          <div className="max-w-screen-xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-2 min-w-0">
              <p className="text-sm font-semibold text-neutral-950 tracking-tight truncate">
                🎉 投票完成
              </p>
              <p className="text-xs text-neutral-500 hidden sm:block truncate">
                已用完 3 票，去看看大家都選了什麼
              </p>
            </div>
            <button
              onClick={() => router.push("/result", { scroll: false })}
              className="shrink-0 rounded-full px-4 py-2 text-xs md:text-sm font-semibold
                         bg-gradient-to-r from-pink-500 to-orange-400 text-white
                         active:scale-95 hover:shadow-md hover:shadow-pink-500/20 transition-all"
              style={{ boxShadow: "0 1px 2px rgb(236 72 153 / 0.25), 0 0 0 1px rgb(3 7 18 / 0.05)" }}
            >
              去看結果 →
            </button>
          </div>
        </div>
      )}

      {!nameCheck && showIntro && <IntroAnimation fading={introFading} />}

      {!nameCheck && !showIntro && (
        <NameSelector
          myName={myName}
          setMyName={setMyName}
          nameConfirmed={nameConfirmed}
          setNameConfirmed={setNameConfirmed}
          onConfirm={() => setNameCheck(true)}
          onComposingChange={setIsComposing}
        />
      )}

      {nameCheck && (
        <div className="pb-10">
          <VotingStatusBar myName={myName} count={count} isVoting={isVoting} />

          {checkingVotes && (
            <div className="flex items-center justify-center py-6 gap-2 text-pink-500">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-sm font-medium">正在載入你的投票紀錄…</span>
            </div>
          )}

          {/* Section heading：同首頁漸層風格 */}
          <div className="max-w-screen-xl mx-auto px-4 pt-6 pb-4 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight">
              <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                挑三樣你覺得秧予會抓的
              </span>
            </h2>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              投滿 <span className="text-teal-500 font-bold">3</span> 張即可送出
            </p>
          </div>

          {/* 投票卡片網格 */}
          <div className="max-w-screen-xl mx-auto px-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
              {items.map((item) => (
                <Selector
                  key={item}
                  myName={myName}
                  src={imageMap[item]}
                  title={item}
                  count={count}
                  disabled={count >= 3 || isVoting || checkingVotes}
                  votedItems={votedItems}
                  onVote={handleVote}
                  onCancel={handleCancelVote}
                  isVoting={isVoting}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
