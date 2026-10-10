'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, Url } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Activity, AlertTriangle, ExternalLink, Plus } from 'lucide-react';

export default function DashboardPage() {
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUrls();
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

  return (
    <main className="dashboard-shell">
      <div className="container dashboard-inner">
        <div className="dashboard-header">
          <div>
            <span className="section-eyebrow">MONITORING OVERVIEW</span>
            <h1 className="dashboard-title">
              Your <span>dashboard</span>
              <span className="live-dot" aria-hidden="true" />
            </h1>
          </div>
          <Button className="dashboard-add-btn" size="lg">
            <Plus aria-hidden="true" size={17} />
            Add URL
          </Button>
        </div>

        {loading && (
          <div className="dashboard-grid">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="url-card">
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
        )}

        {!loading && error && (
          <Card className="error-card">
            <CardContent className="pt-6">
              <div className="error-row">
                <span className="error-icon">
                  <AlertTriangle aria-hidden="true" size={18} />
                </span>
                <div>
                  <p className="error-title">Error: {error}</p>
                  <p className="error-help">
                    Make sure the backend is running at{' '}
                    <code>{process.env.NEXT_PUBLIC_API_URL}</code>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!loading && !error && urls.length === 0 && (
          <Card className="empty-card">
            <CardContent className="empty-content">
              <span className="empty-icon">
                <Activity aria-hidden="true" size={26} />
              </span>
              <h2>No services monitored yet</h2>
              <p>Add your first URL and PulseWatch will start keeping a pulse on it.</p>
              <Button className="dashboard-add-btn" size="lg">
                <Plus aria-hidden="true" size={17} />
                Add your first URL
              </Button>
            </CardContent>
          </Card>
        )}

        {!loading && !error && urls.length > 0 && (
          <div className="dashboard-grid">
            {urls.map((url) => (
              <UrlCard key={url.id} url={url} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function UrlCard({ url }: { url: Url }) {
  const latestPing = url.recentPings?.[0];
  const isDown = !!latestPing && !latestPing.isUp;
  const isUp = !!latestPing && latestPing.isUp;

  const lastCheckLabel = latestPing?.checkedAt
    ? `Checked ${formatRelative(latestPing.checkedAt)}`
    : 'Awaiting first check';

  return (
    <Link href={`/urls/${url.id}`} className="url-card-link">
      <Card
        className={`url-card ${isDown ? 'url-card-down' : ''} ${
          isUp ? 'url-card-up' : ''
        }`}
      >
        <CardHeader>
          <div className="url-card-head">
            <div className="url-card-heading">
              <CardTitle className="url-card-title">{url.name}</CardTitle>
              <p className="url-card-url">{url.url}</p>
            </div>
            <StatusDot isActive={url.isActive} isDown={isDown} />
          </div>
        </CardHeader>

        <CardContent>
          <div className="url-card-badges">
            <Badge variant="outline" className="pw-pill">
              Every {url.checkIntervalSeconds}s
            </Badge>
            <Badge
              variant={url.isActive ? 'default' : 'secondary'}
              className="pw-pill"
            >
              {url.isActive ? 'Active' : 'Paused'}
            </Badge>
            {latestPing && (
              <Badge
                variant={latestPing.isUp ? 'default' : 'destructive'}
                className="pw-pill"
              >
                {latestPing.isUp ? 'UP' : 'DOWN'}
              </Badge>
            )}
          </div>

          <div className="url-card-footer">
            <span className="url-card-meta">{lastCheckLabel}</span>
            <span className="url-card-open">
              Open <ExternalLink aria-hidden="true" size={12} />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function StatusDot({
  isActive,
  isDown,
}: {
  isActive: boolean;
  isDown?: boolean;
}) {
  const state = !isActive ? 'paused' : isDown ? 'down' : 'up';
  return <span className={`status-pill status-pill-${state}`} aria-hidden="true" />;
}

function formatRelative(iso: string) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return 'just now';
  const diff = Math.max(0, Date.now() - then);
  const s = Math.round(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}