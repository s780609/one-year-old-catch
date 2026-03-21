import { NextResponse } from "next/server";

// 提高 body size 上限，base64 圖片很大
export const maxDuration = 60;

export async function POST(request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing environment variable: OPENAI_API_KEY");
    }

    const { prompt, images, aspectRatio } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 }
      );
    }

    const body = {
      model: "grok-imagine-image",
      prompt,
      n: 1,
      response_format: "url",
    };

    if (aspectRatio) body.aspect_ratio = aspectRatio;

    // xAI 格式：image 欄位接受陣列，每個元素 { url, type }
    if (images?.length) {
      body.image = images.map((img) => ({
        url: img,
        type: "image_url",
      }));
    }

    const res = await fetch("https://api.x.ai/v1/images/generations", {
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
    console.error("Image generation error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
