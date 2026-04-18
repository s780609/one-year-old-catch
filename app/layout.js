import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  metadataBase: new URL("https://one-year-old-catch.vercel.app"),
  title: "🎂 猜猜秧予抓什麼",
  description: "猜猜秧予抓什麼 — 猜猜寶寶會選什麼？",
  openGraph: {
    title: "🎂 猜猜秧予抓什麼",
    description: "猜猜秧予抓什麼 — 猜猜寶寶會選什麼？",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "猜猜秧予抓什麼",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body className="antialiased font-sans text-neutral-900">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
