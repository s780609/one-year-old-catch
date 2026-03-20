import { neon } from "@neondatabase/serverless";

// 使用 Vercel 自動注入的環境變數 DATABASE_URL
// 在 Vercel Dashboard > Storage > Neon 可以看到連線字串
const sql = neon(process.env.DATABASE_URL, {
  fetchOptions: { cache: "no-store" },
});

export default sql;
