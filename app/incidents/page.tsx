'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, Incident } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow, formatDistance, format } from 'date-fns';
import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Radio,
  Sparkles,
} from 'lucide-react';

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listIncidents()
      .then(setIncidents)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const openCount = incidents.filter((i) => i.status === 'open').length;

  return (
    <main className="incidents-shell">
      <div className="container incidents-inner">
        <div className="incidents-header">
          <div>
            <span className="section-eyebrow">INCIDENT LOG</span>
            <h1 className="incidents-title">
              Every <span>blip</span>, on the record
              {openCount > 0 ? (
                <span className="live-dot live-dot-red" aria-hidden="true" />
              ) : (
                <span className="live-dot" aria-hidden="true" />
              )}
            </h1>
            <p className="incidents-subtitle">
              {loading
                ? 'Loading incidents…'
                : error
                ? 'Could not load incidents'
                : incidents.length === 0
                ? 'Nothing has gone wrong yet.'
                : `${incidents.length} total · ${openCount} ongoing`}
            </p>
          </div>
        </div>

        {loading && (
          <div className="incident-list">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="incident-card">
                <CardHeader>
                  <Skeleton className="h-5 w-1/3 mb-3" />
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
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
                    Check that the API is reachable at{' '}
                    <code>{process.env.NEXT_PUBLIC_API_URL}</code>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!loading && !error && incidents.length === 0 && (
          <Card className="empty-card">
            <CardContent className="empty-content">
              <span className="empty-icon empty-icon-green">
                <CheckCircle2 aria-hidden="true" size={26} />
              </span>
              <h2>All quiet. That&apos;s a good thing.</h2>
              <p>
                No incidents have been recorded. PulseWatch will log and
                summarize anything that goes down the moment it happens.
              </p>
              <Link href="/dashboard" className="button-secondary">
                Back to dashboard
                <ArrowRight aria-hidden="true" size={15} />
              </Link>
            </CardContent>
          </Card>
        )}

        {!loading && !error && incidents.length > 0 && (
          <div className="incident-list">
            {incidents.map((incident) => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function IncidentCard({ incident }: { incident: Incident }) {
  const isOpen = incident.status === 'open';
  const started = new Date(incident.startedAt);
  const ended = incident.endedAt ? new Date(incident.endedAt) : null;

  return (
    <Card
      className={`incident-card ${
        isOpen ? 'incident-card-open' : 'incident-card-resolved'
      }`}
    >
      <CardHeader>
        <div className="incident-head">
          <div className="incident-head-left">
            <span
              className={`status-pill ${
                isOpen ? 'status-pill-down' : 'status-pill-up'
              }`}
            />
            <CardTitle className="incident-title">
              {incident.urlName}
            </CardTitle>
            <Badge
              variant={isOpen ? 'destructive' : 'secondary'}
              className="pw-pill"
            >
              {isOpen ? 'ONGOING' : 'RESOLVED'}
            </Badge>
          </div>
          <span className="incident-duration">
            {ended
              ? `Duration ${formatDistance(started, ended)}`
              : `Ongoing for ${formatDistanceToNow(started)}`}
          </span>
        </div>
      </CardHeader>

      <CardContent className="incident-body">
        <p className="incident-url">{incident.url}</p>

        <div className="incident-timeline">
          <div className="timeline-row">
            <span className="timeline-icon">
              <Radio aria-hidden="true" size={13} />
            </span>
            <span className="timeline-label">Started</span>
            <span className="timeline-value">{format(started, 'PPp')}</span>
          </div>
          {ended && (
            <div className="timeline-row">
              <span className="timeline-icon timeline-icon-green">
                <CheckCircle2 aria-hidden="true" size={13} />
              </span>
              <span className="timeline-label">Resolved</span>
              <span className="timeline-value">{format(ended, 'PPp')}</span>
            </div>
          )}
          {!ended && (
            <div className="timeline-row timeline-row-live">
              <span className="timeline-icon timeline-icon-red">
                <Clock3 aria-hidden="true" size={13} />
              </span>
              <span className="timeline-label">Still down</span>
              <span className="timeline-value">
                {formatDistanceToNow(started)} and counting
              </span>
            </div>
          )}
        </div>

        {/* ─── AI Summary ─────────────────────────────────── */}
        {incident.aiSummary ? (
          <div className="mt-4 rounded-xl border border-green-100 bg-gradient-to-br from-lime-50 to-white p-4">
            <div className="mb-2.5 flex items-center gap-2">
              <span className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-md bg-green-100 text-green-700">
                <BrainCircuit className="h-3.5 w-3.5" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-green-700">
                AI Summary
              </span>
              <Sparkles className="h-3 w-3 text-lime-500" />
            </div>
            <p className="text-[13px] leading-relaxed text-neutral-700">
              {incident.aiSummary}
            </p>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50/70 p-4">
            <div className="mb-2.5 flex items-center gap-2">
              <span className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-md bg-neutral-200 text-neutral-500">
                <BrainCircuit className="h-3.5 w-3.5" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-500">
                AI Summary
              </span>
            </div>
            <p className="text-[13px] italic leading-relaxed text-neutral-500">
              {isOpen
                ? 'Summary will be generated once the incident resolves.'
                : 'Generating summary… refresh in a few seconds.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}