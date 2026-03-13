# 🎂 抓周猜猜看

寶寶週歲抓周派對的互動投票網站！讓親朋好友猜猜寶寶會抓到什麼，投票結束後即時公布排行榜。  
支援多屆抓周紀錄，每個寶寶獨立配色與照片。

## 👶 抓周紀錄

| 屆次 | 寶寶 | 日期 | 狀態 |
|------|------|------|------|
| 第一屆 | 欣予 | 2024/8/10 | ✅ 已完成 |
| 第二屆 | 秧予 | TBD | 🔜 準備中 |

## ✨ 功能

- **投票系統** — 選擇身份後，每人可投 3 票猜測寶寶會抓哪個物品
- **投票鎖** — 防止快速連點造成的 race condition，投票中全域鎖定
- **照片輪播** — 首頁展示寶寶照片自動輪播牆
- **倒數過場** — 投完 3 票後有 5 秒倒數動畫，過場到結果頁
- **即時排行榜** — 深色風格結果頁，前三名 Podium 展示，每 5 秒自動更新
- **抓周歷史紀錄** — 支援多屆抓周，寶寶實際抓的結果 + 投票排行榜 TOP 5 + 完整投票明細
- **管理面板** — 密碼保護的後台，可查看/管理資料庫，一鍵清除投票重置

## 🛠 技術

| 項目 | 技術 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| 前端 | React 18 + Tailwind CSS |
| 資料庫 | Neon PostgreSQL (Serverless) |
| 部署 | Vercel |
| 通知 | react-hot-toast |
| 圖片處理 | sharp (批次壓縮/旋轉) |

## 📁 專案結構

```
app/
├── page.js              # 首頁（投票入口）
├── renderSelectors.js   # 投票邏輯元件（含照片輪播）
├── result/page.js       # 即時排行榜
├── chosenresult/page.js # 抓周歷史紀錄（多屆切換）
├── admin/login/page.js  # 管理登入
├── test-neondb/page.js  # DB 管理面板
├── components/          # UI 元件
├── assets/              # 物品圖片
│   ├── 欣予/            # 欣予的照片
│   └── 秧予/            # 秧予的照片
└── api/
    ├── route.js         # GET 排行榜
    ├── vote/route.js    # POST 投票 / DELETE 取消 / 重置
    ├── init-db/route.js # 初始化資料表
    └── test-neondb/     # CRUD API
scripts/
└── compress-images.mjs  # 圖片批次壓縮腳本
```

## 🚀 開始使用

```bash
# 安裝依賴
npm install

# 設定環境變數（建立 .env.local）
DATABASE_URL=你的_Neon_PostgreSQL_連線字串
ADMIN_PASSWORD=管理面板密碼

# 啟動開發伺服器
npm run dev

# 初始化資料庫（首次使用）
# 瀏覽器打開 http://localhost:3000/api/init-db
```

## 📦 部署

推送到 GitHub 後，在 Vercel 連結 repo 即自動部署。記得在 Vercel Dashboard 設定環境變數 `DATABASE_URL` 和 `ADMIN_PASSWORD`。
