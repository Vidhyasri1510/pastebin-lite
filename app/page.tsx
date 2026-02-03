"use client";

import { useState } from "react";

export default function HomePage() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [views, setViews] = useState("");

  async function createPaste(e: React.FormEvent) {
    e.preventDefault(); // 🔥 VERY IMPORTANT

    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        ttl_seconds: ttl ? Number(ttl) : null,
        max_views: views ? Number(views) : null,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("API ERROR:", err);
      alert("Paste create failed");
      return;
    }

    const data = await res.json();
    window.location.href = data.url;
  }

  return (
    <div style={{ padding: 30 }}>
      <h2>Create Paste</h2>

      <form onSubmit={createPaste}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter paste content"
          rows={6}
          style={{ width: "100%" }}
        />

        <br /><br />

        <input
          type="number"
          placeholder="TTL seconds (optional)"
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
        />

        <br /><br />

        <input
          type="number"
          placeholder="Max views (optional)"
          value={views}
          onChange={(e) => setViews(e.target.value)}
        />

        <br /><br />

        <button type="submit">Create Paste</button>
      </form>
    </div>
  );
}
