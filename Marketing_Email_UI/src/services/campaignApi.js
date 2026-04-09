const BASE_URL = 'http://localhost:3000/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    const err = new Error(error.message || 'Request failed');
    err.errors = error.errors ?? null;
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
}

export const campaignApi = {
  getAll: () => request('/campaigns'),
  create: (data) => request('/campaigns', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/campaigns/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => request(`/campaigns/${id}`, { method: 'DELETE' }),
};
