'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api, Url, Ping } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

export default function UrlDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [url, setUrl] = useState<Url | null>(null);
  const [pings, setPings] = useState<Ping[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30_000);
    return () => clearInterval(interval);
  }, [id]);

  async function loadData() {
    try {
      const [urlData, pingsData] = await Promise.all([
        api.getUrl(id),
        api.getPings(id, 100),
      ]);
      setUrl(urlData);
      setPings(pingsData.pings);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <Skeleton className="h-10 w-64 mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !url) {
    return (
      <div className="container mx-auto p-8">
        <Card className="border-red-500">
          <CardContent className="pt-6">
            <p className="text-red-500">Error: {error || 'URL not found'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const upPings = pings.filter((p) => p.isUp).length;
  const uptimePct = pings.length > 0 ? (upPings / pings.length) * 100 : 0;
  const avgResponse = pings.length > 0
    ? Math.round(
        pings
          .filter((p) => p.responseTimeMs !== null)
          .reduce((sum, p) => sum + (p.responseTimeMs || 0), 0) /
          pings.filter((p) => p.responseTimeMs !== null).length
      )
    : 0;

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{url.name}</h1>
        <p className="text-muted-foreground break-all">{url.url}</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <StatCard
          label="Uptime (last 100 pings)"
          value={`${uptimePct.toFixed(1)}%`}
          variant={uptimePct > 95 ? 'default' : 'destructive'}
        />
        <StatCard
          label="Avg Response Time"
          value={`${avgResponse}ms`}
        />
        <StatCard
          label="Total Checks"
          value={pings.length.toString()}
        />
      </div>

      {/* Ping History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Pings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {pings.map((ping) => (
              <div
                key={ping.id}
                className="flex items-center justify-between py-2 border-b last:border-0 text-sm"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      ping.isUp ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <span className="font-mono">
                    {ping.statusCode || '—'}
                  </span>
                  <span className="text-muted-foreground">
                    {ping.responseTimeMs ? `${ping.responseTimeMs}ms` : 'timeout'}
                  </span>
                </div>
                <span className="text-muted-foreground text-xs">
                  {formatDistanceToNow(new Date(ping.checkedAt), { addSuffix: true })}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  variant = 'default',
}: {
  label: string;
  value: string;
  variant?: 'default' | 'destructive';
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className={`text-2xl font-bold ${variant === 'destructive' ? 'text-red-500' : ''}`}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}