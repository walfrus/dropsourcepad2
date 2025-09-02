'use client';

import dynamic from 'next/dynamic';

const MIN = process.env.NEXT_PUBLIC_MINIMAL === '1';

const Full = dynamic(() => import('./page-full')); // loads only when rendered

export default function Page() {
  if (MIN) {
    return (
      <div style={{ padding: 24 }}>
        <h1 style={{ fontWeight: 600, marginBottom: 8 }}>minimal shell renders ✅</h1>
        <p>No hooks or store imported in this code path.</p>
      </div>
    );
  }
  return <Full />;
}