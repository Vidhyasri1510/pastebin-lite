import { notFound } from "next/navigation";

export default async function PastePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/pastes/${id}`,
    {
      cache: "no-store",
    }
  );

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
