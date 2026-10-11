'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Url, api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  ExternalLink,
  MoreVertical,
  Trash2,
  AlertTriangle,
  Loader2,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';

interface UrlCardProps {
  url: Url;
  onDeleted: () => void;
}

export function UrlCard({ url, onDeleted }: UrlCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const latestPing = url.recentPings?.[0];

  // Status is computed server-side now — prefer it, fall back to legacy logic
  const status = url.status ?? 'unknown';
  const isDown = status === 'down' || (!!latestPing && !latestPing.isUp);
  const isDegraded = status === 'degraded';
  const isUp = !isDown && !isDegraded && status === 'up';
  const isPaused = status === 'paused';

  const lastCheckLabel = latestPing?.checkedAt
    ? `Checked ${formatRelative(latestPing.checkedAt)}`
    : 'Awaiting first check';

  async function handleDelete() {
    setDeleting(true);

    try {
      await api.deleteUrl(url.id);
      toast.success('URL removed', {
        description: `${url.name} is no longer being monitored.`,
      });
      setConfirmOpen(false);
      onDeleted();
    } catch (err: any) {
      toast.error('Failed to delete', { description: err.message });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <Card
        className={`relative h-full overflow-hidden rounded-2xl border bg-white/90 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
          isDown
            ? 'border-red-200 before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-gradient-to-b before:from-red-400 before:to-red-500'
            : isDegraded
            ? 'border-amber-200 before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-gradient-to-b before:from-amber-300 before:to-orange-400'
            : isUp
            ? 'border-neutral-200 before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-gradient-to-b before:from-lime-300 before:to-green-400'
            : 'border-neutral-200'
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <Link
                href={`/urls/${url.id}`}
                className="inline-block max-w-full rounded-sm outline-none transition-colors hover:text-green-700 focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2"
              >
                <CardTitle className="truncate text-base font-semibold tracking-tight text-neutral-800">
                  {url.name}
                </CardTitle>
              </Link>
              <p className="mt-1 truncate text-xs text-neutral-500">
                {url.url}
              </p>
            </div>

            <div className="flex flex-shrink-0 items-center gap-1.5">
              <StatusDot
                isActive={url.isActive}
                isDown={isDown}
                isDegraded={isDegraded}
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                    aria-label="URL actions"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setTimeout(() => setConfirmOpen(true), 50);
                    }}
                    className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="mb-4 flex flex-wrap gap-1.5">
            <Badge
              variant="outline"
              className="rounded-full border-neutral-200 px-2.5 py-0.5 text-[10px] font-medium text-neutral-600"
            >
              Every {url.checkIntervalSeconds}s
            </Badge>

            <Badge
              variant={url.isActive ? 'default' : 'secondary'}
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                url.isActive
                  ? 'bg-green-600 hover:bg-green-600'
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {url.isActive ? 'Active' : 'Paused'}
            </Badge>

            {/* Down badge */}
            {isDown && (
              <Badge
                variant="destructive"
                className="rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-medium hover:bg-red-600"
              >
                DOWN
              </Badge>
            )}

            {/* Degraded badge with z-score */}
            {isDegraded && (
              <Badge
                variant="outline"
                className="flex items-center gap-1 rounded-full border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[10px] font-medium text-amber-700"
              >
                <TrendingUp className="h-3 w-3" />
                DEGRADED
                {url.zScore != null && (
                  <span className="ml-0.5 text-amber-500">
                    z={url.zScore.toFixed(1)}
                  </span>
                )}
              </Badge>
            )}

            {/* Up badge (only if not degraded) */}
            {isUp && (
              <Badge
                variant="default"
                className="rounded-full bg-green-600 px-2.5 py-0.5 text-[10px] font-medium hover:bg-green-600"
              >
                UP
              </Badge>
            )}
          </div>

          {/* Degraded explanation strip */}
          {isDegraded && url.baselineMean != null && (
            <div className="mb-4 rounded-lg border border-amber-100 bg-amber-50/50 px-3 py-2 text-[11px] text-amber-800">
              <span className="font-medium">Response time anomaly detected.</span>{' '}
              {latestPing?.responseTimeMs != null && (
                <>
                  Current <strong>{latestPing.responseTimeMs}ms</strong>
                  {' '}vs baseline{' '}
                  <strong>{Math.round(url.baselineMean)}ms</strong>
                </>
              )}
            </div>
          )}

          <Link
            href={`/urls/${url.id}`}
            className="-mx-1 block rounded-lg px-1 py-1 transition-colors hover:bg-neutral-50"
          >
            <div className="flex items-center justify-between border-t border-neutral-100 pt-3 text-xs">
              <span className="text-neutral-500">{lastCheckLabel}</span>
              <span className="inline-flex items-center gap-1 font-medium text-green-700">
                Open <ExternalLink className="h-3 w-3" />
              </span>
            </div>
          </Link>
        </CardContent>
      </Card>

      {/* ─── Delete Confirmation ───────────────────────────── */}
      <AlertDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!deleting) setConfirmOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mb-2 grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <AlertDialogTitle className="text-lg font-semibold tracking-tight text-neutral-900">
              Delete this URL?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed text-neutral-500">
              <strong className="font-semibold text-neutral-800">
                {url.name}
              </strong>{' '}
              and all its ping history will be permanently deleted. This cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>

            <Button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function StatusDot({
  isActive,
  isDown,
  isDegraded,
}: {
  isActive: boolean;
  isDown?: boolean;
  isDegraded?: boolean;
}) {
  const state = !isActive
    ? 'paused'
    : isDown
    ? 'down'
    : isDegraded
    ? 'degraded'
    : 'up';

  const colorClass =
    state === 'paused'
      ? 'bg-neutral-300'
      : state === 'down'
      ? 'bg-red-500'
      : state === 'degraded'
      ? 'bg-amber-500'
      : 'bg-green-500';

  const ringClass =
    state === 'paused'
      ? ''
      : state === 'down'
      ? 'before:border-red-500'
      : state === 'degraded'
      ? 'before:border-amber-500'
      : 'before:border-green-500';

  return (
    <span
      className={`relative inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full ${colorClass} before:absolute before:-inset-1 before:rounded-full before:border before:opacity-40 before:content-[''] ${ringClass}`}
      aria-hidden="true"
    />
  );
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