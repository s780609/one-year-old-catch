"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";

import photo1 from "../assets/秧予/秧予_IMG_0999.jpg";
import photo2 from "../assets/秧予/秧予_IMG_1499.jpeg";
import photo3 from "../assets/秧予/秧予_IMG_1799.jpeg";
import photo4 from "../assets/秧予/秧予_IMG_1885.jpeg";
import photo5 from "../assets/秧予/秧予_IMG_1928.jpeg";
import photo6 from "../assets/秧予/秧予_IMG_1937.jpeg";
import photo7 from "../assets/秧予/秧予_IMG_1966.jpeg";
import photo8 from "../assets/秧予/秧予_IMG_2032.jpeg";
import photo9 from "../assets/秧予/秧予_IMG_2034.jpeg";
import photo10 from "../assets/秧予/秧予_IMG_2047.jpeg";

const photos = [photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8, photo9, photo10];

export default function InvitationPage() {
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpCount, setRsvpCount] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [rsvpList, setRsvpList] = useState([]);
  const [totalAttendees, setTotalAttendees] = useState(0);
  const [loadingList, setLoadingList] = useState(true);

  const fetchRsvp = useCallback(async () => {
    try {
      const res = await fetch("/api/rsvp");
      const json = await res.json();
      if (json.success) {
        setRsvpList(json.data);
        setTotalAttendees(json.totalAttendees);
      }
    } catch {
      // 靜默處理
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
    setSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: rsvpName.trim(), num_attendees: rsvpCount }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("已成功回覆！期待見到您 💗");
        setRsvpName("");
        setRsvpCount(1);
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
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fff0f6 0%, #ffe4f0 40%, #fce7f3 70%, #fff9fb 100%)",
        fontFamily: "'Noto Serif TC', 'serif'",
      }}
    >
      <Toaster position="top-center" />
      {/* 裝飾花邊頂部 */}
      <div
        style={{
          background: "linear-gradient(90deg, #f9a8d4, #fbbf24, #f9a8d4)",
          height: "6px",
        }}
      />

      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          padding: "48px 24px 64px",
        }}
      >
        {/* 標題區 */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎀👶🎂</div>
          <h1
            style={{
              fontSize: "clamp(26px, 6vw, 36px)",
              fontWeight: "900",
              color: "#be185d",
              letterSpacing: "0.05em",
              lineHeight: "1.4",
              textShadow: "0 2px 8px rgba(190,24,93,0.15)",
              marginBottom: "8px",
            }}
          >
            小秧秧一歲囉！
          </h1>
          <p
            style={{
              fontSize: "clamp(18px, 4vw, 22px)",
              color: "#db2777",
              fontWeight: "700",
              letterSpacing: "0.08em",
            }}
          >
            抓周派對來啦～ 🎉
          </p>
        </div>

        {/* 邀請卡主體 */}
        <div
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(8px)",
            borderRadius: "24px",
            padding: "clamp(24px, 6vw, 48px)",
            boxShadow: "0 8px 40px rgba(236,72,153,0.15), 0 2px 8px rgba(0,0,0,0.06)",
            border: "1.5px solid rgba(249,168,212,0.5)",
            marginBottom: "40px",
          }}
        >
          {/* 開場白 */}
          <p
            style={{
              textAlign: "center",
              fontSize: "clamp(15px, 3.5vw, 18px)",
              color: "#6b21a8",
              lineHeight: "1.9",
              marginBottom: "28px",
              fontWeight: "500",
            }}
          >
            誠摯邀請您和家人一起來同樂♡
          </p>

          {/* 寶貝介紹 */}
          <div
            style={{
              background: "linear-gradient(135deg, #fdf2f8, #fce7f3)",
              borderRadius: "16px",
              padding: "20px 24px",
              textAlign: "center",
              marginBottom: "28px",
              border: "1px solid rgba(249,168,212,0.4)",
            }}
          >
            <p style={{ color: "#9d174d", fontSize: "clamp(14px, 3vw, 16px)", lineHeight: "2", margin: 0 }}>
              轉眼間，我們的小寶貝
              <br />
              <span
                style={{
                  fontSize: "clamp(20px, 5vw, 26px)",
                  fontWeight: "900",
                  color: "#be185d",
                  display: "block",
                  margin: "6px 0",
                  letterSpacing: "0.1em",
                }}
              >
                許秧予（女）
              </span>
              已經要滿一歲生日了！
              <br />
              <span style={{ color: "#a855f7", fontSize: "clamp(13px, 2.8vw, 15px)" }}>
                🎂 西曆 2025年5月7日（農曆乙巳年四月初十）
              </span>
            </p>
          </div>

          {/* 活動說明 */}
          <p
            style={{
              color: "#7c3aed",
              fontSize: "clamp(14px, 3vw, 16px)",
              lineHeight: "1.9",
              textAlign: "center",
              marginBottom: "28px",
            }}
          >
            這次我們準備了經典的抓周儀式
            <br />
            也安排了好吃的點心、輕鬆遊戲和拍照打卡 📸
            <br />
            希望能和最親愛的你們，
            <br />
            一起記錄秧予人生第一個大里程碑～ 🌟
          </p>

          {/* 活動詳情 */}
          <div
            style={{
              background: "linear-gradient(135deg, #fff7ed, #fef3c7)",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "28px",
              border: "1px solid rgba(251,191,36,0.4)",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                fontSize: "clamp(16px, 3.5vw, 20px)",
                fontWeight: "800",
                color: "#92400e",
                marginBottom: "16px",
                letterSpacing: "0.1em",
              }}
            >
              ✨ 活動詳情 ✨
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                fontSize: "clamp(14px, 3vw, 16px)",
                color: "#78350f",
                lineHeight: "1.7",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span>📅</span>
                <span>
                  <strong>日期：</strong>2026年4月18日（六）
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span>🕑</span>
                <span>
                  <strong>時間：</strong>下午 2:00 開始
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span>📍</span>
                <span>
                  <strong>地點：</strong>新北市五股區成泰路二段91巷15-3號14樓
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span>👗</span>
                <span>
                  <strong>服裝建議：</strong>輕鬆休閒即可
                  <br />
                  <span style={{ fontSize: "0.88em", color: "#a16207" }}>（有電梯，方便推車或長輩）</span>
                </span>
              </div>
            </div>
          </div>

          {/* 結尾祝詞 */}
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                color: "#7c3aed",
                fontSize: "clamp(14px, 3vw, 16px)",
                lineHeight: "2",
                marginBottom: "12px",
              }}
            >
              謝謝你們一直以來的疼愛與陪伴
              <br />
              真的很期待在派對上看到你們！
            </p>
            <p
              style={{
                fontSize: "clamp(16px, 4vw, 20px)",
                fontWeight: "800",
                color: "#be185d",
                letterSpacing: "0.08em",
              }}
            >
              愛你們的 秧予爸媽 敬上 💗
            </p>
          </div>
        </div>

        {/* RSVP 回覆表單 */}
        <div
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(8px)",
            borderRadius: "24px",
            padding: "clamp(24px, 6vw, 40px)",
            boxShadow: "0 8px 40px rgba(236,72,153,0.15), 0 2px 8px rgba(0,0,0,0.06)",
            border: "1.5px solid rgba(249,168,212,0.5)",
            marginBottom: "40px",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              fontSize: "clamp(18px, 4.5vw, 24px)",
              fontWeight: "900",
              color: "#be185d",
              letterSpacing: "0.08em",
              marginBottom: "24px",
            }}
          >
            💌 線上回覆出席
          </h2>
          {/* 回覆提醒 */}
          <div
            style={{
              background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
              borderRadius: "16px",
              padding: "20px 24px",
              marginBottom: "28px",
              border: "1px solid rgba(74,222,128,0.35)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "#166534",
                fontSize: "clamp(14px, 3vw, 16px)",
                lineHeight: "2",
                margin: 0,
              }}
            >
              麻煩大家在 <strong>4月10日</strong> 前回覆是否參加，
              <br />
              讓我們可以準備適合的座位和小驚喜喔～ 🎁
              <br />
              <span style={{ color: "#15803d", fontWeight: "600" }}>
                回覆方式：Line / 電話 / 私訊 都 OK！
              </span>
            </p>
          </div>
          <form onSubmit={handleRsvpSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "clamp(14px, 3vw, 16px)",
                  fontWeight: "700",
                  color: "#9d174d",
                  marginBottom: "8px",
                }}
              >
                我是小秧秧的…
              </label>
              <input
                type="text"
                value={rsvpName}
                onChange={(e) => setRsvpName(e.target.value)}
                placeholder="例如：姑姑、阿公阿嬤、表哥…"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1.5px solid rgba(249,168,212,0.7)",
                  fontSize: "clamp(14px, 3vw, 16px)",
                  color: "#4a1942",
                  background: "#fff9fb",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "clamp(14px, 3vw, 16px)",
                  fontWeight: "700",
                  color: "#9d174d",
                  marginBottom: "8px",
                }}
              >
                參加人數
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={rsvpCount}
                onChange={(e) => setRsvpCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                style={{
                  width: "120px",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1.5px solid rgba(249,168,212,0.7)",
                  fontSize: "clamp(14px, 3vw, 16px)",
                  color: "#4a1942",
                  background: "#fff9fb",
                  outline: "none",
                }}
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: submitting
                    ? "#f9a8d4"
                    : "linear-gradient(135deg, #ec4899, #f59e0b)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "14px",
                  padding: "14px 36px",
                  fontSize: "clamp(15px, 3.5vw, 18px)",
                  fontWeight: "800",
                  letterSpacing: "0.08em",
                  cursor: submitting ? "not-allowed" : "pointer",
                  boxShadow: submitting ? "none" : "0 4px 16px rgba(236,72,153,0.35)",
                  transition: "all 0.2s",
                }}
              >
                {submitting ? "送出中…" : "🎉 確認參加"}
              </button>
            </div>
          </form>
        </div>

        {/* 參加者列表 */}
        <div
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(8px)",
            borderRadius: "24px",
            padding: "clamp(24px, 6vw, 40px)",
            boxShadow: "0 8px 40px rgba(236,72,153,0.15), 0 2px 8px rgba(0,0,0,0.06)",
            border: "1.5px solid rgba(249,168,212,0.5)",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(18px, 4.5vw, 24px)",
                fontWeight: "900",
                color: "#be185d",
                letterSpacing: "0.08em",
                margin: 0,
              }}
            >
              🎊 參加者名單
            </h2>
            <button
              onClick={fetchRsvp}
              style={{
                background: "linear-gradient(135deg, #fce7f3, #fef3c7)",
                border: "1.5px solid rgba(249,168,212,0.6)",
                borderRadius: "10px",
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: "700",
                color: "#9d174d",
                cursor: "pointer",
              }}
            >
              🔄 重新整理
            </button>
          </div>

          {loadingList ? (
            <p style={{ textAlign: "center", color: "#db2777", fontSize: "15px" }}>載入中…</p>
          ) : (
            <>
              <div
                style={{
                  background: "linear-gradient(135deg, #fdf2f8, #fce7f3)",
                  borderRadius: "14px",
                  padding: "16px 20px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: "1px solid rgba(249,168,212,0.4)",
                }}
              >
                <p
                  style={{
                    fontSize: "clamp(16px, 4vw, 20px)",
                    fontWeight: "800",
                    color: "#be185d",
                    margin: 0,
                  }}
                >
                  目前共有{" "}
                  <span style={{ fontSize: "1.3em", color: "#db2777" }}>{totalAttendees}</span>{" "}
                  人要參加！🎉
                </p>
              </div>

              {rsvpList.length === 0 ? (
                <p style={{ textAlign: "center", color: "#a855f7", fontSize: "15px" }}>
                  還沒有人回覆，快來第一個報名吧！ 🌸
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {rsvpList.map((item) => (
                    <div
                      key={item.name}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 18px",
                        background: "#fff9fb",
                        borderRadius: "12px",
                        border: "1px solid rgba(249,168,212,0.35)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "clamp(14px, 3vw, 16px)",
                          fontWeight: "700",
                          color: "#7c3aed",
                        }}
                      >
                        {item.name}
                      </span>
                      <span
                        style={{
                          fontSize: "clamp(13px, 2.8vw, 15px)",
                          color: "#be185d",
                          fontWeight: "600",
                        }}
                      >
                        {item.num_attendees} 人
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* 照片牆標題 */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h2
            style={{
              fontSize: "clamp(20px, 5vw, 26px)",
              fontWeight: "900",
              color: "#be185d",
              letterSpacing: "0.08em",
            }}
          >
            📸 秧予成長紀錄
          </h2>
          <p style={{ color: "#db2777", fontSize: "14px", marginTop: "6px" }}>
            一起看看我們可愛的小寶貝 💕
          </p>
        </div>

        {/* 照片格網 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          {photos.map((photo, index) => (
            <div
              key={index}
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(236,72,153,0.18), 0 1px 4px rgba(0,0,0,0.08)",
                border: "2px solid rgba(249,168,212,0.5)",
                aspectRatio: "1 / 1",
                position: "relative",
                background: "#fce7f3",
              }}
            >
              <Image
                src={photo}
                alt={`秧予照片 ${index + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
                style={{ objectFit: "cover" }}
                placeholder="blur"
              />
            </div>
          ))}
        </div>

        {/* 底部裝飾 */}
        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>🎀🌸🎂🌸🎀</div>
          <p
            style={{
              color: "#db2777",
              fontSize: "14px",
              opacity: 0.7,
              letterSpacing: "0.1em",
            }}
          >
            期待與您共同慶祝秧予一歲生日 💗
          </p>
        </div>
      </div>

      {/* 裝飾花邊底部 */}
      <div
        style={{
          background: "linear-gradient(90deg, #f9a8d4, #fbbf24, #f9a8d4)",
          height: "6px",
        }}
      />
    </main>
  );
}
