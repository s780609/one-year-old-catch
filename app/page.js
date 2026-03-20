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

  // 名字至少兩個字、且不在組字中，才開始 1.2 秒倒數顯示確認
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

  // 投票邏輯
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

      {/* 已投過票覆蓋層 */}
      {showAlreadyVoted && (
        <AlreadyVotedOverlay
          myName={myName}
          votedItems={votedItems}
          isResetting={isResetting}
          onRevote={handleRevote}
        />
      )}

      {/* 倒數計時覆蓋層 */}
      {showCountdown && <CountdownOverlay countdownNumber={countdownNumber} />}

      {/* 投票完成橫幅 */}
      {count >= 3 && (
        <div className="sticky top-0 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 text-center shadow-lg">
          <p className="text-lg mb-2">🎉 投票完成！</p>
          <button
            onClick={() => router.push("/result", { scroll: false })}
            className="bg-white text-green-700 font-bold py-2 px-6 rounded-full
                       hover:bg-green-50 transition-all shadow-md"
          >
            去看結果 →
          </button>
        </div>
      )}

      {/* 開場動畫 */}
      {!nameCheck && showIntro && <IntroAnimation fading={introFading} />}

      {/* 選人介面 */}
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

      {/* 投票介面 */}
      {nameCheck && (
        <div className="pb-8">
          <VotingStatusBar myName={myName} count={count} isVoting={isVoting} />

          {/* 檢查投票紀錄中 */}
          {checkingVotes && (
            <div className="flex items-center justify-center py-6 gap-2 text-pink-500">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="font-medium">正在載入你的投票紀錄...</span>
            </div>
          )}

          {/* 投票卡片網格 */}
          <div className="max-w-screen-xl mx-auto px-3 pt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
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
