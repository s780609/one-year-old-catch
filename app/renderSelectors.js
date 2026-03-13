"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Selector } from "./components/Selector";
import { useRouter } from "next/navigation";
import { ImageLoader } from "./components/ImageLoader";
import toast, { Toaster } from "react-hot-toast";

import 秧予1 from "./assets/秧予/秧予_IMG_1937.jpeg";
import 秧予2 from "./assets/秧予/秧予_IMG_1938.jpeg";
import 秧予3 from "./assets/秧予/秧予_IMG_2032.jpeg";
import 秧予4 from "./assets/秧予/秧予_IMG_2033.jpeg";
import 秧予5 from "./assets/秧予/秧予_IMG_2034.jpeg";
import 秧予6 from "./assets/秧予/秧予_IMG_1499.jpeg";
import 秧予7 from "./assets/秧予/秧予_IMG_1928.jpeg";
import 秧予8 from "./assets/秧予/秧予_IMG_1940.jpeg";
import 秧予9 from "./assets/秧予/秧予_IMG_1966.jpeg";
import 秧予10 from "./assets/秧予/秧予_IMG_2047.jpeg";
import 手槍 from "./assets/手槍.jpg";
import 三角尺 from "./assets/三角尺.jpg";
import 黑板 from "./assets/黑板.jpg";
import 鎚子 from "./assets/鎚子.jpg";
import 書 from "./assets/書.jpg";
import 鍵盤 from "./assets/鍵盤.jpg";
import 阿公阿嬤的禮物 from "./assets/阿公阿嬤的禮物.jpg";
import 麥克風 from "./assets/麥克風.jpg";
import 算盤 from "./assets/算盤.jpg";
import 板手 from "./assets/板手.jpg";
import 場記板 from "./assets/場記板.jpg";
import 博士帽 from "./assets/博士帽.jpg";
import 急救箱 from "./assets/急救箱.jpg";
import 廚師帽 from "./assets/廚師帽.jpg";
import 樂器 from "./assets/樂器.jpg";
import 飛機 from "./assets/飛機.jpg";
import 相機 from "./assets/相機.jpg";
import 調色盤 from "./assets/調色盤.jpg";
import 特斯拉 from "./assets/特斯拉.jpg";
import Vtuber from "./assets/Vtuber.jpg";

const imageMap = {
  手槍, 三角尺, 黑板, 鎚子, 書,
  鍵盤, 阿公阿嬤的禮物, 麥克風, 算盤, 板手,
  場記板, 博士帽, 急救箱, 廚師帽, 樂器,
  飛機, 相機, 調色盤, 特斯拉, Vtuber,
};

export default function RenderSelectors({ items }) {
  const router = useRouter();

  const [myName, setMyName] = useState();
  const [count, setCount] = useState(0);
  const [nameCheck, setNameCheck] = useState(false);
  const [votedItems, setVotedItems] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const countRef = useRef(0);

  const babyPhotos = [秧予1, 秧予2, 秧予3, 秧予4, 秧予5, 秧予6, 秧予7, 秧予8, 秧予9, 秧予10];
  const [currentPhoto, setCurrentPhoto] = useState(0);

  // 照片自動輪播
  useEffect(() => {
    if (nameCheck) return;
    const timer = setInterval(() => {
      setCurrentPhoto((prev) => (prev + 1) % babyPhotos.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [nameCheck, babyPhotos.length]);

  const familyNames = [
    "五股阿公", "五股阿嬤", "北投阿公", "北投阿嬤",
    "乾阿公", "乾阿嬤", "小榆姑姑", "小莆叔叔",
    "彥廷舅舅", "大姑婆", "小姑婆", "姨婆",
    "大叔公", "大金婆", "大欣欣姑姑", "昉昉姑姑",
    "阿暐叔叔", "美麗姑姑", "培涓阿北", "洋溢阿北",
    "惠瑩姑姑", "玉嬋姑姑", "自強阿北", "瑩芳姑姑",
  ];

  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(5);
  const [checkingVotes, setCheckingVotes] = useState(false);
  const [showAlreadyVoted, setShowAlreadyVoted] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // 進入投票頁面時，檢查此投票者是否已投過票
  useEffect(() => {
    if (!nameCheck || !myName?.trim()) return;

    const checkPreviousVotes = async () => {
      setCheckingVotes(true);
      try {
        const res = await fetch(
          `/api/vote?voter=${encodeURIComponent(myName)}&t=${Date.now()}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        if (data.success && data.votedCount > 0) {
          if (data.votedCount >= 3) {
            // 已投滿，顯示選擇畫面
            setVotedItems(data.votedItems);
            setShowAlreadyVoted(true);
          } else {
            // 還沒投滿，恢復狀態繼續投
            setCount(data.votedCount);
            countRef.current = data.votedCount;
            setVotedItems(data.votedItems);
            toast(`歡迎回來！你已經投了 ${data.votedCount}/3 票`, {
              icon: "📋",
              style: {
                borderRadius: "12px",
                background: "#3B82F6",
                color: "#fff",
                fontWeight: "bold",
              },
            });
          }
        }
      } catch (error) {
        console.error("檢查投票紀錄失敗:", error);
      } finally {
        setCheckingVotes(false);
      }
    };

    checkPreviousVotes();
  }, [nameCheck, myName]);

  useEffect(() => {
    if (count >= 3) {
      toast("選完囉，來看結果吧 🎉", {
        icon: "🍺",
        style: {
          borderRadius: "12px",
          background: "#4CAF50",
          color: "#fff",
          fontWeight: "bold",
        },
      });

      // 延遲一下再開始倒數
      setTimeout(() => {
        setShowCountdown(true);
      }, 800);
    }
  }, [count]);

  // 倒數計時邏輯
  useEffect(() => {
    if (!showCountdown) return;

    if (countdownNumber <= 0) {
      router.push("/result", { scroll: false });
      return;
    }

    const timer = setTimeout(() => {
      setCountdownNumber((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [showCountdown, countdownNumber]);

  // 同步 countRef
  useEffect(() => {
    countRef.current = count;
  }, [count]);

  // 重新投票（清除此人的全部票）
  const handleRevote = useCallback(async () => {
    setIsResetting(true);
    try {
      const res = await fetch(
        `/api/vote?voter=${encodeURIComponent(myName)}&reset=voter`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        setCount(0);
        countRef.current = 0;
        setVotedItems([]);
        setShowAlreadyVoted(false);
        toast.success("已清除投票，重新開始吧！");
      } else {
        toast.error(data.error || "重置失敗");
      }
    } catch (error) {
      toast.error("重置失敗: " + error.message);
    } finally {
      setIsResetting(false);
    }
  }, [myName]);

  // 投票（帶鎖）
  const handleVote = useCallback(async (itemName) => {
    if (countRef.current >= 3) {
      toast.error("已投滿 3 票");
      return;
    }
    setIsVoting(true);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterName: myName, itemName }),
      });
      const data = await res.json();
      if (data.success) {
        setCount((prev) => prev + 1);
        setVotedItems((prev) => [...prev, itemName]);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("投票失敗: " + error.message);
    } finally {
      setIsVoting(false);
    }
  }, [myName]);

  // 取消投票（帶鎖）
  const handleCancelVote = useCallback(async (itemName) => {
    setIsVoting(true);
    try {
      const res = await fetch(
        `/api/vote?voter=${encodeURIComponent(myName)}&item=${encodeURIComponent(itemName)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        setCount((prev) => prev - 1);
        setVotedItems((prev) => prev.filter((i) => i !== itemName));
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("取消失敗: " + error.message);
    } finally {
      setIsVoting(false);
    }
  }, [myName]);

  return (
    <>
      <Toaster position="top-center" />

      {/* ===== 已投過票選擇畫面 ===== */}
      {showAlreadyVoted && (
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
                onClick={handleRevote}
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
      )}

      {/* ===== 倒數計時全螢幕過場 ===== */}
      {showCountdown && (
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
      )}

      {/* ===== 投票完成橫幅 ===== */}
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

      {/* ===== 選人介面 ===== */}
      {!nameCheck && (
        <div className="flex flex-col items-center min-h-screen px-4 py-6">
          {/* 標題區 */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-3 float-animation">🎂</div>
            <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text
                           bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400">
              秧予抓周猜猜看
            </h1>
            <p className="text-gray-600 mt-2 text-base md:text-lg">
              猜猜寶寶會選什麼？每人可以投 <span className="text-teal-500 font-bold">3</span> 票
            </p>
          </div>

          {/* 寶寶照片輪播 */}
          <div className="relative w-52 h-52 md:w-60 md:h-60 mb-6">
            {babyPhotos.map((photo, i) => (
              <div
                key={i}
                className={`absolute inset-0 rounded-full overflow-hidden border-4 border-white shadow-xl
                  transition-all duration-700 ease-in-out
                  ${i === currentPhoto ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
              >
                <ImageLoader
                  src={photo}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  priority={i === 0}
                  sizes="240px"
                />
              </div>
            ))}
            {/* 照片指示點 */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {babyPhotos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPhoto(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300
                    ${i === currentPhoto ? "bg-teal-500 w-4" : "bg-gray-300 hover:bg-gray-400"}`}
                />
              ))}
            </div>
          </div>

          {/* 選人卡片 */}
          <div className="w-full max-w-lg bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-5 mb-4">
            <h2 className="text-center text-lg font-bold text-gray-700 mb-3">
              👋 先告訴我你是誰
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {familyNames.map((name) => (
                <button
                  key={name}
                  onClick={() => setMyName(name)}
                  className={`py-2 px-1 rounded-xl text-sm font-medium transition-all
                    ${myName === name
                      ? "bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-md scale-105"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-pink-300 hover:bg-pink-50"
                    }`}
                >
                  {name}
                </button>
              ))}
            </div>

            {/* 自行輸入 */}
            <div className="mt-3">
              <input
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                           focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100
                           bg-white text-gray-700 placeholder-gray-400 text-center"
                placeholder="上面沒有你？請在這裡輸入名字"
                value={myName || ""}
                onChange={(e) => setMyName(e.target.value)}
              />
            </div>
          </div>

          {/* 按鈕區 */}
          <div className="flex flex-col items-center gap-3 w-full max-w-sm">
            <button
              onClick={() => {
                if (!myName?.trim()) {
                  toast.error("請先選擇或輸入你的名字");
                  return;
                }
                setNameCheck(true);
              }}
              disabled={!myName?.trim()}
              className={`w-full py-3.5 rounded-xl font-bold text-lg shadow-lg transition-all
                ${myName?.trim()
                  ? "bg-gradient-to-r from-pink-500 to-orange-400 text-white hover:shadow-xl hover:scale-[1.02] pulse-gentle"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              🗳️ 去投票
            </button>
            <button
              onClick={() => router.push("/result", { scroll: false })}
              className="text-gray-500 hover:text-pink-500 transition-colors text-sm underline underline-offset-2"
            >
              我想先偷看結果 👀
            </button>
          </div>
        </div>
      )}

      {/* ===== 投票介面 ===== */}
      {nameCheck && (
        <div className="pb-8">
          {/* 頂部狀態列 */}
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
    </>
  );
}
