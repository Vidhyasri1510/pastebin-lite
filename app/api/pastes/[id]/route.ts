import { NextResponse } from "next/server";
import redis from "@/lib/kv";

function getNow(req: Request) {
  if (process.env.TEST_MODE === "1") {
    const header = req.headers.get("x-test-now-ms");
    if (header) return Number(header);
  }
  return Date.now();
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const raw = await redis.get(`paste:${id}`);

  if (!raw) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const paste =
    typeof raw === "string" ? JSON.parse(raw) : raw;

  const now = getNow(req);

  if (paste.expires_at && now > new Date(paste.expires_at).getTime()) {
    await redis.del(`paste:${id}`);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (paste.remaining_views !== null) {
    if (paste.remaining_views <= 0) {
      await redis.del(`paste:${id}`);
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    paste.remaining_views -= 1;
    await redis.set(`paste:${id}`, JSON.stringify(paste));
  }

  return NextResponse.json({
    content: paste.content,
    remaining_views: paste.remaining_views,
    expires_at: paste.expires_at,
  });
}
