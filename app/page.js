import RenderSelectors from "./renderSelectors";

export default async function Home() {
  const items = [
    "手槍",
    "三角尺",
    "黑板",
    "鎚子",
    "書",
    "鍵盤",
    "阿公阿嬤的禮物",
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
    "Vtuber",
  ];

  return (
    <main className="min-h-screen">
      <RenderSelectors items={items}></RenderSelectors>
    </main>
  );
}
