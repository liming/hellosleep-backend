const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  jwt: string;
  user: AuthUser;
}

export interface AssessmentResult {
  id: number;
  documentId: string;
  answers: Record<string, string>;
  tags: Array<{ name: string; text: string; priority: string }>;
  completedAt: string;
}

const AUTH_TOKEN_KEY = 'hellosleep_jwt';
const AUTH_USER_KEY = 'hellosleep_user';

export function saveAuthToStorage(jwt: string, user: AuthUser) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_TOKEN_KEY, jwt);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearAuthFromStorage() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getStoredAuth(): { jwt: string | null; user: AuthUser | null } {
  if (typeof window === 'undefined') return { jwt: null, user: null };
  const jwt = localStorage.getItem(AUTH_TOKEN_KEY);
  const userStr = localStorage.getItem(AUTH_USER_KEY);
  const user = userStr ? JSON.parse(userStr) : null;
  return { jwt, user };
}

export async function loginWithEmail(identifier: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || '登录失败');
  }
  return res.json();
}

export async function registerWithEmail(
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || '注册失败');
  }
  return res.json();
}

export async function forgotPassword(email: string): Promise<void> {
  const res = await fetch(`${STRAPI_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || '发送重置邮件失败');
  }
}

export async function resetPassword(
  code: string,
  password: string,
  passwordConfirmation: string
): Promise<AuthResponse> {
  const res = await fetch(`${STRAPI_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, password, passwordConfirmation }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || '重置密码失败');
  }

  return res.json();
}

export async function saveAssessmentResult(
  jwt: string,
  answers: Record<string, string>,
  tags: Array<{ name: string; text: string; priority: string }>
): Promise<AssessmentResult | null> {
  const res = await fetch(`${STRAPI_URL}/api/assessment-results`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      data: {
        answers,
        tags,
        completedAt: new Date().toISOString(),
      },
    }),
  });

  if (!res.ok) {
    let message = '保存失败';
    try {
      const err = await res.json();
      message = err?.error?.message || message;
    } catch {
      // ignore
    }
    // In dev/preview, backend schema may be behind (e.g. Invalid key user). Don't block UX.
    console.warn('[assessment] save failed:', message);
    return null;
  }

  const result = await res.json();
  return result.data ?? null;
}

export async function fetchAssessmentHistory(jwt: string): Promise<AssessmentResult[]> {
  const res = await fetch(`${STRAPI_URL}/api/assessment-results`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  if (!res.ok) {
    let message = '获取历史记录失败';
    try {
      const err = await res.json();
      message = err?.error?.message || message;
    } catch {
      // ignore
    }
    console.warn('[assessment] history fetch failed:', message);
    return [];
  }

  const result = await res.json();
  return result.data || [];
}
