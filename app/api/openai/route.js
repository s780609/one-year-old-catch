import { NextResponse } from "next/server";
import OpenAI from "openai";

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing environment variable: OPENAI_API_KEY");
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.x.ai/v1",
  });
}

export async function POST(request) {
  try {
    const openai = getOpenAIClient();
    const { prompt, image } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 }
      );
    }

    const messages = [
      {
        role: "user",
        content: image
          ? [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: { url: image },
              },
            ]
          : prompt,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "grok-3-latest",
      messages,
    });

    const result = completion.choices[0]?.message?.content ?? "";

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
