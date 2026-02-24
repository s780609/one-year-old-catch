"use client";

import { useState } from "react";

const MEDAL_EMOJI = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];
const BG_COLORS = [
  "from-yellow-400 to-amber-500",
  "from-gray-300 to-gray-400",
  "from-orange-400 to-amber-600",
  "from-pink-200 to-pink-300",
  "from-blue-200 to-blue-300",
];

const VOTER_COLORS = [
  "bg-pink-100 text-pink-700",
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-purple-100 text-purple-700",
  "bg-orange-100 text-orange-700",
  "bg-teal-100 text-teal-700",
  "bg-rose-100 text-rose-700",
  "bg-indigo-100 text-indigo-700",
  "bg-amber-100 text-amber-700",
  "bg-cyan-100 text-cyan-700",
];

// ========================
// 📦 所有抓周紀錄放這裡
// 最新的放第一筆，舊的往後排
// ========================
const allEvents = [
  {
    id: 1,
    title: "欣予抓周",
    date: "2024-08-21",
    baby: "欣予",
    // 寶寶實際抓的順序
    results: [
      { order: 1, name: "鍵盤" },
      { order: 2, name: "算盤" },
      { order: 3, name: "麥克風" },
      { order: 4, name: "特斯拉" },
      { order: 5, name: "阿公阿嬤的禮物" },
    ],
    // 投票紀錄（每個物品被誰投了）
    votes: {
      急救箱: ["小姑婆", "小姑婆", "大欣欣姑姑"],
      算盤: ["小姑婆", "小姑婆", "小姑婆", "10姑姑", "淑貞舅婆", "乾阿嬤"],
      相機: ["小姑婆", "小姑婆", "小姑婆", "淑貞舅婆"],
      阿公阿嬤的禮物: ["北投阿公", "北投阿公", "北投阿公", "北投阿公", "北投阿公", "小榆姑姑", "彥廷舅舅", "小姑婆", "五股阿嬤", "瑩芳姑姑", "培涓阿北", "北投阿嬤", "乾阿嬤", "欣予媽", "自強阿北"],
      鎚子: ["北投阿嬤", "小姑婆", "姨婆", "瑩芳姑姑", "惠瑩姑姑", "自強阿北"],
      樂器: ["小榆姑姑", "小姑婆", "小姑婆", "培涓阿北"],
      鍵盤: ["淑貞舅婆", "惠瑩姑姑", "姨婆", "欣予媽"],
      飛機: ["小莆叔叔", "五股阿嬤", "惠瑩姑姑"],
      書: ["姨婆"],
      麥克風: ["彥廷舅舅", "小姑婆", "10姑姑", "姨婆", "瑩芳姑姑", "北投阿嬤", "姨婆"],
      調色盤: ["小姑婆", "姨婆"],
      廚師帽: [],
      手槍: ["大欣欣姑姑"],
      板手: [],
      博士帽: ["乾阿嬤", "大欣欣姑姑"],
      場記板: ["小莆叔叔", "10姑姑"],
      黑板: [],
      三角尺: [],
      特斯拉: ["許爸好累", "許爸好累", "許爸好累"],
      Vtuber: ["小榆姑姑", "彥廷舅舅", "小莆叔叔", "小姑婆", "五股阿嬤", "欣予媽", "自強阿北"],
    },
  },
  // 未來新增抓周，在上面加一筆即可
];

export default function ChosenResult() {
  const [selectedEventId, setSelectedEventId] = useState(allEvents[0].id);
  const [showVotes, setShowVotes] = useState(false);
  const currentEvent = allEvents.find((e) => e.id === selectedEventId);

  // 將投票資料按票數排序
  const sortedVotes = currentEvent?.votes
    ? Object.entries(currentEvent.votes)
        .map(([name, voters]) => ({ name, voters, count: voters.length }))
        .sort((a, b) => b.count - a.count)
    : [];

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="text-5xl mb-4 float-animation">🎉</div>
      <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text
                     bg-gradient-to-r from-pink-500 via-red-400 to-orange-400 mb-2">
        抓周結果
      </h1>
      <p className="text-gray-500 mb-6">寶寶實際選擇的順序</p>

      {/* 屆次切換（多屆時顯示） */}
      {allEvents.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {allEvents.map((event) => (
            <button
              key={event.id}
              onClick={() => { setSelectedEventId(event.id); setShowVotes(false); }}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all
                ${selectedEventId === event.id
                  ? "bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-md scale-105"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-pink-300 hover:bg-pink-50"
                }`}
            >
              {event.title}
            </button>
          ))}
        </div>
      )}

      {/* 活動資訊 */}
      {currentEvent && (
        <>
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-gray-700">{currentEvent.title}</h2>
            <p className="text-sm text-gray-400">{currentEvent.date}</p>
          </div>

          {/* 🏆 抓周結果 */}
          <div className="w-full max-w-md space-y-3 mb-8">
            {currentEvent.results.map((item, index) => (
              <div
                key={item.order}
                className={`bg-gradient-to-r ${BG_COLORS[index] || "from-gray-100 to-gray-200"} rounded-2xl p-4 flex items-center gap-4
                            shadow-md card-hover ${index === 0 ? "scale-105 shadow-lg" : ""}`}
              >
                <span className="text-3xl">{MEDAL_EMOJI[index] || `${index + 1}`}</span>
                <div>
                  <p className={`font-black text-xl ${index < 3 ? "text-white" : "text-gray-700"}`}>
                    {item.name}
                  </p>
                  <p className={`text-sm ${index < 3 ? "text-white/80" : "text-gray-500"}`}>
                    第 {item.order} 順位
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 🗳️ 投票紀錄展開按鈕 */}
          {currentEvent.votes && (
            <>
              <button
                onClick={() => setShowVotes(!showVotes)}
                className="mb-4 px-6 py-2.5 rounded-full text-sm font-bold transition-all
                           bg-white text-gray-600 border border-gray-200 hover:border-pink-300
                           hover:bg-pink-50 shadow-sm flex items-center gap-2"
              >
                <span>{showVotes ? "🔽" : "▶️"}</span>
                {showVotes ? "收起投票紀錄" : "查看當時投票紀錄"}
              </button>

              {showVotes && (
                <div className="w-full max-w-lg space-y-3 animate-fade-in">
                  <p className="text-center text-sm text-gray-400 mb-2">
                    共 {sortedVotes.reduce((sum, v) => sum + v.count, 0)} 票
                  </p>
                  {sortedVotes.map((item, idx) => {
                    const isChosen = currentEvent.results.some((r) => r.name === item.name);
                    return (
                      <div
                        key={item.name}
                        className={`rounded-xl p-3 shadow-sm border transition-all
                          ${isChosen
                            ? "bg-pink-50 border-pink-200"
                            : "bg-white border-gray-100"
                          }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            {isChosen && <span className="text-sm">⭐</span>}
                            <span className="font-bold text-gray-800">{item.name}</span>
                          </div>
                          <span className={`text-sm font-bold px-2 py-0.5 rounded-full
                            ${item.count > 0 ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-400"}`}>
                            {item.count} 票
                          </span>
                        </div>
                        {item.count > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.voters.map((voter, vi) => (
                              <span
                                key={vi}
                                className={`text-xs px-2 py-0.5 rounded-full font-medium
                                  ${VOTER_COLORS[vi % VOTER_COLORS.length]}`}
                              >
                                {voter}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
