'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { auth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity, Loader2, Mail, Lock, AlertTriangle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function LoginPage() {
  return (
    <Suspense fallback={<div />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle OAuth error params (e.g. ?error=google_denied)
  useEffect(() => {
    const err = searchParams.get('error');
    if (err) {
      const messages: Record<string, string> = {
        google_denied: 'Google sign-in was cancelled',
        no_code: 'Google did not return an authorization code',
        google_not_configured: 'Google sign-in is not configured',
        token_exchange: 'Failed to exchange authorization code',
        userinfo: 'Failed to fetch your Google profile',
        email_not_verified: 'Your Google email is not verified',
        server_error: 'Something went wrong',
      };
      setError(messages[err] || 'Google sign-in failed');
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.login(email.trim(), password);
      auth.saveSession(res.token, res.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleSignIn() {
    window.location.href = `${API_URL}/api/v1/auth/google`;
  }

  return (
    <main className="grid min-h-[calc(100vh-74px)] place-items-center bg-gradient-to-br from-lime-50/40 via-white to-lime-50/60 px-6 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-green-900 text-lime-300 shadow-lg shadow-green-900/20">
            <Activity className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-neutral-500">
            Sign in to your PulseWatch account
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm">
          {/* Google sign-in */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-neutral-200 bg-white text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.717v2.258h2.908c1.702-1.566 2.684-3.874 2.684-6.615z"
              />
              <path
                fill="#34A853"
                d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
              />
              <path
                fill="#FBBC05"
                d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
              />
              <path
                fill="#EA4335"
                d="M9 3.581c1.321 0 2.506.454 3.438 1.345l2.581-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.581 9 3.581z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-neutral-400">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email/password form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-600"
              >
                <Mail className="h-3.5 w-3.5 text-green-700" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="h-11 rounded-xl border-neutral-200 bg-neutral-50/50 text-sm focus-visible:border-lime-300 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-lime-200/40"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-600"
              >
                <Lock className="h-3.5 w-3.5 text-green-700" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="h-11 rounded-xl border-neutral-200 bg-neutral-50/50 text-sm focus-visible:border-lime-300 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-lime-200/40"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                <div className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-md bg-red-100 text-red-600">
                  <AlertTriangle className="h-3.5 w-3.5" />
                </div>
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full gap-2 rounded-xl bg-green-900 text-sm font-semibold text-white shadow-md shadow-green-900/10 transition-all hover:-translate-y-0.5 hover:bg-green-800 hover:shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-neutral-500">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-semibold text-green-700 hover:text-green-800"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}