"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const TABS = [
  { key: "chat", label: "💬 文字對話" },
  { key: "image", label: "🎨 圖片生成" },
  { key: "video", label: "🎬 影片生成" },
];

const ASPECT_RATIOS = ["1:1", "16:9", "9:16", "4:3", "3:4"];

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
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
  );
}

function SingleImageUpload({ image, onImageChange, onRemove, fileInputRef }) {
  function loadImageFile(file) {
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return;
    const reader = new FileReader();
    reader.onload = (ev) => onImageChange(ev.target.result);
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <label className="block font-semibold text-gray-700 mb-1">
        圖片（選填）
      </label>
      <div
        className="border-2 border-dashed border-pink-300 rounded-xl p-5 text-center cursor-pointer hover:bg-pink-50 transition"
        onClick={() => fileInputRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault();
          loadImageFile(e.dataTransfer.files?.[0]);
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        {image ? (
          <div className="flex flex-col items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="preview" className="max-h-48 rounded-lg object-contain" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="text-xs text-red-400 hover:text-red-600 underline"
            >
              移除圖片
            </button>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">點擊或拖曳圖片至此處上傳</p>
        )}
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => loadImageFile(e.target.files?.[0])} />
    </div>
  );
}

function MultiImageUpload({ images, onImagesChange, fileInputRef }) {
  function loadFiles(files) {
    Array.from(files).forEach((file) => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return;
      const reader = new FileReader();
      reader.onload = (ev) =>
        onImagesChange((prev) => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
  }

  function removeImage(index) {
    onImagesChange((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="block font-semibold text-gray-700 mb-1">
        參考圖片（選填，可多張）
      </label>
      <div
        className="border-2 border-dashed border-pink-300 rounded-xl p-5 text-center cursor-pointer hover:bg-pink-50 transition"
        onClick={() => fileInputRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault();
          loadFiles(e.dataTransfer.files);
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        {images.length > 0 ? (
          <div className="flex flex-wrap gap-3 justify-center">
            {images.map((img, i) => (
              <div key={i} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`ref-${i}`} className="h-28 rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            ))}
            <div className="h-28 w-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-2xl">
              +
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">點擊或拖曳圖片至此處上傳（可多張）</p>
        )}
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
        onChange={(e) => { loadFiles(e.target.files); e.target.value = ""; }} />
    </div>
  );
}

export default function ExperimentPage() {
  const [tab, setTab] = useState("chat");
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const multiFileInputRef = useRef(null);

  // Chat state
  const [chatResult, setChatResult] = useState("");

  // Image gen state
  const [generatedImage, setGeneratedImage] = useState("");
  const [imageAspectRatio, setImageAspectRatio] = useState("1:1");

  // Video gen state
  const [videoUrl, setVideoUrl] = useState("");
  const [videoStatus, setVideoStatus] = useState("");
  const [videoDuration, setVideoDuration] = useState(5);
  const [videoAspectRatio, setVideoAspectRatio] = useState("16:9");

  const clearImage = () => {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Poll video status
  const pollVideo = useCallback(async (requestId) => {
    try {
      const res = await fetch(`/api/openai/video/${requestId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (!data.success) {
        setError(data.error || "影片查詢失敗");
        setLoading(false);
        setVideoStatus("failed");
        return;
      }

      setVideoStatus(data.status);

      if (data.status === "done") {
        setVideoUrl(data.videoUrl);
        setLoading(false);
      } else if (data.status === "failed" || data.status === "expired") {
        setError(`影片生成${data.status === "failed" ? "失敗" : "已過期"}`);
        setLoading(false);
      } else {
        // Still pending, poll again
        setTimeout(() => pollVideo(requestId), 5000);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setVideoStatus("failed");
    }
  }, []);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
          };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");

    try {
      if (tab === "chat") {
        setChatResult("");
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
          setChatResult(data.result);
        } else {
          throw new Error(data.error || "Unknown error");
        }
        setLoading(false);
      } else if (tab === "image") {
        setGeneratedImage("");
        const res = await fetch("/api/openai/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            images,
            aspectRatio: imageAspectRatio,
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
          throw new Error(data.error || "Unknown error");
        }
        setLoading(false);
      } else if (tab === "video") {
        setVideoUrl("");
        setVideoStatus("pending");
                const res = await fetch("/api/openai/video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            images,
            duration: videoDuration,
            aspectRatio: videoAspectRatio,
          }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP ${res.status}`);
        }
        const data = await res.json();
        if (data.success && data.requestId) {
          pollVideo(data.requestId);
        } else {
          throw new Error(data.error || "Unknown error");
        }
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  const buttonLabel =
    tab === "chat"
      ? "送出對話"
      : tab === "image"
        ? "生成圖片"
        : "生成影片";

  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2 text-pink-600">
          🤖 AI 實驗頁面
        </h1>
        <p className="text-center text-gray-500 mb-6 text-sm">
          支援文字對話、圖片生成、影片生成，皆可附加圖片作為參考。
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 justify-center">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                setError("");
              }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                tab === t.key
                  ? "bg-pink-500 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Prompt */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Prompt
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-300 min-h-[120px]"
              placeholder={
                tab === "chat"
                  ? "輸入你的問題或指令…"
                  : tab === "image"
                    ? "描述你想生成的圖片…"
                    : "描述你想生成的影片…"
              }
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Image upload */}
          {tab === "chat" ? (
            <SingleImageUpload
              image={image}
              onImageChange={setImage}
              onRemove={clearImage}
              fileInputRef={fileInputRef}
            />
          ) : (
            <MultiImageUpload
              images={images}
              onImagesChange={setImages}
              fileInputRef={multiFileInputRef}
            />
          )}

          {/* Image gen options */}
          {tab === "image" && (
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                比例
              </label>
              <div className="flex gap-2 flex-wrap">
                {ASPECT_RATIOS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setImageAspectRatio(r)}
                    className={`px-3 py-1 rounded-lg text-sm transition ${
                      imageAspectRatio === r
                        ? "bg-pink-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Video gen options */}
          {tab === "video" && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  比例
                </label>
                <div className="flex gap-2 flex-wrap">
                  {ASPECT_RATIOS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setVideoAspectRatio(r)}
                      className={`px-3 py-1 rounded-lg text-sm transition ${
                        videoAspectRatio === r
                          ? "bg-pink-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  影片長度（秒）：{videoDuration}s
                </label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={videoDuration}
                  onChange={(e) => setVideoDuration(Number(e.target.value))}
                  className="w-full accent-pink-500"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>1s</span>
                  <span>15s</span>
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-200 text-white font-bold py-3 rounded-xl transition"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner />
                {tab === "video" && videoStatus === "pending"
                  ? "影片生成中，請稍候…"
                  : "處理中…"}
              </span>
            ) : (
              buttonLabel
            )}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm whitespace-pre-wrap">
            ❌ {error}
          </div>
        )}

        {/* Chat result */}
        {tab === "chat" && chatResult && (
          <div className="mt-6 bg-white border border-pink-200 rounded-xl p-5 shadow-sm">
            <h2 className="font-bold text-gray-700 mb-2">AI 回應結果</h2>
            <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">
              {chatResult}
            </p>
          </div>
        )}

        {/* Generated image result */}
        {tab === "image" && generatedImage && (
          <div className="mt-6 bg-white border border-pink-200 rounded-xl p-5 shadow-sm">
            <h2 className="font-bold text-gray-700 mb-2">生成的圖片</h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={generatedImage}
              alt="generated"
              className="w-full rounded-lg"
            />
            <a
              href={generatedImage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sm text-pink-500 hover:text-pink-700 underline"
            >
              開啟原圖
            </a>
          </div>
        )}

        {/* Video result */}
        {tab === "video" && videoUrl && (
          <div className="mt-6 bg-white border border-pink-200 rounded-xl p-5 shadow-sm">
            <h2 className="font-bold text-gray-700 mb-2">生成的影片</h2>
            <video
              src={videoUrl}
              controls
              autoPlay
              loop
              className="w-full rounded-lg"
            />
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sm text-pink-500 hover:text-pink-700 underline"
            >
              下載影片
            </a>
          </div>
        )}

        {/* Video pending status */}
        {tab === "video" && loading && videoStatus === "pending" && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-700 text-sm flex items-center gap-2">
            <Spinner />
            影片正在生成中，每 5 秒自動檢查進度…
          </div>
        )}
      </div>
    </main>
  );
}
