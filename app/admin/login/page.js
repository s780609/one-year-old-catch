"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.success) {
        const redirect = searchParams.get("redirect") || "/test-neondb";
        router.push(redirect);
      } else {
        setError(data.error || "密碼錯誤");
        setPassword("");
      }
    } catch (err) {
      setError("登入失敗: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const cardShadow =
    "0 0 0 1px rgb(255 255 255 / 0.06), 0 1px 2px rgb(0 0 0 / 0.4), 0 12px 40px -12px rgb(0 0 0 / 0.5)";
  const insetRing = "inset 0 0 0 1px rgb(255 255 255 / 0.08)";

  return (
    <div className="w-full max-w-sm">
      {/* eyebrow label */}
      <p className="font-mono uppercase tracking-[0.18em] text-[11px] text-white/40 text-center mb-4">
        管理員登入
      </p>

      <div
        className="rounded-3xl bg-neutral-900/80 backdrop-blur-sm p-8"
        style={{ boxShadow: cardShadow }}
      >
        <div className="mb-7">
          <h1 className="text-2xl font-bold tracking-tight text-white text-center mb-1.5">
            🔒 管理面板
          </h1>
          <p className="text-white/45 text-xs text-center">請輸入密碼以繼續</p>
        </div>

        {error && (
          <div
            className="mb-4 rounded-xl bg-red-500/10 px-4 py-3 text-red-300 text-xs text-center leading-6"
            style={{ boxShadow: "inset 0 0 0 1px rgb(239 68 68 / 0.25)" }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="輸入密碼…"
            autoFocus
            required
            className="w-full px-4 py-3 rounded-xl bg-white/5 text-white text-sm
                       placeholder:text-white/30 outline-none transition-all
                       focus:bg-white/[0.08]
                       focus:shadow-[inset_0_0_0_1.5px_rgb(59_130_246_/_0.55)]"
            style={{ boxShadow: insetRing }}
          />
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-full px-6 py-2.5 text-sm font-semibold text-white tracking-tight
                       bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-white/30
                       disabled:cursor-not-allowed transition-all"
            style={
              loading || !password
                ? { boxShadow: insetRing }
                : { boxShadow: "0 4px 14px -4px rgb(59 130 246 / 0.5)" }
            }
          >
            {loading ? "驗證中…" : "登入"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 antialiased"
      style={{
        background:
          "radial-gradient(ellipse at top, rgb(30 41 59), rgb(3 7 18) 60%)",
      }}
    >
      <Suspense fallback={<div className="text-white/40 text-sm">載入中…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
