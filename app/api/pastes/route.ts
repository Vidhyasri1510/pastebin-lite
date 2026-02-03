import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import redis from "@/lib/kv";

export async function POST(req: Request) {
  const body = await req.json();
  const { content, ttl_seconds, max_views } = body;

  if (!content) {
    return NextResponse.json({ error: "Content required" }, { status: 400 });
  }

  const id = uuidv4();

  const paste = {
    content,
    remaining_views: max_views ?? null,
    expires_at: ttl_seconds
      ? new Date(Date.now() + ttl_seconds * 1000).toISOString()
      : null,
  };

  await redis.set(`paste:${id}`, JSON.stringify(paste));

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const url = `${baseUrl}/p/${id}`;

  return NextResponse.json({ id, url });
}
