'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, AuthUser } from '@/lib/auth';
import { LogOut, LogIn, ArrowRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function NavAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUser(auth.getUser());

    // Watch for changes (e.g. after login/logout in another tab)
    const interval = setInterval(() => setUser(auth.getUser()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Avoid hydration mismatch — don't render until we know auth state
  if (!mounted) {
    return <div className="h-[38px] w-[120px]" />;
  }

  if (!user) {
    return (
      <Link href="/login" className="nav-cta">
        Sign in <ArrowRight aria-hidden="true" size={15} />
      </Link>
    );
  }

  function handleLogout() {
    auth.clear();
    setUser(null);
    router.push('/login');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="nav-cta"
          aria-label="Account menu"
          type="button"
        >
          <span className="max-w-[140px] truncate">
            {user.email}
          </span>
          <ArrowRight
            aria-hidden="true"
            size={15}
            style={{ transform: 'rotate(90deg)' }}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="z-50 w-56 rounded-xl border border-neutral-200 bg-white p-1 shadow-lg"
      >
        <div className="border-b border-neutral-100 px-3 py-2">
          <p className="text-xs text-neutral-400">Signed in as</p>
          <p className="truncate text-sm font-medium text-neutral-700">
            {user.email}
          </p>
        </div>
        <DropdownMenuItem
          onSelect={handleLogout}
          className="cursor-pointer rounded-lg px-2.5 py-2 text-sm font-medium text-red-600 focus:bg-red-50 focus:text-red-700"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}