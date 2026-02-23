import "./globals.css";

export const metadata = {
  title: "🎂 欣予抓周猜猜看",
  description: "欣予抓周猜猜看 — 猜猜寶寶會選什麼？",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">{children}</body>
    </html>
  );
}
