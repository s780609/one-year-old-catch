import { ImageLoader } from "../components/ImageLoader";

const VOTER_COLORS = [
  "bg-pink-400", "bg-orange-400", "bg-violet-400", "bg-sky-400",
  "bg-emerald-400", "bg-amber-400", "bg-rose-400", "bg-indigo-400",
  "bg-teal-400", "bg-fuchsia-400", "bg-cyan-400", "bg-lime-500",
];

export default function ResultBlock({ title, imageSrc, voteCount, voters }) {
  // 統計每個投票者（同一人可能出現多次）
  const voterCounts = [];
  if (Array.isArray(voters)) {
    for (const name of voters) {
      if (!name) continue;
      const existing = voterCounts.find((v) => v.name === name);
      if (existing) {
        existing.count++;
      } else {
        voterCounts.push({ name, count: 1 });
      }
    }
  }

  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-md card-hover">
      {/* 圖片 */}
      <div className="aspect-square bg-gradient-to-b from-gray-50 to-gray-100 p-2 flex items-center justify-center">
        <ImageLoader
          src={imageSrc}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* 名稱 + 票數 */}
      <div className="bg-gradient-to-r from-pink-500 to-orange-400 text-white px-3 py-2
                      flex items-center justify-between">
        <span className="font-bold text-sm truncate">{title}</span>
        <span className="bg-white/25 rounded-full px-2 py-0.5 text-xs font-bold whitespace-nowrap">
          {voteCount} 票
        </span>
      </div>

      {/* 投票者列表 */}
      <div className="p-2 min-h-[4rem]">
        {voterCounts.length === 0 ? (
          <p className="text-gray-300 text-xs text-center py-2">尚無人投票</p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {voterCounts.map((voter, index) => {
              const colorClass = VOTER_COLORS[index % VOTER_COLORS.length];
              const tags = [];
              for (let i = 0; i < voter.count; i++) {
                tags.push(
                  <span
                    key={`${voter.name}_${i}`}
                    className={`${colorClass} text-white text-xs rounded-full px-2 py-0.5 font-medium`}
                  >
                    {voter.name}
                  </span>
                );
              }
              return tags;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
