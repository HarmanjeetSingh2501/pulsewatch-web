import { auth } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const hasBody = options.body !== undefined && options.body !== null;
  const token = auth.getToken();

  const headers: Record<string, string> = {
    ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    // Auto-clear auth on 401 (token expired/invalid)
    if (res.status === 401) {
      auth.clear();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error || 'Request failed');
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// ─── Types ────────────────────────────────────────────────
export interface AuthResponse {
  token: string;
  user: { id: number; email: string };
}

export interface Url {
  id: number;
  userId: number;
  url: string;
  name: string;
  checkIntervalSeconds: number;
  isActive: boolean;
  nextCheckAt: string;
  createdAt: string;
  recentPings?: Ping[];
  status?: 'up' | 'degraded' | 'down' | 'paused' | 'unknown';
  zScore?: number | null;
  baselineMean?: number | null;
  baselineStdDev?: number | null;
}

export interface Ping {
  id: number;
  urlId: number;
  statusCode: number | null;
  responseTimeMs: number | null;
  isUp: boolean;
  errorMessage: string | null;
  checkedAt: string;
}

export interface Incident {
  id: number;
  urlId: number;
  urlName: string;
  url: string;
  startedAt: string;
  endedAt: string | null;
  status: 'open' | 'resolved';
  errorType: string | null;
  aiSummary: string | null;
}

export interface CreateUrlInput {
  url: string;
  name: string;
  checkIntervalSeconds?: number;
}

// ─── API ──────────────────────────────────────────────────
export const api = {
  // ─── Auth ─────────────────────────────────────────────
  register: (email: string, password: string) =>
    request<AuthResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () =>
    request<{ id: number; email: string; createdAt: string }>('/api/v1/auth/me'),

  // ─── URLs ─────────────────────────────────────────────
  listUrls: () => request<Url[]>('/api/v1/urls'),

  getUrl: (id: number) => request<Url>(`/api/v1/urls/${id}`),

  createUrl: (data: CreateUrlInput) =>
    request<Url>('/api/v1/urls', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateUrl: (
    id: number,
    data: Partial<CreateUrlInput> & { isActive?: boolean }
  ) =>
    request<Url>(`/api/v1/urls/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteUrl: (id: number) =>
    request<void>(`/api/v1/urls/${id}`, { method: 'DELETE' }),

  getPings: (urlId: number, limit = 100) =>
    request<{ urlId: number; count: number; pings: Ping[] }>(
      `/api/v1/urls/${urlId}/pings?limit=${limit}`
    ),

  // ─── Incidents ────────────────────────────────────────
  listIncidents: (params?: { status?: string; urlId?: number }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set('status', params.status);
    if (params?.urlId) qs.set('urlId', String(params.urlId));
    return request<Incident[]>(
      `/api/v1/incidents${qs.toString() ? `?${qs}` : ''}`
    );
  },

  getIncident: (id: number) => request<Incident>(`/api/v1/incidents/${id}`),
};