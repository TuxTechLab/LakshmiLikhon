const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}/api${endpoint}`;
  const res = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  health: () => fetchAPI('/health'),
  config: () => fetchAPI('/config'),

  auth: {
    login: (username: string, password: string) =>
      fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }),
    logout: () => fetchAPI('/auth/logout', { method: 'POST' }),
    me: () => fetchAPI('/auth/me'),
  },

  bills: {
    list: (params?: { search?: string; limit?: number; offset?: number }) => {
      const query = new URLSearchParams();
      if (params?.search) query.set('search', params.search);
      if (params?.limit) query.set('limit', String(params.limit));
      if (params?.offset) query.set('offset', String(params.offset));
      const qs = query.toString();
      return fetchAPI(`/bills${qs ? `?${qs}` : ''}`);
    },
    get: (id: number) => fetchAPI(`/bills/${id}`),
    create: (data: any) =>
      fetchAPI('/bills', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    search: (q: string) => fetchAPI(`/bills/search?q=${encodeURIComponent(q)}`),
  },
};
