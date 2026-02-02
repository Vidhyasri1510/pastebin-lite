import { NextResponse } from "next/server";
import kv from "@/lib/kv";

function getNow(req: Request) {
  if (process.env.TEST_MODE === "1") {
    const header = req.headers.get("x-test-now-ms");
    if (header) {
      return Number(header);
    }
  }
  return Date.now();
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const raw = await kv.get(`paste:${params.id}`);

  if (!raw) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const paste = JSON.parse(raw);
  const now = getNow(req);

  // TTL check
  if (paste.expires_at && now > new Date(paste.expires_at).getTime()) {
    await kv.del(`paste:${params.id}`);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // View check
  if (paste.remaining_views !== null) {
    if (paste.remaining_views <= 0) {
      await kv.del(`paste:${params.id}`);
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    paste.remaining_views -= 1;
    await kv.set(`paste:${params.id}`, JSON.stringify(paste));
  }

  return NextResponse.json({
    content: paste.content,
    remaining_views: paste.remaining_views,
    expires_at: paste.expires_at,
  });
}
