// src/features/admin-auth/infrastructure/token-storage.ts

const ACCESS_TOKEN_KEY = 'admin_access_token';
const REFRESH_TOKEN_KEY = 'admin_refresh_token';
const ACCOUNT_ID_KEY = 'admin_account_id';
const ROLE_KEY = 'admin_role';

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getAccountId(): number | null {
  const raw = localStorage.getItem(ACCOUNT_ID_KEY);
  return raw ? Number(raw) : null;
}

export function getRole(): string | null {
  return localStorage.getItem(ROLE_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function setAuthInfo(accountId: number, role: string): void {
  localStorage.setItem(ACCOUNT_ID_KEY, String(accountId));
  localStorage.setItem(ROLE_KEY, role);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ACCOUNT_ID_KEY);
  localStorage.removeItem(ROLE_KEY);
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}
