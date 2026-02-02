import kv from "@/lib/kv";
import { notFound } from "next/navigation";

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const raw = await kv.get(`paste:${id}`);

  if (!raw) {
    notFound();
  }

  const paste = JSON.parse(raw);

  // ✅ Expiry check
  if (paste.expires_at && new Date() > new Date(paste.expires_at)) {
    await kv.del(`paste:${id}`);
    notFound();
  }

  // ✅ Max views check
  if (paste.remaining_views !== null) {
    if (paste.remaining_views <= 0) {
      await kv.del(`paste:${id}`);
      notFound();
    }

    // Reduce view count
    paste.remaining_views -= 1;

    await kv.set(`paste:${id}`, JSON.stringify(paste));
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Paste</h1>
      <pre>{paste.content}</pre>
    </div>
  );
}
