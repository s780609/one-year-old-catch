"use client";

import { useState, useEffect } from "react";
import { Selector } from "./components/Selector";
import { useRouter } from "next/navigation";
import { ImageLoader } from "./components/ImageLoader";
import toast, { Toaster } from "react-hot-toast";

import image001 from "./assets/001.jpg";
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

  const familyNames = [
    "五股阿公", "五股阿嬤", "北投阿公", "北投阿嬤",
    "乾阿公", "乾阿嬤", "小榆姑姑", "小莆叔叔",
    "彥廷舅舅", "大姑婆", "小姑婆", "姨婆",
    "大叔公", "大金婆", "大欣欣姑姑", "昉昉姑姑",
    "阿暐叔叔", "美麗姑姑", "培涓阿北", "洋溢阿北",
    "惠瑩姑姑", "玉嬋姑姑", "自強阿北", "瑩芳姑姑",
  ];

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

      setTimeout(() => {
        router.push("/result", { scroll: false });
      }, 1.5 * 1000);
    }
  }, [count]);

  useEffect(() => {
    console.log("myName ===> ", myName);
  }, [myName]);

  return (
    <>
      <Toaster position="top-center" />

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
                           bg-gradient-to-r from-pink-500 via-red-400 to-orange-400">
              欣予抓周猜猜看
            </h1>
            <p className="text-gray-600 mt-2 text-base md:text-lg">
              猜猜寶寶會選什麼？每人可以投 <span className="text-pink-500 font-bold">3</span> 票
            </p>
          </div>

          {/* 寶寶照片 */}
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white shadow-xl mb-6">
            <ImageLoader
              src={image001}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              priority={true}
              sizes="224px"
            />
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
          <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-pink-100 py-3 px-4 shadow-sm">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">投票者：</span>
                <span className="font-bold text-pink-500">{myName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
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
                  setCount={setCount}
                  disabled={count >= 3}
                  votedItems={votedItems}
                  setVotedItems={setVotedItems}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
