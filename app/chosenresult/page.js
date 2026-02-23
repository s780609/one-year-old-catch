"use client";

const MEDAL_EMOJI = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];
const BG_COLORS = [
  "from-yellow-400 to-amber-500",
  "from-gray-300 to-gray-400",
  "from-orange-400 to-amber-600",
  "from-pink-200 to-pink-300",
  "from-blue-200 to-blue-300",
];

export default function ChosenResult() {
  const chosenResults = [
    { order: 1, name: "鍵盤" },
    { order: 2, name: "算盤" },
    { order: 3, name: "麥克風" },
    { order: 4, name: "Vtuber" },
    { order: 5, name: "阿公阿嬤的禮物" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="text-5xl mb-4 float-animation">🎉</div>
      <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text
                     bg-gradient-to-r from-pink-500 via-red-400 to-orange-400 mb-2">
        欣予抓周結果
      </h1>
      <p className="text-gray-500 mb-6">寶寶實際選擇的順序</p>

      <div className="w-full max-w-md space-y-3">
        {chosenResults.map((item, index) => (
          <div
            key={item.order}
            className={`bg-gradient-to-r ${BG_COLORS[index]} rounded-2xl p-4 flex items-center gap-4
                        shadow-md card-hover ${index === 0 ? "scale-105 shadow-lg" : ""}`}
          >
            <span className="text-3xl">{MEDAL_EMOJI[index]}</span>
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
  );
}
