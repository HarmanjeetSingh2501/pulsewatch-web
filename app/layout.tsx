import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PulseWatch',
  description: 'Free uptime monitoring with AI incident summaries',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="border-b">
          <div className="container mx-auto flex h-16 items-center gap-6 px-8">
            <Link href="/" className="font-bold text-xl">
              PulseWatch
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/dashboard" className="hover:text-foreground/80">
                Dashboard
              </Link>
              <Link href="/incidents" className="hover:text-foreground/80">
                Incidents
              </Link>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}