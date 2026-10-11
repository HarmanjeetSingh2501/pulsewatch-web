'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Activity, Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<CallbackLoading />}>
      <CallbackContent />
    </Suspense>
  );
}

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const id = searchParams.get('id');
    const email = searchParams.get('email');

    if (!token || !id || !email) {
      setError('Missing authentication data');
      return;
    }

    // Save the session — same as email/password login
    auth.saveSession(token, { id: Number(id), email });

    // Redirect to the dashboard
    router.replace('/dashboard');
  }, [searchParams, router]);

  if (error) {
    return (
      <main className="grid min-h-[calc(100vh-74px)] place-items-center bg-gradient-to-br from-lime-50/40 via-white to-lime-50/60 px-6">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-800">{error}</p>
          <a
            href="/login"
            className="mt-4 inline-block text-sm font-semibold text-red-700 hover:text-red-900"
          >
            ← Back to login
          </a>
        </div>
      </main>
    );
  }

  return <CallbackLoading />;
}

function CallbackLoading() {
  return (
    <main className="grid min-h-[calc(100vh-74px)] place-items-center bg-gradient-to-br from-lime-50/40 via-white to-lime-50/60 px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-green-900 text-lime-300 shadow-lg shadow-green-900/20">
          <Activity className="h-7 w-7" />
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Signing you in…
        </div>
      </div>
    </main>
  );
}