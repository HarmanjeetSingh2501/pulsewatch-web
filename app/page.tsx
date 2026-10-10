import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        PulseWatch
      </h1>
      <p className="text-xl text-muted-foreground mb-12 text-center max-w-2xl">
        Free uptime monitoring with AI-powered incident summaries.
        Watch your sites 24/7, get alerted when they go down,
        and understand what happened.
      </p>
      <div className="flex gap-4">
        <Link href="/dashboard">
          <Button size="lg">Go to Dashboard</Button>
        </Link>
        <Link href="/incidents">
          <Button size="lg" variant="outline">View Incidents</Button>
        </Link>
      </div>
    </main>
  );
}