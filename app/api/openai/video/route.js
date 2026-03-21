import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing environment variable: OPENAI_API_KEY");
    }

    const { prompt, images, duration, aspectRatio } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 }
      );
    }

    const body = {
      model: "grok-imagine-video",
      prompt,
    };

    if (duration) body.duration = duration;
    if (aspectRatio) body.aspect_ratio = aspectRatio;
    if (images?.length) body.image_url = images[0];

    const res = await fetch("https://api.x.ai/v1/videos/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json({ success: true, requestId: data.request_id });
  } catch (error) {
    console.error("Video generation error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
