import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

export async function GET(request) {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const pages = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  });

  return NextResponse.json(pages, { status: 200 });
}

export async function PATCH(request) {
  const requestBody = await request.json();

  if (!requestBody) {
    return NextResponse.json({ message: "request is null" }, { status: 400 });
  }

  if (!requestBody.pageId) {
    return NextResponse.json({ message: "pageId is null" }, { status: 400 });
  }

  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const pages = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  });

  let plainText =
    pages.results[0].properties[requestBody.propName].rich_text[0]?.plain_text;

  if (plainText) {
    plainText += "," + requestBody.text;
  } else {
    plainText = requestBody.text;
  }

  const page = await notion.pages.update({
    page_id: requestBody.pageId,
    properties: {
      [requestBody.propName]: {
        type: "rich_text",
        rich_text: [
          {
            type: "text",
            text: {
              content: plainText,
            },
          },
        ],
      },
    },
  });

  return NextResponse.json({ result: page }, { status: 200 });
}
