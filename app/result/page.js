import "server-only";

import { Client } from "@notionhq/client";
import { ResultBlock } from "../components/ResultBlock";

export default async function Result() {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const pages = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  });

  let arr = [];
  for (let i = 0; i <= 18; i++) {
    arr.push(i);
  }

  return (
    <>
      <div className="grid md:grid-cols-8 grid-cols-2">
        <ResultBlock data={pages.results[0]} title={"急救箱"}></ResultBlock>
        <ResultBlock data={pages.results[0]} title={"算盤"}></ResultBlock>
        <ResultBlock data={pages.results[0]} title={"相機"}></ResultBlock>
        <ResultBlock data={pages.results[0]} title={"金幣"}></ResultBlock>
        <ResultBlock data={pages.results[0]} title={"鎚子"}></ResultBlock>
        <ResultBlock data={pages.results[0]} title={"樂器"}></ResultBlock>
        <ResultBlock data={pages.results[0]} title={"鍵盤"}></ResultBlock>
        <ResultBlock data={pages.results[0]} title={"飛機"}></ResultBlock>
        <ResultBlock data={pages.results[0]} title={"書"}></ResultBlock>
        <ResultBlock data={pages.results[0]} title={"麥克風"}></ResultBlock>
        <ResultBlock data={pages.results[0]} title={"調色盤"}></ResultBlock>
        <ResultBlock data={pages.results[0]} title={"廚師帽"}></ResultBlock>
        <ResultBlock data={pages.results[0]} title={"手槍"}></ResultBlock>
        <ResultBlock data={pages.results[0]} title={"板手"}></ResultBlock>
        <ResultBlock data={pages.results[0]} title={"博士帽"}></ResultBlock>
        <ResultBlock data={pages.results[0]} title={"場記板"}></ResultBlock>
        <ResultBlock data={pages.results[0]} title={"黑板"}></ResultBlock>
        <ResultBlock data={pages.results[0]} title={"三角尺"}></ResultBlock>
      </div>
    </>
  );
}
