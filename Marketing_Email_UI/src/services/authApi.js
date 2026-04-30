const BASE_URL = 'http://localhost:3000/api/auth';

async function request(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({ message: res.statusText }));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const authApi = {
  login: (email, password) => request('/login', { email, password }),
  register: (email, password) => request('/register', { email, password }),
};
