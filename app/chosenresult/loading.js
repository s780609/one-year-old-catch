export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 relative" role="status" aria-label="載入中">
      {/* YouTube 風格頂部載入條 */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-pink-100/50">
        <div className="h-full bg-gradient-to-r from-pink-500 via-red-400 to-orange-400 top-loading-bar" />
      </div>

      {/* Skeleton 標題 */}
      <div className="text-5xl mb-4">🎉</div>
      <div className="h-10 w-48 bg-gray-200 rounded-full mb-2 animate-pulse" />
      <div className="h-5 w-40 bg-gray-100 rounded-full mb-6 animate-pulse" />

      {/* 頁籤 Skeleton */}
      <div className="flex gap-2 mb-8">
        <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse" />
      </div>

      {/* 內容 Skeleton */}
      <div className="w-full max-w-md space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-16 bg-gray-200 rounded-2xl animate-pulse"
            style={{ animationDelay: `${i * 0.08}s` }}
          />
        ))}
      </div>
    </div>
  );
}
