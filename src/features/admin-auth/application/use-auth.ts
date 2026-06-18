// src/features/admin-auth/application/use-auth.ts

import { useCallback, useEffect, useReducer } from 'react';

import { configureGraphQLRuntime } from '@/shared/graphql';

import { authReducer, initialAuthState } from './auth-state';
import { loginWithPassword } from '../infrastructure/auth-api';
import { clearTokens, getAccessToken, getAccountId, getRole, setAuthInfo, setTokens } from '../infrastructure/token-storage';

export function useAuth() {
  const [state, dispatch] = useReducer(authReducer, initialAuthState, () => {
    const token = getAccessToken();
    if (token) {
      const accountId = getAccountId() ?? 0;
      const role = getRole() ?? 'ADMIN';
      return { status: 'authenticated' as const, accountId, role };
    }
    return initialAuthState;
  });

  useEffect(() => {
    configureGraphQLRuntime({
      getAccessToken,
      onAuthFailure: () => {
        clearTokens();
        dispatch({ type: 'LOGOUT' });
      },
    });
  }, []);

  const login = useCallback(async (loginName: string, loginPassword: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const result = await loginWithPassword({ loginName, loginPassword });
      setTokens(result.accessToken, result.refreshToken);
      setAuthInfo(result.accountId, result.role);
      dispatch({ type: 'LOGIN_SUCCESS', accountId: result.accountId, role: result.role });
    } catch (err) {
      const message = err instanceof Error ? err.message : '登录失败';
      dispatch({ type: 'LOGIN_FAILURE', error: message });
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    dispatch({ type: 'LOGOUT' });
  }, []);

  return { state, login, logout };
}
