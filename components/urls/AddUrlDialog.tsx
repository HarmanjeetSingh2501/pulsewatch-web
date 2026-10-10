'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import {
  Plus,
  Loader2,
  Globe2,
  Tag,
  Timer,
  AlertTriangle,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

interface AddUrlDialogProps {
  onCreated: () => void;
  children?: React.ReactNode;
}

export function AddUrlDialog({ onCreated, children }: AddUrlDialogProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [interval, setIntervalValue] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.createUrl({
        url: url.trim(),
        name: name.trim(),
        checkIntervalSeconds: interval,
      });

      toast.success('URL added', {
        description: `${name} will be checked every ${interval}s.`,
      });

      setUrl('');
      setName('');
      setIntervalValue(30);
      setOpen(false);
      onCreated();
    } catch (e: any) {
      setError(e.message || 'Failed to add URL');
    } finally {
      setLoading(false);
    }
  }

  function handleOpenChange(next: boolean) {
    if (!loading) {
      setOpen(next);
      if (!next) setError(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button
            size="lg"
            className="gap-2 rounded-xl bg-green-900 px-5 text-sm font-semibold text-white shadow-md shadow-green-900/10 transition-all hover:-translate-y-0.5 hover:bg-green-800 hover:shadow-lg hover:shadow-green-900/20"
          >
            <Plus className="h-4 w-4" />
            Add URL
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        className="gap-0 overflow-hidden rounded-2xl border-neutral-200 p-0 shadow-2xl sm:max-w-md [&>button]:hidden"
      >
        {/* Custom close */}
        <button
          type="button"
          onClick={() => !loading && setOpen(false)}
          aria-label="Close dialog"
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3.5 border-b border-neutral-100 px-7 pb-5 pt-7">
          <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-green-900 text-lime-300 shadow-md shadow-green-900/20">
            <Plus className="h-5 w-5" />
          </div>
          <div className="pt-0.5 pr-8">
            <DialogTitle className="mb-1.5 text-lg font-semibold tracking-tight text-neutral-900">
              Add a URL to monitor
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-neutral-500">
              PulseWatch will ping this URL on a schedule and alert you when it
              goes down.
            </DialogDescription>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 px-7 py-6">
          <div className="space-y-2">
            <Label
              htmlFor="url"
              className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-600"
            >
              <Globe2 className="h-3.5 w-3.5 text-green-700" />
              URL
            </Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={loading}
              autoFocus
              className="h-11 rounded-xl border-neutral-200 bg-neutral-50/50 text-sm transition-all focus-visible:border-lime-300 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-lime-200/40"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-600"
            >
              <Tag className="h-3.5 w-3.5 text-green-700" />
              Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="My Website"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
              disabled={loading}
              className="h-11 rounded-xl border-neutral-200 bg-neutral-50/50 text-sm transition-all focus-visible:border-lime-300 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-lime-200/40"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="interval"
              className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-600"
            >
              <Timer className="h-3.5 w-3.5 text-green-700" />
              Check interval
            </Label>
            <div className="relative">
              <Input
                id="interval"
                type="number"
                min={30}
                max={3600}
                value={interval}
                onChange={(e) => setIntervalValue(Number(e.target.value))}
                required
                disabled={loading}
                className="h-11 rounded-xl border-neutral-200 bg-neutral-50/50 pr-14 text-sm transition-all focus-visible:border-lime-300 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-lime-200/40"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-neutral-400">
                sec
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Minimum 30 seconds. Default 30.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              <div className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-md bg-red-100 text-red-600">
                <AlertTriangle className="h-3.5 w-3.5" />
              </div>
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 border-t border-neutral-100 pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="h-11 rounded-xl border-neutral-200 px-4 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="h-11 gap-2 rounded-xl bg-green-900 px-5 text-sm font-semibold text-white shadow-md shadow-green-900/10 transition-all hover:-translate-y-0.5 hover:bg-green-800 hover:shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding…
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add URL
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}