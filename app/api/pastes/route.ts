import { NextResponse } from "next/server";
import kv from "@/lib/kv";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, ttl_seconds, max_views } = body;

    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    if (ttl_seconds !== undefined) {
      if (!Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
        return NextResponse.json(
          { error: "ttl_seconds must be integer ≥ 1" },
          { status: 400 }
        );
      }
    }

    if (max_views !== undefined) {
      if (!Number.isInteger(max_views) || max_views < 1) {
        return NextResponse.json(
          { error: "max_views must be integer ≥ 1" },
          { status: 400 }
        );
      }
    }

    const id = randomUUID();
    const now = Date.now();

    const expires_at = ttl_seconds
      ? new Date(now + ttl_seconds * 1000).toISOString()
      : null;

    const paste = {
      content,
      remaining_views: max_views ?? null,
      expires_at,
    };

    await kv.set(`paste:${id}`, JSON.stringify(paste));

    return NextResponse.json({
      id,
      url: `/p/${id}`,
    });

  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }
}
