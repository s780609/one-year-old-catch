"use client";

import { useState } from "react";
import { ImageLoader } from "./ImageLoader";
import toast, { Toaster } from "react-hot-toast";

export function Selector({
  myName,
  src,
  title,
  count,
  setCount,
  disabled,
  votedItems,
  setVotedItems,
}) {
  const [loading, setLoading] = useState(false);
  const hasVoted = votedItems.includes(title);

  const plus = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterName: myName, itemName: title }),
      });
      const data = await res.json();

      if (data.success) {
        setCount(count + 1);
        setVotedItems([...votedItems, title]);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("投票失敗: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteData = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/vote?voter=${encodeURIComponent(myName)}&item=${encodeURIComponent(title)}`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (data.success) {
        setCount(count - 1);
        setVotedItems(votedItems.filter((i) => i !== title));
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("取消失敗: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const Spinner = () => (
    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-white shadow-md card-hover
        ${hasVoted ? "voted-glow ring-2 ring-green-400" : ""}
        ${disabled && !hasVoted ? "opacity-50" : ""}`}
    >
      {/* 已投票標記 */}
      {hasVoted && (
        <div className="absolute top-2 right-2 z-10 bg-green-500 text-white rounded-full w-7 h-7
                        flex items-center justify-center text-sm check-animate shadow-md">
          ✓
        </div>
      )}

      {/* 圖片區 */}
      <div className="aspect-square bg-gradient-to-b from-gray-50 to-gray-100 p-2 flex items-center justify-center">
        <ImageLoader
          src={src}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* 名稱 */}
      <div className={`text-center py-1.5 px-2 font-bold text-sm
        ${hasVoted
          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
          : "bg-gradient-to-r from-pink-50 to-orange-50 text-gray-700"
        }`}>
        {title}
      </div>

      {/* 操作按鈕 */}
      <div className="p-2">
        {!hasVoted ? (
          <button
            onClick={() => {
              if (!myName) { alert("請輸入你的名字"); return; }
              if (count >= 3) { toast.error("已投滿 3 票"); return; }
              plus();
            }}
            disabled={loading || disabled}
            className={`w-full py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all
              ${disabled
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-orange-400 text-white hover:shadow-md hover:scale-[1.02] active:scale-95"
              }`}
          >
            {loading ? <Spinner /> : "🗳️ 選這個"}
          </button>
        ) : (
          <button
            onClick={deleteData}
            disabled={loading}
            className="w-full py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5
                       bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500
                       transition-all active:scale-95"
          >
            {loading ? <Spinner /> : "↩ 取消投票"}
          </button>
        )}
      </div>
    </div>
  );
}
