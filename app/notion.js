import { Client } from "@notionhq/client";

export default async function Notion() {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const pages = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  });

  // console.log(
  //   "AAAA ===> ",
  //   pages.results[1].properties.Name.title[0].plain_text
  // );

  // console.log(
  //   "BBBB ===> ",
  //   pages.results[1].properties.Frame.rich_text[0].plain_text
  // );

  // console.log(
  //   "pages.results[0].properties.Name ===> ",
  //   pages.results[1].properties.Name
  // );

  // console.log(
  //   "pages.results[0].properties.Count ===> ",
  //   pages.results[1].properties.Count
  // );

  return <>notion database: {pages.results[1].properties.Count.number}</>;
}
