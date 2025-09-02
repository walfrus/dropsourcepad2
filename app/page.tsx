'use client';

import dynamicImport from 'next/dynamic';

export const dynamic = 'force-dynamic';

const MIN = process.env.NEXT_PUBLIC_MINIMAL === '1';

const Full = dynamicImport(() => import('./page-full')); // loads only when rendered

export default function Page() {
  // Debug the environment variable
  console.log('🔍 DEBUG: NEXT_PUBLIC_MINIMAL =', process.env.NEXT_PUBLIC_MINIMAL);
  console.log('🔍 DEBUG: MIN =', MIN);
  
  if (MIN) {
    return (
      <div style={{ padding: 24 }}>
        <h1 style={{ fontWeight: 600, marginBottom: 8 }}>minimal shell renders ✅</h1>
        <p>No hooks or store imported in this code path.</p>
        <p>Debug: MIN = {String(MIN)}</p>
      </div>
    );
  }
  return <Full />;
}