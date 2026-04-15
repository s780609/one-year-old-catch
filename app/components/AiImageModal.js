"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const Spinner = () => (
  <svg className="animate-spin h-8 w-8 text-pink-500" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

function ImageSkeleton() {
  // 外層 rounded-2xl (16px) + padding 0，內部就用 rounded-xl (12px) 作 concentric
  return (
    <div className="w-full aspect-square rounded-xl overflow-hidden relative bg-gradient-to-br from-pink-50 to-violet-50 edge-ring">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div className="text-4xl animate-bounce">🫧</div>
        <Spinner />
        <p className="text-pink-500 font-medium text-sm">夢想泡泡正在成形中…</p>
        <p className="eyebrow text-neutral-400">通常 10–30 秒</p>
      </div>
    </div>
  );
}

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleGenerate() {
    setLoading(true);
    setError("");

    try {
      const animeBase64 = await compressImage("/秧予動畫風照片.jpg");

      const res = await fetch("/api/openai/image-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          image: animeBase64,
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/60 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}>
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden"
           style={{ boxShadow: "0 0 0 1px rgb(3 7 18 / 0.08), 0 24px 48px -12px rgb(3 7 18 / 0.3)" }}
           onClick={(e) => e.stopPropagation()}>
        {/* 標題列 */}
        <div className="px-6 py-4 flex items-baseline gap-2"
             style={{ boxShadow: "inset 0 -1px 0 rgb(3 7 18 / 0.06)" }}>
          <p className="eyebrow">夢想泡泡</p>
          <h2 className="text-base font-semibold text-neutral-950 tracking-tight truncate">
            {title}
          </h2>
        </div>

        <div className="p-5">
          {loading && <ImageSkeleton />}

          {error && !loading && (
            <div className="space-y-4">
              <div className="rounded-xl p-4 text-sm text-red-700 whitespace-pre-wrap break-all"
                   style={{ background: "rgb(254 226 226 / 0.6)", boxShadow: "inset 0 0 0 1px rgb(239 68 68 / 0.25)" }}>
                {error}
              </div>
              <button
                onClick={handleGenerate}
                className="w-full rounded-full py-2.5 text-sm font-semibold
                           bg-gradient-to-r from-pink-500 to-orange-400 text-white
                           hover:shadow-md transition-all active:scale-[0.98]"
                style={{ boxShadow: "0 1px 2px rgb(236 72 153 / 0.25), 0 0 0 1px rgb(3 7 18 / 0.05)" }}
              >
                重新生成
              </button>
            </div>
          )}

          {generatedImage && !loading && (
            <div className="space-y-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={generatedImage}
                alt={`夢想泡泡 - ${title}`}
                className="w-full rounded-xl"
                style={{ boxShadow: "inset 0 0 0 1px rgb(3 7 18 / 0.05)" }}
              />
              <a
                href={generatedImage}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-xs font-medium text-pink-500 hover:text-pink-600 underline underline-offset-4"
              >
                開啟原圖
              </a>
            </div>
          )}
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            className="w-full rounded-full py-2.5 text-sm font-semibold
                       bg-gradient-to-r from-emerald-500 to-teal-500 text-white
                       hover:shadow-md active:scale-[0.98] transition-all"
            style={{ boxShadow: "0 1px 2px rgb(16 185 129 / 0.25), 0 0 0 1px rgb(3 7 18 / 0.05)" }}
          >
            回去投票
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
