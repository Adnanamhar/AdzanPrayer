'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/profil');
  }, [router]);

  return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
      Mengarahkan ke menu pengaturan...
    </div>
  );
}
