"use client";

import { useState, useRef, useCallback } from "react";

const TABS = [
  { key: "chat", label: "文字對話", icon: "💬" },
  { key: "image", label: "圖片生成", icon: "🎨" },
  { key: "video", label: "影片生成", icon: "🎬" },
];

const ASPECT_RATIOS = ["1:1", "16:9", "9:16", "4:3", "3:4"];

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

const INSET_RING = "inset 0 0 0 1px rgb(3 7 18 / 0.08)";
const CARD_RING =
  "0 0 0 1px rgb(3 7 18 / 0.06), 0 1px 2px rgb(3 7 18 / 0.04), 0 6px 18px -6px rgb(3 7 18 / 0.08)";

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function FieldLabel({ children, hint }) {
  return (
    <div className="mb-2 flex items-baseline justify-between gap-2">
      <label className="font-mono uppercase tracking-wider text-[11px] text-neutral-600">
        {children}
      </label>
      {hint && <span className="text-[11px] text-neutral-400">{hint}</span>}
    </div>
  );
}

function SegmentedControl({ options, value, onChange }) {
  return (
    <div
      className="inline-flex rounded-full bg-neutral-100 p-1"
      style={{ boxShadow: INSET_RING }}
    >
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-3 py-1 rounded-full text-xs font-semibold tabular-nums tracking-tight transition-all
              ${active ? "bg-white text-neutral-900" : "text-neutral-500 hover:text-neutral-800"}`}
            style={active ? { boxShadow: CARD_RING } : undefined}
          >
            {opt}
          </button>
        );
      })}
    </div>
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
      <FieldLabel hint="選填">附加圖片</FieldLabel>
      <div
        className="rounded-2xl bg-neutral-950/[0.025] p-6 text-center cursor-pointer
                   hover:bg-neutral-950/[0.04] transition-all"
        style={{ boxShadow: INSET_RING }}
        onClick={() => fileInputRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault();
          loadImageFile(e.dataTransfer.files?.[0]);
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        {image ? (
          <div className="flex flex-col items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="preview" className="max-h-48 rounded-lg object-contain" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="text-xs text-neutral-500 hover:text-red-600 underline underline-offset-4 transition-colors"
            >
              移除圖片
            </button>
          </div>
        ) : (
          <p className="text-neutral-400 text-xs font-medium">點擊或拖曳圖片至此處上傳</p>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => loadImageFile(e.target.files?.[0])}
      />
    </div>
  );
}

function MultiImageUpload({ images, onImagesChange, fileInputRef }) {
  function loadFiles(files) {
    Array.from(files).forEach((file) => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return;
      const reader = new FileReader();
      reader.onload = (ev) => onImagesChange((prev) => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
  }

  function removeImage(index) {
    onImagesChange((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div>
      <FieldLabel hint="選填，可多張">參考圖片</FieldLabel>
      <div
        className="rounded-2xl bg-neutral-950/[0.025] p-5 cursor-pointer
                   hover:bg-neutral-950/[0.04] transition-all"
        style={{ boxShadow: INSET_RING }}
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
                <img
                  src={img}
                  alt={`ref-${i}`}
                  className="h-24 rounded-lg object-cover"
                  style={{ boxShadow: INSET_RING }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(i);
                  }}
                  className="absolute -top-1.5 -right-1.5 bg-neutral-900 text-white rounded-full w-5 h-5 text-[10px]
                             flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
            <div
              className="h-24 w-20 rounded-lg flex items-center justify-center text-neutral-400 text-xl"
              style={{ boxShadow: "inset 0 0 0 1px rgb(3 7 18 / 0.08)" }}
            >
              +
            </div>
          </div>
        ) : (
          <p className="text-neutral-400 text-xs font-medium text-center py-2">
            點擊或拖曳圖片至此處上傳（可多張）
          </p>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          loadFiles(e.target.files);
          e.target.value = "";
        }}
      />
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

  const [chatResult, setChatResult] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [imageAspectRatio, setImageAspectRatio] = useState("1:1");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoStatus, setVideoStatus] = useState("");
  const [videoDuration, setVideoDuration] = useState(5);
  const [videoAspectRatio, setVideoAspectRatio] = useState("16:9");

  const clearImage = () => {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
        setTimeout(() => pollVideo(requestId), 5000);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setVideoStatus("failed");
    }
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
        if (data.success) setChatResult(data.result);
        else throw new Error(data.error || "Unknown error");
        setLoading(false);
      } else if (tab === "image") {
        setGeneratedImage("");
        const res = await fetch("/api/openai/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, images, aspectRatio: imageAspectRatio }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP ${res.status}`);
        }
        const data = await res.json();
        if (data.success) setGeneratedImage(data.imageUrl);
        else throw new Error(data.error || "Unknown error");
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
        if (data.success && data.requestId) pollVideo(data.requestId);
        else throw new Error(data.error || "Unknown error");
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  const buttonLabel = tab === "chat" ? "送出對話" : tab === "image" ? "生成圖片" : "生成影片";

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
      {/* 頂部極簡分隔線 */}
      <div className="w-full" style={{ borderBottom: "1px solid rgb(3 7 18 / 0.06)" }} />

      <div className="max-w-screen-md mx-auto px-6 pt-14 pb-20">
        {/* Hero — split headline */}
        <div className="mb-10">
          <p className="font-mono uppercase tracking-[0.18em] text-[11px] text-neutral-500 mb-3">
            實驗沙盒
          </p>
          <div className="grid md:grid-cols-5 gap-4 md:gap-8 items-start">
            <h1 className="md:col-span-3 text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-[1.05]">
              🤖 AI 實驗頁面
            </h1>
            <p className="md:col-span-2 text-neutral-600 text-sm leading-7 text-pretty max-w-[34ch] md:pt-2">
              文字對話、圖片生成、影片生成都在這。每個模式皆可附加圖片作為參考。
            </p>
          </div>
        </div>

        {/* Tabs — segmented control */}
        <div className="mb-8">
          <div
            className="inline-flex rounded-full bg-neutral-100 p-1"
            style={{ boxShadow: INSET_RING }}
          >
            {TABS.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => {
                    setTab(t.key);
                    setError("");
                  }}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold tracking-tight transition-all
                    ${active ? "bg-white text-neutral-900" : "text-neutral-500 hover:text-neutral-800"}`}
                  style={active ? { boxShadow: CARD_RING } : undefined}
                >
                  <span className="mr-1.5">{t.icon}</span>
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white p-7 md:p-8 space-y-6"
          style={{ boxShadow: CARD_RING }}
        >
          <div>
            <FieldLabel>指令 Prompt</FieldLabel>
            <textarea
              className="w-full rounded-xl bg-white p-3.5 text-sm leading-7 resize-none outline-none
                         transition-all focus:shadow-[inset_0_0_0_1.5px_rgb(236_72_153_/_0.5)] min-h-[128px]"
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
              style={{ boxShadow: INSET_RING }}
            />
          </div>

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

          {tab === "image" && (
            <div>
              <FieldLabel>比例</FieldLabel>
              <SegmentedControl
                options={ASPECT_RATIOS}
                value={imageAspectRatio}
                onChange={setImageAspectRatio}
              />
            </div>
          )}

          {tab === "video" && (
            <div className="space-y-5">
              <div>
                <FieldLabel>比例</FieldLabel>
                <SegmentedControl
                  options={ASPECT_RATIOS}
                  value={videoAspectRatio}
                  onChange={setVideoAspectRatio}
                />
              </div>

              <div>
                <div className="mb-2 flex items-baseline justify-between">
                  <label className="font-mono uppercase tracking-wider text-[11px] text-neutral-600">
                    長度
                  </label>
                  <span className="font-mono tabular-nums text-xs text-neutral-900 font-semibold">
                    {videoDuration}s
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={videoDuration}
                  onChange={(e) => setVideoDuration(Number(e.target.value))}
                  className="w-full accent-pink-500"
                />
                <div className="flex justify-between text-[10px] font-mono tabular-nums text-neutral-400 mt-1">
                  <span>1s</span>
                  <span>15s</span>
                </div>
              </div>
            </div>
          )}

          {/* Submit — pill */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full rounded-full px-6 py-2.5 text-sm font-semibold text-white tracking-tight
                         transition-all disabled:cursor-not-allowed disabled:bg-neutral-300
                         bg-neutral-900 hover:bg-neutral-800 hover:-translate-y-0.5"
              style={
                loading || !prompt.trim()
                  ? undefined
                  : { boxShadow: "0 4px 14px -4px rgb(3 7 18 / 0.35)" }
              }
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
          </div>
        </form>

        {/* Error */}
        {error && (
          <div
            className="mt-6 rounded-2xl bg-red-50/80 px-5 py-4 text-red-700 text-sm leading-7 whitespace-pre-wrap"
            style={{ boxShadow: "inset 0 0 0 1px rgb(239 68 68 / 0.15)" }}
          >
            <span className="font-mono uppercase tracking-wider text-[10px] mr-2 opacity-70">
              錯誤
            </span>
            {error}
          </div>
        )}

        {/* Chat result */}
        {tab === "chat" && chatResult && (
          <div className="mt-8 rounded-3xl bg-white p-7" style={{ boxShadow: CARD_RING }}>
            <p className="font-mono uppercase tracking-[0.18em] text-[11px] text-neutral-500 mb-3">
              AI 回應
            </p>
            <p className="text-neutral-800 text-sm leading-7 whitespace-pre-wrap text-pretty">
              {chatResult}
            </p>
          </div>
        )}

        {/* Image result */}
        {tab === "image" && generatedImage && (
          <div className="mt-8 rounded-3xl bg-white p-4 md:p-5" style={{ boxShadow: CARD_RING }}>
            <div className="flex items-baseline justify-between mb-3 px-2">
              <p className="font-mono uppercase tracking-[0.18em] text-[11px] text-neutral-500">
                生成圖片
              </p>
              <a
                href={generatedImage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold text-neutral-600 hover:text-neutral-900 underline underline-offset-4"
              >
                開啟原圖 →
              </a>
            </div>
            <div
              className="rounded-2xl overflow-hidden bg-neutral-950/[0.025]"
              style={{ boxShadow: INSET_RING }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={generatedImage} alt="generated" className="w-full" />
            </div>
          </div>
        )}

        {/* Video result */}
        {tab === "video" && videoUrl && (
          <div className="mt-8 rounded-3xl bg-white p-4 md:p-5" style={{ boxShadow: CARD_RING }}>
            <div className="flex items-baseline justify-between mb-3 px-2">
              <p className="font-mono uppercase tracking-[0.18em] text-[11px] text-neutral-500">
                生成影片
              </p>
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold text-neutral-600 hover:text-neutral-900 underline underline-offset-4"
              >
                下載影片 →
              </a>
            </div>
            <div
              className="rounded-2xl overflow-hidden bg-neutral-950/[0.025]"
              style={{ boxShadow: INSET_RING }}
            >
              <video src={videoUrl} controls autoPlay loop className="w-full" />
            </div>
          </div>
        )}

        {/* Video pending */}
        {tab === "video" && loading && videoStatus === "pending" && (
          <div
            className="mt-6 rounded-2xl bg-amber-50/80 px-5 py-4 text-amber-800 text-sm flex items-center gap-3"
            style={{ boxShadow: "inset 0 0 0 1px rgb(245 158 11 / 0.2)" }}
          >
            <Spinner />
            <span>
              <span className="font-mono uppercase tracking-wider text-[10px] mr-2 opacity-70">
                處理中
              </span>
              影片正在生成中，每 5 秒自動檢查進度…
            </span>
          </div>
        )}
      </div>
    </main>
  );
}
