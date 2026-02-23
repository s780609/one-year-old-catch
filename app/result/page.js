"use client";

import ResultBlock from "../components/ResultBlock";
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
import Vtuber from "../assets/Vtuber.jpg";

const imageMap = {
  急救箱: 急救箱,
  算盤: 算盤,
  相機: 相機,
  阿公阿嬤的禮物: 阿公阿嬤的禮物,
  鎚子: 鎚子,
  樂器: 樂器,
  鍵盤: 鍵盤,
  飛機: 飛機,
  書: 書,
  麥克風: 麥克風,
  調色盤: 調色盤,
  廚師帽: 廚師帽,
  手槍: 手槍,
  板手: 板手,
  博士帽: 博士帽,
  場記板: 場記板,
  黑板: 黑板,
  三角尺: 三角尺,
  特斯拉: 特斯拉,
  Vtuber: Vtuber,
};

export default function Result() {
  const router = useRouter();

  const [itemsData, setItemsData] = useState(null);

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api");
      const data = await res.json();

      if (data.success) {
        setItemsData(data.items);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {!itemsData && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4 float-animation">🎂</div>
            <p className="text-gray-500">載入中...</p>
          </div>
        </div>
      )}
      {itemsData && (
        <div className="min-h-screen pb-8">
          {/* 頂部標題 */}
          <div className="bg-white/80 backdrop-blur-md border-b border-pink-100 py-4 px-4 sticky top-0 z-40 shadow-sm">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between">
              <h1 className="text-xl font-black text-transparent bg-clip-text
                             bg-gradient-to-r from-pink-500 to-orange-400">
                📊 投票排行榜
              </h1>
              <button
                onClick={() => router.push("/chosenresult")}
                className="bg-gradient-to-r from-pink-500 to-orange-400 text-white
                           font-bold py-2 px-5 rounded-full text-sm
                           hover:shadow-lg hover:scale-105 transition-all"
              >
                🎯 看抓周結果
              </button>
            </div>
          </div>

          {/* 結果卡片網格 */}
          <div className="max-w-screen-xl mx-auto px-3 pt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {Object.keys(imageMap).map((name) => (
                <ResultBlock
                  key={name}
                  title={name}
                  imageSrc={imageMap[name]}
                  voteCount={itemsData[name]?.vote_count ?? 0}
                  voters={itemsData[name]?.voters ?? []}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
