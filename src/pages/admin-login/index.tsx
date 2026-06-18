// src/pages/admin-login/index.tsx

import { App } from 'antd';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { LoginForm, useAuth } from '@/features/admin-auth';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { state, login } = useAuth();

  const handleLogin = useCallback(
    async (loginName: string, loginPassword: string) => {
      try {
        await login(loginName, loginPassword);
        message.success('登录成功');
        navigate('/admin');
      } catch {
        // error 已由 authReducer 处理，LoginForm 通过 state.error 展示
      }
    },
    [login, navigate, message],
  );

  const authError = state.status === 'failed' ? state.error : null;

  return (
    <LoginForm
      loading={state.status === 'logging-in'}
      onLogin={handleLogin}
      error={authError}
    />
  );
}
