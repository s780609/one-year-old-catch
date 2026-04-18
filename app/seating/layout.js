export const metadata = {
  metadataBase: new URL("https://one-year-old-catch.vercel.app"),
  title: "🪑 秧予周歲宴 · 座位表",
  description: "秧予周歲宴座位表，快來找找你的位置吧！",
  openGraph: {
    title: "🪑 秧予周歲宴 · 座位表",
    description: "秧予周歲宴座位表，快來找找你的位置吧！",
    url: "https://one-year-old-catch.vercel.app/seating",
    images: [
      {
        url: "/og-seating.jpg",
        width: 1200,
        height: 630,
        alt: "秧予周歲宴座位表",
      },
    ],
    type: "website",
  },
};

export default function SeatingLayout({ children }) {
  return children;
}
