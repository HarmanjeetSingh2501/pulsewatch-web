'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, Incident } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow, format } from 'date-fns';

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

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Incidents</h1>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Incidents</h1>

      {error ? (
        <Card className="border-red-500">
          <CardContent className="pt-6">
            <p className="text-red-500">Error: {error}</p>
          </CardContent>
        </Card>
      ) : incidents.length === 0 ? (
        <Card>
          <CardContent className="pt-6 py-12 text-center">
            <p className="text-muted-foreground">
              No incidents yet. That's a good thing.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {incidents.map((incident) => (
            <Card
              key={incident.id}
              className={incident.status === 'open' ? 'border-red-500' : ''}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{incident.urlName}</CardTitle>
                  <Badge
                    variant={incident.status === 'open' ? 'destructive' : 'secondary'}
                  >
                    {incident.status === 'open' ? 'ONGOING' : 'RESOLVED'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground break-all mb-2">
                  {incident.url}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Started:</span>{' '}
                  {format(new Date(incident.startedAt), 'PPp')}
                </p>
                {incident.endedAt && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Ended:</span>{' '}
                    {format(new Date(incident.endedAt), 'PPp')}
                  </p>
                )}
                {incident.aiSummary && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <p className="text-xs text-muted-foreground mb-1">
                      AI Summary
                    </p>
                    <p className="text-sm">{incident.aiSummary}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}