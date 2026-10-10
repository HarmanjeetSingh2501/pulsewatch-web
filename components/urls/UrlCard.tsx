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
import { ExternalLink, MoreVertical, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface UrlCardProps {
  url: Url;
  onDeleted: () => void;
}

export function UrlCard({ url, onDeleted }: UrlCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const latestPing = url.recentPings?.[0];
  const isDown = !!latestPing && !latestPing.isUp;
  const isUp = !!latestPing && latestPing.isUp;

  const lastCheckLabel = latestPing?.checkedAt
    ? `Checked ${formatRelative(latestPing.checkedAt)}`
    : 'Awaiting first check';

  async function handleDelete() {
    console.log('[UrlCard] Deleting URL', url.id);
    setDeleting(true);

    try {
      await api.deleteUrl(url.id);
      console.log('[UrlCard] Delete successful');
      toast.success('URL removed', {
        description: `${url.name} is no longer being monitored.`,
      });
      setConfirmOpen(false);
      onDeleted();
    } catch (err: any) {
      console.error('[UrlCard] Delete failed', err);
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
              <StatusDot isActive={url.isActive} isDown={isDown} />

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
                      // Defer until after dropdown fully closes
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
            {latestPing && (
              <Badge
                variant={latestPing.isUp ? 'default' : 'destructive'}
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                  latestPing.isUp
                    ? 'bg-green-600 hover:bg-green-600'
                    : 'bg-red-600 hover:bg-red-600'
                }`}
              >
                {latestPing.isUp ? 'UP' : 'DOWN'}
              </Badge>
            )}
          </div>

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
          // Block closing while deleting
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
              and all its ping history will be permanently deleted. This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>

            {/* Plain Button, NOT AlertDialogAction — this is the fix */}
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
}: {
  isActive: boolean;
  isDown?: boolean;
}) {
  const state = !isActive ? 'paused' : isDown ? 'down' : 'up';

  const colorClass =
    state === 'paused'
      ? 'bg-neutral-300'
      : state === 'down'
      ? 'bg-red-500'
      : 'bg-green-500';

  const ringClass =
    state === 'paused'
      ? ''
      : state === 'down'
      ? 'before:border-red-500'
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