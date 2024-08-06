import "server-only";

import { Client } from "@notionhq/client";

export async function ResultBlock({ index }) {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const pages = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  });

  let title = "NO TITLE";
  let result = "NO results";

  if (pages.results[index] && pages.results[index].properties.Name.title[0]) {
    //console.log(`ResultBlock${index} ===> `, pages.results[index].properties);

    title = pages.results[index].properties.Name.title[0]?.plain_text;
    result = pages.results[index].properties.Frame.rich_text[0]?.plain_text;
  }

  return (
    <>
      <div className="w-full px-2 py-2 my-5">
        <div className="text-center text-xl">{title}</div>
        <div className="w-full border-2 h-60">{result}</div>
      </div>
    </>
  );
}
