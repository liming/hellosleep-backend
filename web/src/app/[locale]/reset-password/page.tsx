'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginWithEmail, resetPassword, saveAuthToStorage } from '@/lib/auth';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [code, setCode] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const c = new URLSearchParams(window.location.search).get('code') || '';
    setCode(c);
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!code) {
      setError('重置链接无效：缺少 code 参数。');
      return;
    }

    if (password.length < 6) {
      setError('新密码至少 6 位。');
      return;
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致。');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(code, password, confirmPassword);

      // Auto login for better UX when email is provided.
      if (email.trim()) {
        const auth = await loginWithEmail(email.trim(), password);
        saveAuthToStorage(auth.jwt, auth.user);
      }

      setSuccess('密码已重置成功。正在跳转...');
      setTimeout(() => {
        router.replace('/assessment');
      }, 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : '重置失败，请稍后重试。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">重置密码</h1>
        <p className="text-sm text-gray-600 mb-6">请输入新密码以完成重置。若填写邮箱，将自动登录。</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">邮箱（可选，用于自动登录）</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">新密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">确认新密码</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">{error}</div>}
          {success && <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-2.5">{success}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg"
          >
            {isLoading ? '处理中...' : '确认重置'}
          </button>
        </form>
      </div>
    </main>
  );
}
