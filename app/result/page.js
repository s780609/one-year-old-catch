import "server-only";

import { Client } from "@notionhq/client";
import RenderResultBlock from "./renderResultBlock";

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
        <RenderResultBlock pages={pages}></RenderResultBlock>
      </div>
    </>
  );
}
