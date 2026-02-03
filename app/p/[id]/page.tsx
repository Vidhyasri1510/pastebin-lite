import { notFound } from "next/navigation";

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `http://localhost:3000/api/pastes/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return notFound();
  }

  const data = await res.json();

  return (
    <div style={{ padding: "40px" }}>
      <h1>Paste</h1>
      <pre>{data.content}</pre>
    </div>
  );
}
