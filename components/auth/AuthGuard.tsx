'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.replace('/login');
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="text-sm text-neutral-400">Loading…</div>
      </div>
    );
  }

  return <>{children}</>;
}