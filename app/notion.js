import { Client } from "@notionhq/client";

export default async function Notion() {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const pages = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  });

  console.log("pages", pages.results[1]);

//   console.log("pages.results[0].properties ===> ", pages.results[0].properties);

//   console.log(
//     "pages.results[0].properties.Name ===> ",
//     pages.results[0].properties.Name
//   );

//   console.log(
//     "pages.results[0].properties.Count ===> ",
//     pages.results[0].properties.Count
//   );

  return <>notion database</>;
}
