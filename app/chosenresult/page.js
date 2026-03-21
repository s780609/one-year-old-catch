"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import image001 from "../assets/欣予/欣予001.jpg";

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
// 新增活動時，複製下方範本並填入資料
// ========================
const allEvents = [
  {
    id: 1,
    title: "欣予抓周",
    date: "2024/8/10（六）下午 2:00~5:00",
    birthday: "2023/08/21",
    baby: "欣予",
    photo: image001,
    attendees: ["北投阿公", "北投阿嬤", "五股阿公", "五股阿嬤", "乾阿嬤", "惠瑩姑姑", "大姑婆"],
    theme: {
      gradient: "from-pink-400 to-orange-400",
      badge: "bg-pink-100 text-pink-700",
      activeTab: "from-pink-500 to-orange-400",
      photoBorder: "ring-pink-300",
      voteBadge: "bg-pink-100 text-pink-600",
      voteCard: "bg-pink-50 border-pink-200",
    },
    results: [
      { order: 1, name: "鍵盤" },
      { order: 2, name: "算盤" },
      { order: 3, name: "麥克風" },
      { order: 4, name: "Vtuber（愛醬的紙箱）" },
      { order: 5, name: "阿公阿嬤的禮物" },
    ],
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
];

/* ========== 即時投票結果區塊 ========== */
function LiveVoteResult() {
  const [ranking, setRanking] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [chosenItems, setChosenItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 5000);
    return () => clearInterval(id);
  }, []);

  const fetchData = async () => {
    try {
      const [voteRes, chosenRes] = await Promise.all([
        fetch(`/api?t=${Date.now()}`, { cache: "no-store" }),
        fetch(`/api/chosen?t=${Date.now()}`, { cache: "no-store" }),
      ]);
      const voteData = await voteRes.json();
      const chosenData = await chosenRes.json();

      if (voteData.success) {
        const sorted = Object.entries(voteData.items)
          .map(([name, info]) => ({ name, ...info }))
          .sort((a, b) => b.vote_count - a.vote_count);
        setRanking(sorted);
        setTotalVotes(voteData.votes?.length ?? 0);
      }
      if (chosenData.success) {
        setChosenItems(chosenData.items);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 gap-2 text-pink-500">
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="font-medium">載入中...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      {/* 寶寶即時抓周順序 */}
      {chosenItems.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🍼</span>
            <h3 className="text-lg font-black text-gray-700">秧予抓的順序</h3>
          </div>
          <div className="space-y-3">
            {chosenItems.map((item, index) => (
              <div
                key={item.item_order}
                className={`bg-gradient-to-r ${BG_COLORS[index] || "from-gray-100 to-gray-200"} rounded-2xl p-4 flex items-center gap-4
                            shadow-md card-hover ${index === 0 ? "scale-105 shadow-lg" : ""}`}
              >
                <span className="text-3xl">{MEDAL_EMOJI[index] || `${index + 1}`}</span>
                <div>
                  <p className={`font-black text-xl ${index < 3 ? "text-white" : "text-gray-700"}`}>
                    {item.item_name}
                  </p>
                  <p className={`text-sm ${index < 3 ? "text-white/80" : "text-gray-500"}`}>
                    第 {item.item_order} 順位
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {chosenItems.length === 0 && (
        <div className="text-center py-6 mb-6 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-3xl mb-2">🍼</p>
          <p className="text-gray-400 text-sm">秧予還沒開始抓周</p>
          <p className="text-gray-300 text-xs mt-1">管理員會即時更新結果</p>
        </div>
      )}

      {/* 投票排行榜 */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🗳️</span>
        <h3 className="text-lg font-black text-gray-700">投票排行榜</h3>
        <span className="text-sm text-gray-400 ml-auto">共 {totalVotes} 票</span>
      </div>
      <div className="space-y-3">
        {ranking.map((item, index) => {
          const chosenMatch = chosenItems.find((c) => c.item_name === item.name);
          return (
            <div
              key={item.name}
              className={`rounded-2xl p-4 flex items-center gap-4 shadow-md card-hover
                ${index < 3
                  ? `bg-gradient-to-r ${BG_COLORS[index]} ${index === 0 ? "scale-105 shadow-lg" : ""}`
                  : chosenMatch
                    ? "bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300"
                    : "bg-white border border-gray-100"
                }`}
            >
              <span className="text-3xl min-w-[2.5rem] text-center">
                {MEDAL_EMOJI[index] || `${index + 1}`}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={`font-black text-lg ${index < 3 ? "text-white" : "text-gray-800"}`}>
                    {item.name}
                  </p>
                  {chosenMatch && (
                    <span className={`text-sm font-bold ${index < 3 ? "text-white/90" : "text-amber-600"}`}>
                      🍼 秧予第 {chosenMatch.item_order} 個抓到
                    </span>
                  )}
                </div>
                {item.voters?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.voters.map((voter, vi) => (
                      <span
                        key={`${voter}_${vi}`}
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium
                          ${index < 3 ? "bg-white/30 text-white" : VOTER_COLORS[vi % VOTER_COLORS.length]}`}
                      >
                        {voter}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className={`text-right ${index < 3 ? "text-white" : "text-gray-600"}`}>
                <p className="text-2xl font-black">{item.vote_count}</p>
                <p className={`text-xs ${index < 3 ? "text-white/70" : "text-gray-400"}`}>票</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ========== 過去紀錄區塊（原有內容） ========== */
function PastEventDetail({ event }) {
  const [showVotes, setShowVotes] = useState(false);
  const theme = event.theme;

  const sortedVotes = event.votes
    ? Object.entries(event.votes)
        .map(([name, voters]) => ({ name, voters, count: voters.length }))
        .sort((a, b) => b.count - a.count)
    : [];

  return (
    <>
      <div className="flex flex-col items-center mb-6">
        {event.photo && (
          <div className={`relative mb-4 rounded-full overflow-hidden ring-4 ${theme.photoBorder} shadow-xl`}
               style={{ width: 160, height: 160 }}>
            <Image
              src={event.photo}
              alt={event.baby}
              fill
              className="object-cover"
              sizes="160px"
            />
          </div>
        )}
        <h2 className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${theme.gradient}`}>
          {event.title}
        </h2>
        <p className="text-sm text-gray-400 mt-1">🎂 生日：{event.birthday}</p>
        <p className="text-sm text-gray-400 mt-0.5">📅 活動：{event.date}</p>

        {event.attendees && event.attendees.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 mt-3 max-w-sm">
            <span className="text-xs text-gray-400 w-full text-center mb-1">📍 參加者</span>
            {event.attendees.map((name) => (
              <span key={name} className={`text-xs px-2.5 py-1 rounded-full font-medium ${theme.badge}`}>
                {name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 寶寶實際抓周結果 */}
      <div className="w-full max-w-md mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🍼</span>
          <h3 className="text-lg font-black text-gray-700">寶寶實際抓的順序</h3>
        </div>
        <div className="space-y-3">
          {event.results.map((item, index) => (
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
      </div>

      {/* 投票排行榜 TOP 5 */}
      {sortedVotes.length > 0 && (
        <div className="w-full max-w-md mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🗳️</span>
            <h3 className="text-lg font-black text-gray-700">投票排行榜 TOP 5</h3>
          </div>
          <div className="space-y-3">
            {sortedVotes.slice(0, 5).map((item, index) => {
              const isChosen = event.results.some((r) => r.name === item.name);
              return (
                <div
                  key={item.name}
                  className={`rounded-2xl p-4 flex items-center gap-4 shadow-md card-hover
                    ${isChosen
                      ? "bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300"
                      : "bg-white border border-gray-100"
                    }`}
                >
                  <span className="text-3xl">{MEDAL_EMOJI[index] || `${index + 1}`}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {isChosen && <span className="text-sm">⭐</span>}
                      <p className="font-black text-lg text-gray-800">{item.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{item.count} 票</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 完整投票紀錄展開按鈕 */}
      {event.votes && (
        <>
          <button
            onClick={() => setShowVotes(!showVotes)}
            className="mb-4 px-6 py-2.5 rounded-full text-sm font-bold transition-all
                       bg-white text-gray-600 border border-gray-200 hover:border-pink-300
                       hover:bg-pink-50 shadow-sm flex items-center gap-2"
          >
            <span>{showVotes ? "🔽" : "▶️"}</span>
            {showVotes ? "收起完整投票明細" : "查看完整投票明細"}
          </button>

          {showVotes && (
            <div className="w-full max-w-lg space-y-3 animate-fade-in">
              <p className="text-center text-sm text-gray-400 mb-2">
                共 {sortedVotes.reduce((sum, v) => sum + v.count, 0)} 票
              </p>
              {sortedVotes.map((item) => {
                const isChosen = event.results.some((r) => r.name === item.name);
                return (
                  <div
                    key={item.name}
                    className={`rounded-xl p-3 shadow-sm border transition-all
                      ${isChosen ? `${theme.voteCard}` : "bg-white border-gray-100"}`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        {isChosen && <span className="text-sm">⭐</span>}
                        <span className="font-bold text-gray-800">{item.name}</span>
                      </div>
                      <span className={`text-sm font-bold px-2 py-0.5 rounded-full
                        ${item.count > 0 ? theme.voteBadge : "bg-gray-100 text-gray-400"}`}>
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
  );
}

/* ========== 主頁面 ========== */
export default function ChosenResult() {
  const router = useRouter();
  const [tab, setTab] = useState("live");
  const [selectedEventId, setSelectedEventId] = useState(allEvents[0].id);
  const currentEvent = allEvents.find((e) => e.id === selectedEventId);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      {/* 回排行榜按鈕 */}
      <div className="w-full max-w-lg mb-2 flex justify-start">
        <button
          onClick={() => router.push("/result")}
          aria-label="返回排行榜頁面"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold
                     bg-white text-gray-600 border border-gray-200 shadow-sm
                     hover:border-pink-300 hover:bg-pink-50 transition-all"
        >
          ← 回排行榜
        </button>
      </div>

      <div className="text-5xl mb-4 float-animation">🎉</div>
      <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text
                     bg-gradient-to-r from-pink-500 via-red-400 to-orange-400 mb-2">
        抓周結果
      </h1>
      <p className="text-gray-500 mb-6">寶寶實際選擇的順序</p>

      {/* 頁籤切換：即時投票 / 過去紀錄 */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setTab("live")}
          className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all
            ${tab === "live"
              ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg scale-105"
              : "bg-white text-gray-600 border border-gray-200 hover:border-violet-300 hover:bg-violet-50"
            }`}
        >
          🗳️ 即時投票結果
        </button>
        <button
          onClick={() => setTab("past")}
          className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all
            ${tab === "past"
              ? "bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-lg scale-105"
              : "bg-white text-gray-600 border border-gray-200 hover:border-pink-300 hover:bg-pink-50"
            }`}
        >
          📖 欣予的紀錄
        </button>
      </div>

      {/* 即時投票結果 */}
      {tab === "live" && <LiveVoteResult />}

      {/* 過去紀錄 */}
      {tab === "past" && (
        <>
          {allEvents.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {allEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => setSelectedEventId(event.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all
                    ${selectedEventId === event.id
                      ? `bg-gradient-to-r ${event.theme.activeTab} text-white shadow-lg scale-105`
                      : "bg-white text-gray-600 border border-gray-200 hover:border-pink-300 hover:bg-pink-50"
                    }`}
                >
                  {event.baby}
                </button>
              ))}
            </div>
          )}
          {currentEvent && <PastEventDetail event={currentEvent} />}
        </>
      )}
    </div>
  );
}
