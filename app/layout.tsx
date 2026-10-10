import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Activity, ArrowRight } from 'lucide-react';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PulseWatch — Uptime monitoring with a pulse',
  description:
    'Keep a constant pulse on your websites and APIs with free uptime monitoring, fast incident alerts, and AI-powered summaries.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <header className="site-header">
          <nav className="site-nav container" aria-label="Main navigation">
            <Link href="/" className="site-logo" aria-label="PulseWatch home">
              <span className="site-logo-icon">
                <Activity aria-hidden="true" size={18} />
              </span>
              <span>
                pulse<span>watch</span>
              </span>
            </Link>
            <div className="site-nav-links">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/incidents">Incidents</Link>
            </div>
            <Link href="/dashboard" className="nav-cta">
              Open dashboard <ArrowRight aria-hidden="true" size={15} />
            </Link>
          </nav>
        </header>
        <div className="app-content">{children}</div>
      </body>
    </html>
  );
}