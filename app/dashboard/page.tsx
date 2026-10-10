'use client';

import { useEffect, useState, useCallback } from 'react';
import { api, Url } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Activity, AlertTriangle, Plus } from 'lucide-react';
import { AddUrlDialog } from '@/components/urls/AddUrlDialog';
import { UrlCard } from '@/components/urls/UrlCard';

export default function DashboardPage() {
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUrls = useCallback(async () => {
    try {
      const data = await api.listUrls();
      setUrls(data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUrls();
    const interval = setInterval(loadUrls, 30_000);
    return () => clearInterval(interval);
  }, [loadUrls]);

  return (
    <main className="min-h-[calc(100vh-74px)] bg-gradient-to-br from-lime-50/40 via-white to-lime-50/60 py-12 md:py-14">
      <div className="mx-auto w-full max-w-6xl px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-green-700">
              Monitoring overview
            </span>
            <h1 className="mt-2 inline-flex items-center gap-3 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
              Your <span className="text-green-700">dashboard</span>
              <span className="relative inline-block h-2.5 w-2.5 rounded-full bg-green-500">
                <span className="absolute -inset-1 animate-ping rounded-full bg-green-500/40" />
              </span>
            </h1>
          </div>

          <AddUrlDialog onCreated={loadUrls} />
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="rounded-2xl border-neutral-200">
                <CardContent className="p-6">
                  <Skeleton className="mb-3 h-5 w-3/4" />
                  <Skeleton className="mb-2 h-3 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <Card className="rounded-2xl border-red-200 bg-red-50/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-red-100 text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-red-900">{error}</p>
                  <p className="mt-1 text-sm text-red-700">
                    Make sure the backend is running at{' '}
                    <code className="rounded bg-red-100 px-1.5 py-0.5 text-xs">
                      {process.env.NEXT_PUBLIC_API_URL}
                    </code>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty state */}
        {!loading && !error && urls.length === 0 && (
          <Card className="rounded-2xl border-neutral-200 bg-white/90">
            <CardContent className="flex flex-col items-center gap-3 px-6 py-16 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-green-50 text-green-700">
                <Activity className="h-7 w-7" />
              </div>
              <h2 className="mt-2 text-lg font-semibold tracking-tight text-neutral-900">
                No services monitored yet
              </h2>
              <p className="mb-2 max-w-md text-sm leading-relaxed text-neutral-500">
                Add your first URL and PulseWatch will start keeping a pulse on
                it.
              </p>
              <AddUrlDialog onCreated={loadUrls}>
                <Button
                  size="lg"
                  className="gap-2 rounded-xl bg-green-900 px-5 text-sm font-semibold text-white shadow-md shadow-green-900/10 transition-all hover:-translate-y-0.5 hover:bg-green-800 hover:shadow-lg"
                >
                  <Plus className="h-4 w-4" />
                  Add your first URL
                </Button>
              </AddUrlDialog>
            </CardContent>
          </Card>
        )}

        {/* URL grid */}
        {!loading && !error && urls.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {urls.map((url) => (
              <UrlCard key={url.id} url={url} onDeleted={loadUrls} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}