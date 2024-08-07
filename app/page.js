import { Client } from "@notionhq/client";

import RenderSelectors from "./renderSelectors";

export default async function Home() {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const pages = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  });

  const items = [
    "手槍",
    "三角尺",
    "黑板",
    "鎚子",
    "書",
    "鍵盤",
    "金幣",
    "麥克風",
    "算盤",
    "板手",
    "場記板",
    "博士帽",
    "急救箱",
    "廚師帽",
    "樂器",
    "飛機",
    "相機",
    "調色盤",
    "特斯拉",
  ];

  return (
    <main className="h-screen">
      <RenderSelectors items={items} pages={pages}></RenderSelectors>
    </main>
  );
}
