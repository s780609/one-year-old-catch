import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

// To handle a GET request to /api
export async function GET(request) {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const pages = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  });

  // Do whatever you want
  return NextResponse.json({ message: pages }, { status: 200 });
}

// To handle a POST request to /api
export async function POST(request) {
  // Do whatever you want
  return NextResponse.json({ message: "Hello World" }, { status: 200 });
}

// To handle a PATCH request to /api
export async function PATCH(request) {
  const requestBody = await request.json();

  if (!requestBody) {
    return NextResponse.json({ message: "request is null" }, { status: 400 });
  }

  if (!requestBody.pageId) {
    return NextResponse.json({ message: "pageId is null" }, { status: 400 });
  }

  const notion = new Client({ auth: process.env.NOTION_TOKEN });

  if (requestBody.propName === "手槍") {
    const page = await notion.pages.update({
      page_id: requestBody.pageId,
      properties: {
        手槍: {
          type: "rich_text",
          rich_text: [
            {
              type: "text",
              text: {
                content: requestBody.text,
              },
            },
          ],
        },
      },
    });

    return NextResponse.json({ result: page }, { status: 200 });
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
              content: requestBody.text,
            },
          },
        ],
      },
    },
  });

  return NextResponse.json({ result: page }, { status: 200 });
}
