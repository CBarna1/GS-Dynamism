// src/utils/authToken.ts
// One place that knows where session tokens live and what role they carry.

export type Role = 'admin' | 'mentor' | 'mentee';

export const TOKEN_KEYS: Record<Role, string> = {
  admin: 'admin_token',
  mentor: 'mentor_token',
  mentee: 'mentee_token',
};

interface TokenPayload {
  id?: number;
  role?: string;
  exp?: number;
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

/**
 * The role a token was actually issued for (from the server-signed payload),
 * or null if the token is unreadable or expired.
 */
export function tokenRole(token: string): Role | null {
  const payload = decodeToken(token);
  if (!payload) return null;
  if (payload.exp && payload.exp * 1000 < Date.now()) return null;
  return payload.role === 'admin' || payload.role === 'mentor' || payload.role === 'mentee'
    ? payload.role
    : null;
}

export function clearStoredTokens() {
  Object.values(TOKEN_KEYS).forEach((key) => localStorage.removeItem(key));
}

/**
 * Find the stored session, discarding any token kept under the wrong key
 * (e.g. a mentor token saved as admin_token) or that has expired.
 */
export function getStoredSession(): { token: string; role: Role } | null {
  let session: { token: string; role: Role } | null = null;

  (Object.keys(TOKEN_KEYS) as Role[]).forEach((keyRole) => {
    const key = TOKEN_KEYS[keyRole];
    const token = localStorage.getItem(key);
    if (!token) return;

    if (tokenRole(token) !== keyRole) {
      localStorage.removeItem(key);
      return;
    }
    if (!session) session = { token, role: keyRole };
  });

  return session;
}
