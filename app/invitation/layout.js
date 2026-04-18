export const metadata = {
  metadataBase: new URL("https://one-year-old-catch.vercel.app"),
  title: "🎀 秧予一歲抓周派對邀請函",
  description: "誠摯邀請您和家人一起來同樂♡ 秧予一歲生日抓周派對",
  openGraph: {
    title: "🎀 秧予一歲抓周派對邀請函",
    description: "誠摯邀請您和家人一起來同樂♡ 秧予一歲生日抓周派對",
    url: "https://one-year-old-catch.vercel.app/invitation",
    images: [
      {
        url: "/og-invitation.jpg",
        width: 1200,
        height: 630,
        alt: "秧予一歲抓周派對邀請函",
      },
    ],
    type: "website",
  },
};

export default function InvitationLayout({ children }) {
  return children;
}
