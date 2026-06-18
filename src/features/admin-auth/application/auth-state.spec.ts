// src/features/admin-auth/application/auth-state.spec.ts

import { describe, expect, it } from 'vitest';

import { authReducer, initialAuthState } from './auth-state';
import type { AuthAction, AuthState } from './auth-state';

describe('authReducer', () => {
  it('初始状态应为 idle', () => {
    expect(initialAuthState).toEqual({ status: 'idle' });
  });

  it('LOGIN_START 应将状态转为 logging-in', () => {
    const next = authReducer({ status: 'idle' }, { type: 'LOGIN_START' });
    expect(next).toEqual({ status: 'logging-in' });
  });

  it('LOGIN_SUCCESS 应将状态转为 authenticated', () => {
    const next = authReducer({ status: 'logging-in' }, {
      type: 'LOGIN_SUCCESS',
      accountId: 1,
      role: 'ADMIN',
    });
    expect(next).toEqual({ status: 'authenticated', accountId: 1, role: 'ADMIN' });
  });

  it('LOGIN_FAILURE 应将状态转为 failed', () => {
    const next = authReducer({ status: 'logging-in' }, {
      type: 'LOGIN_FAILURE',
      error: '密码错误',
    });
    expect(next).toEqual({ status: 'failed', error: '密码错误' });
  });

  it('LOGOUT 应将状态重置为 idle', () => {
    const next = authReducer({ status: 'authenticated', accountId: 1, role: 'ADMIN' }, {
      type: 'LOGOUT',
    });
    expect(next).toEqual({ status: 'idle' });
  });

  it('LOGOUT 从 failed 状态也应回到 idle', () => {
    const next = authReducer({ status: 'failed', error: 'some error' }, { type: 'LOGOUT' });
    expect(next).toEqual({ status: 'idle' });
  });

  it('未知 action 应返回原状态', () => {
    const state: AuthState = { status: 'authenticated', accountId: 1, role: 'ADMIN' };
    const next = authReducer(state, { type: 'UNKNOWN' } as unknown as AuthAction);
    expect(next).toBe(state);
  });
});
