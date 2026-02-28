'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { forgotPassword, resetPassword } from '@/lib/auth';

interface AuthModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ onClose, onSuccess, initialMode = 'login' }: AuthModalProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      setResetCode(code);
      setMode('reset');
      setSuccess('检测到重置验证码，请设置新密码。');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        onSuccess?.();
        onClose();
      } else {
        if (mode === 'register') {
          if (!username.trim()) {
            setError('请输入用户名');
            setIsLoading(false);
            return;
          }
          await register(username, email, password);
          onSuccess?.();
          onClose();
          return;
        }

        if (mode === 'forgot') {
          await forgotPassword(email);
          setSuccess('重置邮件已发送，请查看邮箱（含垃圾邮件）。');
          setMode('reset');
          return;
        }

        if (!resetCode.trim()) {
          setError('请输入重置验证码（code）');
          setIsLoading(false);
          return;
        }

        if (password.length < 6) {
          setError('新密码长度至少 6 位');
          setIsLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setError('两次输入的密码不一致');
          setIsLoading(false);
          return;
        }

        const data = await resetPassword(resetCode.trim(), password, confirmPassword);
        await login(data.user.email, password);
        setSuccess('密码重置成功，已自动登录。');
        onSuccess?.();
        onClose();
        return;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'login'
              ? '登录账户'
              : mode === 'register'
                ? '创建账户'
                : mode === 'forgot'
                  ? '忘记密码'
                  : '重置密码'}
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            {mode === 'login'
              ? '登录后可保存评估记录'
              : mode === 'register'
                ? '注册后即可开始评估并保存历史'
                : mode === 'forgot'
                  ? '输入注册邮箱，我们会发送重置链接'
                  : '输入验证码并设置新密码'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-400 bg-white"
              />
            </div>
          )}

          {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入邮箱"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-400 bg-white"
              />
            </div>
          )}

          {(mode === 'login' || mode === 'register' || mode === 'reset') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {mode === 'reset' ? '新密码' : '密码'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'reset' ? '请输入新密码' : '请输入密码'}
                required
                minLength={6}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-400 bg-white"
              />
            </div>
          )}

          {mode === 'reset' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">重置验证码（code）</label>
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="请粘贴邮件里的 code"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-400 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">确认新密码</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入新密码"
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-400 bg-white"
                />
              </div>
            </>
          )}

          {mode === 'login' && (
            <div className="text-right -mt-1">
              <button
                type="button"
                onClick={() => {
                  setMode('forgot');
                  setError('');
                  setSuccess('');
                  setPassword('');
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                忘记密码？
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-sm text-green-700">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {isLoading
              ? '处理中...'
              : mode === 'login'
                ? '登录'
                : mode === 'register'
                  ? '注册'
                  : mode === 'forgot'
                    ? '发送重置邮件'
                    : '重置并登录'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          {mode === 'login' ? (
            <>
              还没有账户？{' '}
              <button
                onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                立即注册
              </button>
            </>
          ) : mode === 'register' ? (
            <>
              已有账户？{' '}
              <button
                onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                立即登录
              </button>
            </>
          ) : (
            <>
              返回{' '}
              <button
                onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                登录
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
