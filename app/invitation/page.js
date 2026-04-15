"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

import photo1 from "../assets/秧予/秧予_IMG_0999.jpg";
import photo2 from "../assets/秧予/秧予_IMG_1499.jpeg";
import photo3 from "../assets/秧予/秧予_IMG_1799.jpeg";
import photo4 from "../assets/秧予/秧予_IMG_0998.jpg";
import photo5 from "../assets/秧予/秧予_IMG_1891.jpg";
import photo6 from "../assets/秧予/秧予_IMG_1928.jpeg";
import photo7 from "../assets/秧予/秧予_IMG_1937.jpeg";
import photo8 from "../assets/秧予/秧予_IMG_1966.jpeg";
import photo9 from "../assets/秧予/秧予_IMG_2032.jpeg";
import photo10 from "../assets/秧予/秧予_IMG_2034.jpeg";
import photo11 from "../assets/秧予/秧予_IMG_2047.jpeg";
import photo12 from "../assets/秧予/秧予_IMG_2287.jpeg";

const photos = [photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8, photo9, photo10, photo11, photo12];
const heroPhoto = photo11;

const AI_STYLE_PROMPT = "cute pastel kawaii anime style, soft shading, dreamy atmosphere, detailed baby portrait, preserve the exact same baby's face, eyes, expression and proportions from the reference image";

function imageToBase64(src) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d").drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = reject;
    img.src = typeof src === "string" ? src : src.src;
  });
}

const videos = [
  { src: "/秧予/秧予_吃1.mp4", label: "吃飯中 1" },
  { src: "/秧予/秧予_吃2.mp4", label: "吃飯中 2" },
  { src: "/秧予/秧予_公園1.mp4", label: "公園玩耍 1" },
  { src: "/秧予/秧予_公園2.mp4", label: "公園玩耍 2" },
  { src: "/秧予/秧予_睡1.mp4", label: "睡覺中" },
];

const PRELOAD_AHEAD = 2;

function VideoCarousel() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const videoRefs = useRef(new Map());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % videos.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [currentIdx]);

  useEffect(() => {
    setVideoReady(false);
    videoRefs.current.forEach((el, idx) => {
      if (!el) return;
      if (idx === currentIdx) {
        el.currentTime = 0;
        el.play().catch(() => {});
      } else {
        el.pause();
      }
    });
  }, [currentIdx]);

  function isInPreloadWindow(i) {
    for (let step = 0; step <= PRELOAD_AHEAD; step++) {
      if (i === (currentIdx + step) % videos.length) return true;
    }
    return false;
  }

  return (
    <div
      className="relative w-full max-w-[420px] mx-auto rounded-3xl overflow-hidden
                 bg-gradient-to-br from-rose-100 via-pink-50 to-orange-100"
      style={{
        aspectRatio: "9 / 16",
        boxShadow:
          "inset 0 0 0 1px rgb(3 7 18 / 0.06), 0 0 0 1px rgb(3 7 18 / 0.05), 0 12px 32px -12px rgb(236 72 153 / 0.18)",
      }}
    >
      {videos.map((v, i) => {
        const isCurrent = i === currentIdx;
        const shouldPreload = isInPreloadWindow(i);
        return (
          <video
            key={i}
            ref={(el) => {
              if (el) videoRefs.current.set(i, el);
              else videoRefs.current.delete(i);
            }}
            src={v.src}
            muted
            loop
            playsInline
            preload={shouldPreload ? "auto" : "none"}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out
              ${isCurrent
                ? videoReady
                  ? "blur-0 scale-100 opacity-100"
                  : "blur-lg scale-110 opacity-80"
                : "opacity-0"
              }`}
            onCanPlay={isCurrent ? () => setVideoReady(true) : undefined}
          />
        );
      })}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {videos.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIdx(i)}
            aria-label={`影片 ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300
              ${i === currentIdx ? "bg-pink-500 w-5" : "bg-white/70 w-1.5 hover:bg-white"}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function InvitationPage() {
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpCount, setRsvpCount] = useState("1");
  const [submitting, setSubmitting] = useState(false);
  const [rsvpList, setRsvpList] = useState([]);
  const [totalAttendees, setTotalAttendees] = useState(0);
  const [loadingList, setLoadingList] = useState(true);
  const [aiImages, setAiImages] = useState({});
  const [aiLoading, setAiLoading] = useState({});

  async function handleAiRedraw(index) {
    if (aiLoading[index]) return;
    setAiLoading((prev) => ({ ...prev, [index]: true }));
    try {
      const base64 = await imageToBase64(photos[index]);
      const res = await fetch("/api/openai/image-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: AI_STYLE_PROMPT, image: base64 }),
      });
      const json = await res.json();
      if (json.success && json.imageUrl) {
        setAiImages((prev) => ({ ...prev, [index]: json.imageUrl }));
        toast.success("AI 重繪完成！");
      } else {
        toast.error(json.error || "AI 重繪失敗");
      }
    } catch {
      toast.error("AI 重繪失敗，請稍後再試");
    } finally {
      setAiLoading((prev) => ({ ...prev, [index]: false }));
    }
  }

  const fetchRsvp = useCallback(async () => {
    try {
      const res = await fetch("/api/rsvp");
      const json = await res.json();
      if (json.success) {
        setRsvpList(json.data);
        setTotalAttendees(json.totalAttendees);
      }
    } catch {
      /* silent */
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    fetchRsvp();
  }, [fetchRsvp]);

  async function handleRsvpSubmit(e) {
    e.preventDefault();
    if (!rsvpName.trim()) {
      toast.error("請填寫您的身份！");
      return;
    }
    const count = parseInt(rsvpCount, 10);
    if (!count || count < 1) {
      toast.error("請填寫正確的參加人數！");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: rsvpName.trim(), num_attendees: count }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("已成功回覆！期待見到您 💗");
        setRsvpName("");
        setRsvpCount("1");
        await fetchRsvp();
      } else {
        toast.error(json.error || "回覆失敗，請稍後再試");
      }
    } catch {
      toast.error("網路錯誤，請稍後再試");
    } finally {
      setSubmitting(false);
    }
  }

  function scrollToRsvp() {
    document.getElementById("rsvp-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const cardRing = "0 0 0 1px rgb(3 7 18 / 0.06), 0 1px 2px rgb(3 7 18 / 0.04), 0 12px 32px -12px rgb(236 72 153 / 0.14)";
  const insetRing = "inset 0 0 0 1px rgb(3 7 18 / 0.08)";

  return (
    <main
      className="min-h-screen text-neutral-900"
      style={{ background: "linear-gradient(180deg, #fff8fb 0%, #fff0f6 40%, #fef3c7 100%)" }}
    >
      <Toaster position="top-center" />

      {/* Hero：滿版照片 + 漸層覆蓋 + 標題 */}
      <section className="relative w-full overflow-hidden">
        <div className="relative w-full max-w-[640px] mx-auto aspect-[3/4] sm:aspect-[4/5]">
          <Image
            src={heroPhoto}
            alt="秧予"
            fill
            priority
            sizes="(max-width: 640px) 100vw, 640px"
            placeholder="blur"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <p className="font-mono uppercase tracking-[0.2em] text-[10px] text-white/85">
              Yangyu · 2026·04·18
            </p>
            <span className="rounded-full bg-white/15 backdrop-blur px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-white/90 ring-1 ring-white/20">
              1st birthday
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-28">
            <h1
              className="text-[clamp(44px,12vw,72px)] font-bold tracking-tight leading-[0.95] text-white drop-shadow-lg"
              style={{ fontFamily: "'Noto Serif TC', serif" }}
            >
              小秧秧
              <br />
              一歲囉！
            </h1>
            <p className="text-white/95 text-sm mt-3 leading-7 text-pretty max-w-[26ch] drop-shadow">
              抓周派對來啦 🎉 邀請您和家人一起同樂。
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-[640px] mx-auto px-4 -mt-20 pb-24 space-y-5 relative z-10">
        {/* 活動資訊卡：手機首屏最重要 */}
        <section
          className="rounded-3xl bg-white/90 backdrop-blur-sm p-5"
          style={{ boxShadow: cardRing }}
        >
          <p className="font-mono uppercase tracking-[0.18em] text-[11px] text-pink-700/70 mb-4">
            活動資訊
          </p>
          <div className="space-y-3">
            <InfoRow icon="📅" label="日期" value="2026 年 4 月 18 日（六）" />
            <InfoRow icon="🕑" label="時間" value="下午 2:00 開始" />
            <InfoRow
              icon="📍"
              label="地點"
              value="新北市五股區成泰路二段 91 巷 15-3 號 14 樓"
              hint="有電梯，方便推車或長輩"
            />
            <InfoRow icon="👗" label="服裝" value="輕鬆休閒即可" />
          </div>

          <button
            onClick={scrollToRsvp}
            className="mt-6 w-full rounded-2xl py-4 text-base font-semibold text-white tracking-tight
                       bg-gradient-to-r from-pink-500 to-amber-500 transition-all
                       active:scale-[0.98] hover:shadow-lg"
            style={{ boxShadow: "0 8px 20px -6px rgb(236 72 153 / 0.45)" }}
          >
            💌 回覆出席
          </button>
        </section>

        {/* 寶貝介紹卡 */}
        <section
          className="rounded-3xl bg-white/80 backdrop-blur-sm p-6 text-center"
          style={{ boxShadow: cardRing }}
        >
          <p className="text-neutral-600 text-sm leading-7">轉眼間，我們的小寶貝</p>
          <p
            className="text-3xl font-bold tracking-tight text-pink-700 my-2"
            style={{ fontFamily: "'Noto Serif TC', serif" }}
          >
            許秧予 <span className="text-neutral-400 text-base font-medium">（女）</span>
          </p>
          <p className="text-neutral-600 text-sm leading-7">已經要滿一歲生日了！</p>
          <p className="font-mono uppercase tracking-wider text-[11px] text-neutral-500 mt-3">
            🎂 2025·05·07 · 乙巳年四月初十
          </p>
          <p className="text-neutral-700 text-[15px] leading-8 mt-5 text-pretty max-w-[32ch] mx-auto">
            準備了經典的抓周儀式，也安排了好吃的點心，希望能和最親愛的你們一起慶祝。
          </p>
          <p
            className="text-base font-semibold text-pink-700 tracking-tight mt-6 pt-5"
            style={{ borderTop: "1px solid rgb(3 7 18 / 0.06)", fontFamily: "'Noto Serif TC', serif" }}
          >
            愛你們的 · 秧予爸媽 敬上 💗
          </p>
        </section>

        {/* RSVP 表單 */}
        <section
          id="rsvp-section"
          className="rounded-3xl bg-white/90 backdrop-blur-sm p-5 scroll-mt-6"
          style={{ boxShadow: cardRing }}
        >
          <p className="font-mono uppercase tracking-[0.18em] text-[11px] text-pink-700/70 mb-2">
            線上回覆
          </p>
          <h2 className="text-2xl font-bold tracking-tight leading-tight">
            <span className="text-neutral-900">回覆出席 </span>
            <span className="text-neutral-500 text-base font-medium">讓我們備好座位</span>
          </h2>

          <div
            className="rounded-2xl bg-emerald-50/70 px-4 py-3 mt-4 mb-5 text-sm text-emerald-800 leading-6"
            style={{ boxShadow: "inset 0 0 0 1px rgb(16 185 129 / 0.18)" }}
          >
            請於 <strong className="tabular-nums">4 月 10 日</strong> 前回覆 🎁
          </div>

          <form onSubmit={handleRsvpSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-2">
                我是小秧秧的…
              </label>
              <input
                type="text"
                value={rsvpName}
                onChange={(e) => setRsvpName(e.target.value)}
                placeholder="例如：姑姑、阿公阿嬤、表哥…"
                className="w-full px-4 py-3.5 rounded-2xl bg-white text-neutral-900 text-[15px]
                           outline-none transition-all
                           focus:shadow-[inset_0_0_0_1.5px_rgb(236_72_153_/_0.5)]"
                style={{ boxShadow: insetRing }}
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-2">
                參加人數
              </label>
              <input
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                value={rsvpCount}
                onChange={(e) => setRsvpCount(e.target.value)}
                className="w-28 px-4 py-3.5 rounded-2xl bg-white text-neutral-900 text-[15px] tabular-nums
                           outline-none transition-all
                           focus:shadow-[inset_0_0_0_1.5px_rgb(236_72_153_/_0.5)]"
                style={{ boxShadow: insetRing }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full rounded-2xl py-4 text-base font-semibold text-white tracking-tight
                         transition-all active:scale-[0.98]
                         ${submitting ? "bg-pink-300 cursor-not-allowed" : "bg-gradient-to-r from-pink-500 to-amber-500 hover:shadow-lg"}`}
              style={
                submitting
                  ? undefined
                  : { boxShadow: "0 8px 20px -6px rgb(236 72 153 / 0.45)" }
              }
            >
              {submitting ? "送出中…" : "🎉 確認參加"}
            </button>
          </form>
        </section>

        {/* 參加者名單 */}
        <section
          className="rounded-3xl bg-white/90 backdrop-blur-sm p-5"
          style={{ boxShadow: cardRing }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-mono uppercase tracking-[0.18em] text-[11px] text-pink-700/70 mb-1">
                參加名單
              </p>
              <h2 className="text-2xl font-bold tracking-tight">
                <span className="text-neutral-900">🎊 已報名 </span>
                <span className="text-neutral-500 text-sm font-medium">即時更新</span>
              </h2>
            </div>
            <button
              onClick={fetchRsvp}
              aria-label="重新整理"
              className="shrink-0 rounded-full w-10 h-10 flex items-center justify-center text-base bg-white active:scale-95 transition-all"
              style={{ boxShadow: insetRing }}
            >
              🔄
            </button>
          </div>

          {loadingList ? (
            <p className="text-center text-neutral-400 text-sm py-6">載入中…</p>
          ) : (
            <>
              <div
                className="rounded-2xl bg-neutral-950/[0.025] px-5 py-4 mb-4 flex items-baseline gap-3"
                style={{ boxShadow: "inset 0 0 0 1px rgb(3 7 18 / 0.06)" }}
              >
                <span className="text-5xl font-bold tracking-tight text-pink-700 tabular-nums leading-none">
                  {totalAttendees}
                </span>
                <span className="text-neutral-600 text-sm">人即將參加 🎉</span>
              </div>

              {rsvpList.length === 0 ? (
                <p className="text-center text-neutral-500 text-sm py-4">
                  還沒有人回覆，快來第一個報名吧！ 🌸
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {rsvpList.map((item) => (
                    <span
                      key={item.name}
                      className="inline-flex items-center gap-1.5 rounded-full bg-pink-50 px-3 py-1.5 text-sm text-pink-700"
                      style={{ boxShadow: "inset 0 0 0 1px rgb(236 72 153 / 0.18)" }}
                    >
                      <span className="font-medium tracking-tight">{item.name}</span>
                      <span className="text-xs font-mono tabular-nums text-pink-500/80">× {item.num_attendees}</span>
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {/* 成長紀錄 */}
        <section>
          <div className="px-1 mb-4 mt-4">
            <p className="font-mono uppercase tracking-[0.18em] text-[11px] text-pink-700/70 mb-1">
              成長紀錄
            </p>
            <h2 className="text-2xl font-bold tracking-tight">
              <span className="text-neutral-900">📸 秧予成長紀錄 </span>
              <span className="text-neutral-500 text-sm font-medium">一起看看我們可愛的小寶貝</span>
            </h2>
          </div>

          <div className="mb-5">
            <VideoCarousel />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-950/[0.025] p-1.5"
                style={{
                  boxShadow:
                    "0 0 0 1px rgb(3 7 18 / 0.06), 0 1px 2px rgb(3 7 18 / 0.04), 0 8px 24px -8px rgb(236 72 153 / 0.18)",
                }}
              >
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  {aiImages[index] ? (
                    <img
                      src={aiImages[index]}
                      alt={`秧予 AI 重繪 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={photo}
                      alt={`秧予照片 ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 50vw, 200px"
                      className="object-cover"
                      placeholder="blur"
                    />
                  )}
                </div>

                <button
                  onClick={() => handleAiRedraw(index)}
                  disabled={aiLoading[index]}
                  className={`absolute bottom-3 right-3 rounded-full px-3 py-1 text-[11px] font-semibold
                             tracking-tight transition-all z-10
                             ${aiLoading[index]
                               ? "bg-white/90 text-purple-500 cursor-not-allowed"
                               : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-md"}`}
                  style={{ boxShadow: "0 2px 8px rgb(0 0 0 / 0.15)" }}
                >
                  {aiLoading[index] ? "生成中…" : "AI 重繪"}
                </button>

                {aiImages[index] && (
                  <button
                    onClick={() =>
                      setAiImages((prev) => {
                        const n = { ...prev };
                        delete n[index];
                        return n;
                      })
                    }
                    className="absolute bottom-3 left-3 rounded-full px-3 py-1 text-[11px] font-semibold
                               tracking-tight bg-white/90 text-neutral-700 hover:bg-white transition-all z-10"
                    style={{ boxShadow: "0 2px 8px rgb(0 0 0 / 0.15)" }}
                  >
                    還原
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 頁尾 */}
        <div className="pt-6 text-center">
          <p className="font-mono uppercase tracking-[0.18em] text-[11px] text-pink-700/70">
            💗 2026·04·18 敬候光臨
          </p>
          <p className="text-neutral-500 text-xs mt-2">期待與您共同慶祝秧予一歲生日</p>
        </div>
      </div>

      {/* 手機浮動 RSVP 按鈕 */}
      <button
        onClick={scrollToRsvp}
        className="fixed bottom-5 right-5 z-40 rounded-full px-5 py-3 text-sm font-semibold text-white
                   bg-gradient-to-r from-pink-500 to-amber-500 active:scale-95 transition-all sm:hidden"
        style={{ boxShadow: "0 10px 30px -8px rgb(236 72 153 / 0.55), 0 0 0 1px rgb(255 255 255 / 0.2)" }}
      >
        💌 回覆出席
      </button>
    </main>
  );
}

function InfoRow({ icon, label, value, hint }) {
  return (
    <div
      className="flex items-start gap-3 rounded-2xl bg-neutral-950/[0.02] px-4 py-3"
      style={{ boxShadow: "inset 0 0 0 1px rgb(3 7 18 / 0.05)" }}
    >
      <span className="text-lg shrink-0 leading-7">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-0.5">
          {label}
        </p>
        <div className="text-[15px] text-neutral-800 leading-7">{value}</div>
        {hint && <p className="text-xs text-neutral-400 mt-0.5">（{hint}）</p>}
      </div>
    </div>
  );
}
