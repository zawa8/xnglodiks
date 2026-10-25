'use client';
import { useRouter, usePathname } from 'next/navigation';

export default function BekBatan() {
  const router = useRouter();
  const path = usePathname();

  if (path === '/') return null;

  return (
    <button
      onClick={() => router.push('/')}
      title="← bek"
      style={{
        padding: '0.4rem 0.75rem',
        borderRadius: '6px',
        border: '1px solid #333',
        background: '#111',
        color: '#fff',
        fontSize: '0.85rem',
        cursor: 'pointer',
      }}
    >
      ← bek
    </button>
  );
}
