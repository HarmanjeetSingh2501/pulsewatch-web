'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api, Url, Ping } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow, format } from 'date-fns';
import {
  AlertTriangle,
  ArrowLeft,
  Activity,
  Clock3,
  Gauge,
  Globe2,
  Radio,
  TrendingUp,
} from 'lucide-react';

export default function UrlDetailPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <UrlDetailContent />
    </Suspense>
  );
}

function UrlDetailContent() {
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

  if (loading) return <LoadingSkeleton />;

  if (error || !url) {
    return (
      <main className="detail-shell">
        <div className="container detail-inner">
          <Link href="/dashboard" className="back-link">
            <ArrowLeft aria-hidden="true" size={15} />
            Back to dashboard
          </Link>
          <Card className="error-card">
            <CardContent className="pt-6">
              <div className="error-row">
                <span className="error-icon">
                  <AlertTriangle aria-hidden="true" size={18} />
                </span>
                <div>
                  <p className="error-title">Error: {error || 'URL not found'}</p>
                  <p className="error-help">
                    The service could not be loaded. Check that the API is
                    reachable at{' '}
                    <code>{process.env.NEXT_PUBLIC_API_URL}</code>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const upPings = pings.filter((p) => p.isUp).length;
  const uptimePct = pings.length > 0 ? (upPings / pings.length) * 100 : 0;
  const pingsWithTime = pings.filter((p) => p.responseTimeMs !== null);
  const avgResponse =
    pingsWithTime.length > 0
      ? Math.round(
          pingsWithTime.reduce((sum, p) => sum + (p.responseTimeMs || 0), 0) /
            pingsWithTime.length
        )
      : 0;

  const latest = pings[0];
  const isDown = !!latest && !latest.isUp;
  const isUp = !!latest && latest.isUp;

  const uptimeTone =
    uptimePct >= 99 ? 'good' : uptimePct >= 95 ? 'warn' : 'bad';

  return (
    <main className="detail-shell">
      <div className="container detail-inner">
        {/* Back link */}
        <Link href="/dashboard" className="back-link">
          <ArrowLeft aria-hidden="true" size={15} />
          Back to dashboard
        </Link>

        {/* Header */}
        <div className="detail-header">
          <div className="detail-header-left">
            <span className="section-eyebrow">SERVICE DETAIL</span>
            <h1 className="detail-title">
              {url.name}
              <span
                className={`live-dot ${
                  isDown ? 'live-dot-red' : isUp ? '' : 'live-dot-muted'
                }`}
                aria-hidden="true"
              />
            </h1>
            <a
              href={url.url}
              target="_blank"
              rel="noopener noreferrer"
              className="detail-url"
            >
              <Globe2 aria-hidden="true" size={13} />
              {url.url}
            </a>
          </div>

          <div className="detail-badges">
            <Badge variant="outline" className="pw-pill">
              Every {url.checkIntervalSeconds}s
            </Badge>
            <Badge
              variant={url.isActive ? 'default' : 'secondary'}
              className="pw-pill"
            >
              {url.isActive ? 'Active' : 'Paused'}
            </Badge>
            {latest && (
              <Badge
                variant={latest.isUp ? 'default' : 'destructive'}
                className="pw-pill"
              >
                {latest.isUp ? 'UP' : 'DOWN'}
              </Badge>
            )}
          </div>
        </div>

        {/* Stat grid */}
        <div className="stat-grid">
          <StatCard
            icon={TrendingUp}
            label="Uptime"
            sublabel="Last 100 pings"
            value={`${uptimePct.toFixed(1)}%`}
            tone={uptimeTone}
          />
          <StatCard
            icon={Gauge}
            label="Avg response"
            sublabel="Across successful checks"
            value={`${avgResponse} ms`}
          />
          <StatCard
            icon={Activity}
            label="Total checks"
            sublabel="In this window"
            value={pings.length.toString()}
          />
        </div>

        {/* Uptime bar */}
        <Card className="uptime-card">
          <CardHeader>
            <div className="uptime-card-head">
              <CardTitle className="uptime-card-title">
                <Radio aria-hidden="true" size={15} />
                Recent checks
              </CardTitle>
              <span className="uptime-legend">
                <span className="legend-swatch legend-swatch-up" /> Up
                <span className="legend-swatch legend-swatch-down" /> Down
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="uptime-bar" aria-label="Uptime history">
              {pings.slice(0, 60).reverse().map((ping) => (
                <span
                  key={ping.id}
                  className={`uptime-tick ${
                    ping.isUp ? 'uptime-tick-up' : 'uptime-tick-down'
                  }`}
                  title={`${ping.statusCode || '—'} · ${
                    ping.responseTimeMs ? `${ping.responseTimeMs}ms` : 'timeout'
                  } · ${formatDistanceToNow(new Date(ping.checkedAt), {
                    addSuffix: true,
                  })}`}
                />
              ))}
            </div>
            <div className="uptime-axis">
              <span>
                {pings.length > 0
                  ? formatDistanceToNow(
                      new Date(pings[pings.length - 1].checkedAt),
                      { addSuffix: true }
                    )
                  : ''}
              </span>
              <span className="uptime-axis-now">
                <Clock3 aria-hidden="true" size={12} />
                now
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Ping feed */}
        <Card className="ping-card">
          <CardHeader>
            <div className="uptime-card-head">
              <CardTitle className="uptime-card-title">
                <Activity aria-hidden="true" size={15} />
                Live ping feed
              </CardTitle>
              <span className="ping-count">{pings.length} checks</span>
            </div>
          </CardHeader>
          <CardContent className="ping-body">
            {pings.length === 0 ? (
              <div className="ping-empty">No pings recorded yet.</div>
            ) : (
              <div className="ping-list">
                {pings.map((ping) => (
                  <PingRow key={ping.id} ping={ping} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function PingRow({ ping }: { ping: Ping }) {
  const checked = new Date(ping.checkedAt);
  return (
    <div className={`ping-row ${ping.isUp ? '' : 'ping-row-down'}`}>
      <span
        className={`status-pill ${
          ping.isUp ? 'status-pill-up' : 'status-pill-down'
        }`}
        aria-hidden="true"
      />
      <span className="ping-code">{ping.statusCode ?? '—'}</span>
      <span className="ping-time">
        {ping.responseTimeMs !== null ? `${ping.responseTimeMs} ms` : 'timeout'}
      </span>
      <span className="ping-date" title={format(checked, 'PPp')}>
        {formatDistanceToNow(checked, { addSuffix: true })}
      </span>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <main className="detail-shell">
      <div className="container detail-inner">
        <Skeleton className="h-4 w-32 mb-6" />
        <Skeleton className="h-9 w-72 mb-3" />
        <Skeleton className="h-4 w-96 mb-8" />
        <div className="stat-grid">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        <Skeleton className="h-32 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    </main>
  );
}

function StatCard({
  icon: Icon,
  label,
  sublabel,
  value,
  tone = 'default',
}: {
  icon: React.ComponentType<{ size?: number; 'aria-hidden'?: boolean }>;
  label: string;
  sublabel?: string;
  value: string;
  tone?: 'default' | 'good' | 'warn' | 'bad';
}) {
  return (
    <Card className={`stat-card stat-card-${tone}`}>
      <CardContent className="stat-card-content">
        <div className="stat-card-head">
          <span className="stat-card-icon">
            <Icon aria-hidden size={16} />
          </span>
          <span className="stat-card-label">{label}</span>
        </div>
        <p className={`stat-card-value stat-card-value-${tone}`}>{value}</p>
        {sublabel && <p className="stat-card-sublabel">{sublabel}</p>}
      </CardContent>
    </Card>
  );
}