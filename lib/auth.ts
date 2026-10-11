'use client';

const TOKEN_KEY = 'pulsewatch_token';
const USER_KEY = 'pulsewatch_user';

export interface AuthUser {
  id: number;
  email: string;
}

export const auth = {
  // ─── Token ─────────────────────────────────────────
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  },

  // ─── User ──────────────────────────────────────────
  getUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setUser(user: AuthUser): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // ─── Auth state ────────────────────────────────────
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // ─── Logout ────────────────────────────────────────
  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // ─── Save session ─────────────────────────────────
  saveSession(token: string, user: AuthUser): void {
    this.setToken(token);
    this.setUser(user);
  },
};