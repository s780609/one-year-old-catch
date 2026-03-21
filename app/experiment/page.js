"use client";

import { useState, useRef } from "react";

export default function ExperimentPage() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null); // base64 data URL
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  function loadImageFile(file) {
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("不支援的圖片格式，請上傳 JPEG、PNG、GIF 或 WebP 圖片。");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target.result);
    reader.readAsDataURL(file);
  }

  function handleImageChange(e) {
    loadImageFile(e.target.files?.[0]);
  }

  function handleDrop(e) {
    e.preventDefault();
    loadImageFile(e.dataTransfer.files?.[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setResult("");
    setError("");

    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, image }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setResult(data.result);
      } else {
        setError(data.error || "Unknown error");
      }    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2 text-pink-600">
          🤖 OpenAI 實驗頁面
        </h1>
        <p className="text-center text-gray-500 mb-8 text-sm">
          輸入 Prompt，可選擇上傳圖片，送出後查看 AI 回應結果。
          <br />
          需在環境變數設定{" "}
          <code className="bg-gray-100 px-1 rounded text-xs">OPENAI_API_KEY</code>。
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Prompt textarea */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Prompt
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-300 min-h-[120px]"
              placeholder="輸入你的問題或指令…"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Image upload */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              圖片（選填）
            </label>
            <div
              className="border-2 border-dashed border-pink-300 rounded-xl p-5 text-center cursor-pointer hover:bg-pink-50 transition"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              {image ? (
                <div className="flex flex-col items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt="preview"
                    className="max-h-48 rounded-lg object-contain"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImage(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-xs text-red-400 hover:text-red-600 underline"
                  >
                    移除圖片
                  </button>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">
                  點擊或拖曳圖片至此處上傳
                </p>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-200 text-white font-bold py-3 rounded-xl transition"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                處理中…
              </span>
            ) : (
              "送出"
            )}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm whitespace-pre-wrap">
            ❌ {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-6 bg-white border border-pink-200 rounded-xl p-5 shadow-sm">
            <h2 className="font-bold text-gray-700 mb-2">AI 回應結果</h2>
            <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">
              {result}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
