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

  return (
    <div className="w-full max-w-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center text-gray-100 mb-2">
          🔒 管理面板
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          請輸入密碼以繼續
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 text-red-300 border border-red-700 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="輸入密碼..."
            autoFocus
            required
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg
                       text-gray-100 placeholder-gray-500
                       focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                       mb-4"
          />
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700
                       disabled:text-gray-500 text-white rounded-lg font-medium
                       transition-colors"
          >
            {loading ? "驗證中..." : "登入"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-gray-500">載入中...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
