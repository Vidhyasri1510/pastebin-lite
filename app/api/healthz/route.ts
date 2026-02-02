import { NextResponse } from "next/server";
import kv from "@/lib/kv";

export async function GET() {
  try {
    await kv.set("healthcheck", "ok");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
