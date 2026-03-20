"use client";

import ResultBlock from "../components/ResultBlock";
import { ImageLoader } from "../components/ImageLoader";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import 手槍 from "../assets/手槍.jpg";
import 三角尺 from "../assets/三角尺.jpg";
import 黑板 from "../assets/黑板.jpg";
import 鎚子 from "../assets/鎚子.jpg";
import 書 from "../assets/書.jpg";
import 鍵盤 from "../assets/鍵盤.jpg";
import 阿公阿嬤的禮物 from "../assets/阿公阿嬤的禮物.jpg";
import 麥克風 from "../assets/麥克風.jpg";
import 算盤 from "../assets/算盤.jpg";
import 板手 from "../assets/板手.jpg";
import 場記板 from "../assets/場記板.jpg";
import 博士帽 from "../assets/博士帽.jpg";
import 急救箱 from "../assets/急救箱.jpg";
import 廚師帽 from "../assets/廚師帽.jpg";
import 樂器 from "../assets/樂器.jpg";
import 飛機 from "../assets/飛機.jpg";
import 相機 from "../assets/相機.jpg";
import 調色盤 from "../assets/調色盤.jpg";
import 特斯拉 from "../assets/特斯拉.jpg";
const imageMap = {
  急救箱, 算盤, 相機, 阿公阿嬤的禮物, 鎚子,
  樂器, 鍵盤, 飛機, 書, 麥克風,
  調色盤, 廚師帽, 手槍, 板手, 博士帽,
  場記板, 黑板, 三角尺, 特斯拉, Vtuber: "/投票物件/Vtuber.mp4",
};

const MEDAL = ["🥇", "🥈", "🥉"];
const PODIUM_STYLE = [
  "from-yellow-400 to-amber-500 podium-gold",
  "from-gray-300 to-gray-400 podium-silver",
  "from-amber-600 to-orange-700 podium-bronze",
];

export default function Result() {
  const router = useRouter();
  const [itemsData, setItemsData] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api?t=${Date.now()}`, { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setItemsData(data.items);
        const sorted = Object.entries(data.items)
          .map(([name, info]) => ({ name, ...info }))
          .sort((a, b) => b.vote_count - a.vote_count);
        setRanking(sorted);
        setTotalVotes(data.votes?.length ?? 0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const top3 = ranking.slice(0, 3);
  const rest = ranking.slice(3);

  return (
    <div className="result-page-bg">
      {!itemsData && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4 trophy-bounce">🏆</div>
            <p className="text-white/60 text-lg">載入排行榜...</p>
          </div>
        </div>
      )}

      {itemsData && (
        <div className="min-h-screen pb-10">
          {/* 頂部標題列 */}
          <div className="bg-black/30 backdrop-blur-md border-b border-white/10 py-4 px-4 sticky top-0 z-40">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl trophy-bounce">🏆</span>
                <div>
                  <h1 className="text-xl font-black gold-shimmer">
                    投票排行榜
                  </h1>
                  <p className="text-white/50 text-xs">
                    共 {totalVotes} 票 · 每 5 秒自動更新
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push("/")}
                  className="bg-white/10 hover:bg-white/20 text-white
                             font-medium py-2 px-4 rounded-full text-sm
                             backdrop-blur transition-all border border-white/10"
                >
                  🗳️ 回去投票
                </button>
                <button
                  onClick={() => router.push("/chosenresult")}
                  className="bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900
                             font-bold py-2 px-4 rounded-full text-sm
                             hover:shadow-lg hover:shadow-amber-500/30 hover:scale-105 transition-all"
                >
                  🎯 抓周結果
                </button>
              </div>
            </div>
          </div>

          {/* 前三名 Podium */}
          <div className="max-w-screen-md mx-auto px-4 pt-8 pb-6">
            <div className="text-center mb-6 slide-up">
              <h2 className="text-white/90 text-2xl font-black tracking-wide">
                🔥 目前領先
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-5 items-end">
              {top3[1] && (
                <div className="slide-up" style={{ animationDelay: "0.2s" }}>
                  <PodiumCard rank={2} item={top3[1]} imageMap={imageMap} />
                </div>
              )}
              {top3[0] && (
                <div className="slide-up" style={{ animationDelay: "0.1s" }}>
                  <PodiumCard rank={1} item={top3[0]} imageMap={imageMap} />
                </div>
              )}
              {top3[2] && (
                <div className="slide-up" style={{ animationDelay: "0.3s" }}>
                  <PodiumCard rank={3} item={top3[2]} imageMap={imageMap} />
                </div>
              )}
            </div>
          </div>

          {/* 分隔線 */}
          <div className="max-w-screen-xl mx-auto px-6">
            <div className="border-t border-white/10 my-2"></div>
            <p className="text-center text-white/40 text-sm py-3">
              其他候選項目
            </p>
          </div>

          {/* 其餘項目 */}
          <div className="max-w-screen-xl mx-auto px-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {rest.map((item, idx) => (
                <div
                  key={item.name}
                  className="slide-up"
                  style={{ animationDelay: `${0.4 + idx * 0.05}s` }}
                >
                  <ResultBlock
                    title={item.name}
                    imageSrc={imageMap[item.name]}
                    voteCount={item.vote_count}
                    voters={item.voters}
                    rank={idx + 4}
                    darkMode
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PodiumCard({ rank, item, imageMap }) {
  const isFirst = rank === 1;
  const heightClass = isFirst ? "pb-6" : "pb-3";
  const imgSize = isFirst
    ? "w-[80%] max-w-32 aspect-square"
    : "w-[70%] max-w-24 aspect-square";
  const textSize = isFirst ? "text-lg md:text-xl" : "text-sm md:text-base";
  const voteSize = isFirst ? "text-3xl md:text-4xl" : "text-xl md:text-2xl";
  const gradientClass = PODIUM_STYLE[rank - 1];
  const medal = MEDAL[rank - 1];

  return (
    <div className={`flex flex-col items-center ${heightClass}`}>
      <div className={`text-4xl ${isFirst ? "md:text-6xl" : "md:text-4xl"} mb-2 ${isFirst ? "trophy-bounce" : ""}`}>
        {medal}
      </div>

      <div className={`${imgSize} rounded-2xl overflow-hidden bg-white/10 border-2 relative
                       ${rank === 1 ? "border-yellow-400" : rank === 2 ? "border-gray-300" : "border-amber-600"}
                       shadow-lg mb-3 flex items-center justify-center p-1.5`}>
        {imageMap[item.name] && (
          typeof imageMap[item.name] === "string" && imageMap[item.name].endsWith(".mp4") ? (
            <video
              src={imageMap[item.name]}
              muted
              loop
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
          ) : (
            <ImageLoader
              src={imageMap[item.name]}
              alt={item.name}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          )
        )}
      </div>

      <h3 className={`${textSize} font-black text-white text-center mb-1 truncate max-w-full px-1`}>
        {item.name}
      </h3>

      <div className={`${voteSize} font-black gold-shimmer`}>
        {item.vote_count}
      </div>
      <span className="text-white/50 text-xs">票</span>

      {item.voters?.length > 0 && (
        <div className="mt-2 flex flex-wrap justify-center gap-1">
          {item.voters.map((voter, i) => (
            <span
              key={`${voter}_${i}`}
              className={`text-[10px] md:text-xs px-2 py-0.5 rounded-full font-medium
                         bg-gradient-to-r ${gradientClass} text-white/90`}
            >
              {voter}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
