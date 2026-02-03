'use client';

import { useState } from 'react';

export default function Home() {
  const [content, setContent] = useState('');
  const [ttl, setTtl] = useState('');
  const [views, setViews] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async () => {
    const res = await fetch('/api/pastes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        ttl_seconds: ttl ? Number(ttl) : undefined,
        max_views: views ? Number(views) : undefined,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    setResult(data.url);
  };

  return (
    <div style={{ padding: '40px' }}>
      <h1>Pastebin Lite</h1>

      <textarea
        placeholder="Enter your paste..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ width: '100%', height: '150px' }}
      />

      <br /><br />

      <input
        placeholder="TTL (seconds)"
        value={ttl}
        onChange={(e) => setTtl(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Max Views"
        value={views}
        onChange={(e) => setViews(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSubmit}>Create Paste</button>

      {result && (
        <div style={{ marginTop: '20px' }}>
          <p>Paste URL:</p>
          <a href={result}>{result}</a>
        </div>
      )}
    </div>
  );
}
