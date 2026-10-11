'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { auth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity, Loader2, Mail, Lock, AlertTriangle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await api.register(email.trim(), password);
      auth.saveSession(res.token, res.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
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
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-neutral-500">
            Start monitoring in under a minute
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm">
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
                autoFocus
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
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                disabled={loading}
                className="h-11 rounded-xl border-neutral-200 bg-neutral-50/50 text-sm focus-visible:border-lime-300 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-lime-200/40"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirm"
                className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-600"
              >
                <Lock className="h-3.5 w-3.5 text-green-700" />
                Confirm password
              </Label>
              <Input
                id="confirm"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
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
                  Creating account…
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-neutral-500">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-green-700 hover:text-green-800"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}