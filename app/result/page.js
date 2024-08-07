import { Client } from "@notionhq/client";
import RenderResultBlock from "./renderResultBlock";

export default async function Result() {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const pages = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  });

  return (
    <>
      <div className="grid md:grid-cols-8 grid-cols-2">
        <RenderResultBlock pages={pages}></RenderResultBlock>
      </div>
    </>
  );
}
