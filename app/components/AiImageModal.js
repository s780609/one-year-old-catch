"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

const Spinner = () => (
  <svg className="animate-spin h-8 w-8 text-pink-500" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

// 壓縮圖片到指定最大寬度，回傳 base64
function compressImage(src, maxWidth = 512) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.onerror = reject;
    img.src = src;
  });
}

export function AiImageModal({ title, prompt, itemImageSrc, onClose }) {
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setError("");
    setStarted(true);

    try {
      // 1. 取得秧予動畫風照片並壓縮
      const animeBase64 = await compressImage("/秧予動畫風照片.jpg");

      // 2. 取得物件圖片並壓縮
      let itemSrc;
      if (typeof itemImageSrc === "string") {
        itemSrc = itemImageSrc;
      } else if (itemImageSrc?.src) {
        itemSrc = itemImageSrc.src;
      }
      const itemBase64 = itemSrc ? await compressImage(itemSrc) : null;

      // 3. 呼叫 API
      const res = await fetch("/api/openai/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          images: [animeBase64, itemBase64].filter(Boolean),
          aspectRatio: "1:1",
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setGeneratedImage(data.imageUrl);
      } else {
        throw new Error(data.error || "生成失敗");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}>
        {/* 標題 */}
        <div className="bg-gradient-to-r from-pink-500 to-orange-400 px-6 py-4">
          <h2 className="text-white font-bold text-lg text-center">
            ✨ 秧予的未來 — {title}
          </h2>
        </div>

        <div className="p-6">
          {/* 尚未開始 */}
          {!started && (
            <div className="text-center space-y-4">
              <p className="text-gray-600 text-sm">
                用 AI 生成秧予抓到「{title}」後的可愛未來想像圖！
              </p>
              <button
                onClick={handleGenerate}
                className="bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold py-3 px-8 rounded-xl
                           hover:shadow-lg transition-all active:scale-95"
              >
                🎨 開始生成
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center gap-4 py-8">
              <Spinner />
              <p className="text-pink-500 font-medium animate-pulse">
                AI 正在繪製秧予的未來...
              </p>
              <p className="text-gray-400 text-xs">通常需要 10-30 秒</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm whitespace-pre-wrap break-all">
                ❌ {error}
              </div>
              <button
                onClick={handleGenerate}
                className="w-full bg-pink-500 text-white font-bold py-3 rounded-xl hover:bg-pink-600 transition"
              >
                🔄 重新生成
              </button>
            </div>
          )}

          {/* 生成結果 */}
          {generatedImage && !loading && (
            <div className="space-y-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={generatedImage}
                alt={`秧予的未來 - ${title}`}
                className="w-full rounded-2xl shadow-lg"
              />
              <a
                href={generatedImage}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-sm text-pink-500 hover:text-pink-700 underline"
              >
                開啟原圖
              </a>
            </div>
          )}
        </div>

        {/* 底部按鈕 */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-[15px] transition-all
                       bg-gradient-to-r from-emerald-500 to-teal-500 text-white
                       hover:shadow-lg active:scale-95 disabled:opacity-50"
          >
            ↩ 回去投票
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
