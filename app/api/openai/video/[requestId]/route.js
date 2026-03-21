import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing environment variable: OPENAI_API_KEY");
    }

    const { requestId } = await params;

    const res = await fetch(`https://api.x.ai/v1/videos/${requestId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json({
      success: true,
      status: data.status,
      videoUrl: data.video?.url || null,
      duration: data.video?.duration || null,
    });
  } catch (error) {
    console.error("Video status error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
