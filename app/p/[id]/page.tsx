import { notFound } from "next/navigation";

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ unwrap params
  const { id } = await params;

  const baseUrl =
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/pastes/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();

  return (
    <div style={{ padding: "40px" }}>
      <h1>Paste</h1>
      <pre>{data.content}</pre>
    </div>
  );
}
