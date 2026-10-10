'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, Url } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export default function DashboardPage() {
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUrls();
    // Refresh every 30 seconds
    const interval = setInterval(loadUrls, 30_000);
    return () => clearInterval(interval);
  }, []);

  async function loadUrls() {
    try {
      const data = await api.listUrls();
      setUrls(data);
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
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <Card className="border-red-500">
          <CardContent className="pt-6">
            <p className="text-red-500 font-medium">Error: {error}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Make sure the backend is running at{' '}
              <code className="bg-muted px-1 rounded">
                {process.env.NEXT_PUBLIC_API_URL}
              </code>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button>+ Add URL</Button>
      </div>

      {urls.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground mb-4">
              No URLs yet. Add one to start monitoring.
            </p>
            <Button>Add your first URL</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {urls.map((url) => (
            <UrlCard key={url.id} url={url} />
          ))}
        </div>
      )}
    </div>
  );
}

function UrlCard({ url }: { url: Url }) {
  const latestPing = url.recentPings?.[0];
  const isDown = latestPing && !latestPing.isUp;

  return (
    <Link href={`/urls/${url.id}`}>
      <Card className={`hover:shadow-lg transition cursor-pointer ${isDown ? 'border-red-500' : ''}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg truncate">{url.name}</CardTitle>
            <StatusDot isActive={url.isActive} />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground break-all mb-4">
            {url.url}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              Every {url.checkIntervalSeconds}s
            </Badge>
            <Badge variant={url.isActive ? 'default' : 'secondary'}>
              {url.isActive ? 'Active' : 'Paused'}
            </Badge>
            {latestPing && (
              <Badge variant={latestPing.isUp ? 'default' : 'destructive'}>
                {latestPing.isUp ? 'UP' : 'DOWN'}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function StatusDot({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-block w-3 h-3 rounded-full ${
        isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
      }`}
    />
  );
}