"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [pasteId, setPasteId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    if (!res.ok) {
      alert("Failed to create paste");
      return;
    }

    const data = await res.json();
    setPasteId(data.id);
    setContent("");
  };

  return (
    <main style={{ padding: "20px" }}>
      <h1>Pastebin Lite</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your text here..."
          rows={10}
          cols={50}
          required
        />
        <br />
        <button type="submit">Create Paste</button>
      </form>

      {pasteId && (
        <p>
          Paste Created:{" "}
          <a href={`/p/${pasteId}`} target="_blank">
            View Paste
          </a>
        </p>
      )}
    </main>
  );
}
