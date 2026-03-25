import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing environment variable: OPENAI_API_KEY");
    }

    const { prompt, image } = await request.json();

    if (!prompt || !image) {
      return NextResponse.json(
        { success: false, error: "prompt and image are required" },
        { status: 400 }
      );
    }

    const body = {
      model: "grok-imagine-image",
      prompt,
      image: {
        url: image,
        type: "image_url",
      },
      n: 1,
      response_format: "url",
    };

    const res = await fetch("https://api.x.ai/v1/images/edits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const msg =
        errData.error?.message ||
        errData.error ||
        JSON.stringify(errData) ||
        `HTTP ${res.status}`;
      throw new Error(msg);
    }

    const data = await res.json();
    const imageUrl = data.data?.[0]?.url || data.data?.[0]?.b64_json;

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error("Image edit error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
