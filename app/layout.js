import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://one-year-old-catch.vercel.app"),
  title: "🎂 秧予抓周猜猜看",
  description: "秧予抓周猜猜看 — 猜猜寶寶會選什麼？",
  openGraph: {
    title: "🎂 秧予抓周猜猜看",
    description: "秧予抓周猜猜看 — 猜猜寶寶會選什麼？",
    images: [
      {
        url: "/秧予動畫風照片.jpg",
        width: 1200,
        height: 630,
        alt: "秧予抓周猜猜看",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">{children}</body>
    </html>
  );
}
