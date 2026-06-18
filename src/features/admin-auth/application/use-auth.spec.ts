// src/features/admin-auth/application/use-auth.spec.ts

import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { loginWithPassword } from '../infrastructure/auth-api';
import {
  clearTokens,
  getAccessToken,
  getAccountId,
  getRole,
  setAuthInfo,
  setTokens,
} from '../infrastructure/token-storage';

import { useAuth } from './use-auth';

vi.mock('../infrastructure/auth-api');
vi.mock('../infrastructure/token-storage');
vi.mock('@/shared/graphql', () => ({
  configureGraphQLRuntime: vi.fn(),
}));

const mockLoginWithPassword = vi.mocked(loginWithPassword);
const mockSetTokens = vi.mocked(setTokens);
const mockSetAuthInfo = vi.mocked(setAuthInfo);
const mockClearTokens = vi.mocked(clearTokens);
const mockGetAccessToken = vi.mocked(getAccessToken);
const mockGetAccountId = vi.mocked(getAccountId);
const mockGetRole = vi.mocked(getRole);

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAccessToken.mockReturnValue(null);
    mockGetAccountId.mockReturnValue(null);
    mockGetRole.mockReturnValue(null);
  });

  it('无 token 时初始状态应为 idle', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.state.status).toBe('idle');
  });

  it('有 token 时应从 storage 恢复 authenticated 状态', () => {
    mockGetAccessToken.mockReturnValue('existing-token');
    mockGetAccountId.mockReturnValue(42);
    mockGetRole.mockReturnValue('ADMIN');

    const { result } = renderHook(() => useAuth());
    expect(result.current.state).toEqual({
      status: 'authenticated',
      accountId: 42,
      role: 'ADMIN',
    });
  });

  it('有 token 但无 accountId/role 应使用默认值', () => {
    mockGetAccessToken.mockReturnValue('existing-token');
    mockGetAccountId.mockReturnValue(null);
    mockGetRole.mockReturnValue(null);

    const { result } = renderHook(() => useAuth());
    expect(result.current.state).toEqual({
      status: 'authenticated',
      accountId: 0,
      role: 'ADMIN',
    });
  });

  it('login 成功应持久化 token 并转为 authenticated', async () => {
    mockLoginWithPassword.mockResolvedValue({
      accessToken: 'new-at',
      refreshToken: 'new-rt',
      accountId: 1,
      role: 'ADMIN',
      userInfo: null,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('admin', 'password');
    });

    expect(mockSetTokens).toHaveBeenCalledWith('new-at', 'new-rt');
    expect(mockSetAuthInfo).toHaveBeenCalledWith(1, 'ADMIN');
    expect(result.current.state).toEqual({
      status: 'authenticated',
      accountId: 1,
      role: 'ADMIN',
    });
  });

  it('login 失败应转为 failed 并抛出异常', async () => {
    mockLoginWithPassword.mockRejectedValue(new Error('密码错误'));

    const { result } = renderHook(() => useAuth());

    let error: Error | undefined;
    await act(async () => {
      try {
        await result.current.login('admin', 'wrong');
      } catch (e) {
        error = e as Error;
      }
    });

    expect(error?.message).toBe('密码错误');

    await waitFor(() => {
      expect(result.current.state.status).toBe('failed');
    });
    expect(result.current.state).toHaveProperty('error', '密码错误');
  });

  it('login 失败且非 Error 对象应使用默认错误消息', async () => {
    mockLoginWithPassword.mockRejectedValue('unknown');

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      try {
        await result.current.login('admin', 'wrong');
      } catch {
        // expected
      }
    });

    await waitFor(() => {
      expect(result.current.state.status).toBe('failed');
    });
    expect(result.current.state).toHaveProperty('error', '登录失败');
  });

  it('logout 应清除 token 并转为 idle', () => {
    mockGetAccessToken.mockReturnValue('token');
    mockGetAccountId.mockReturnValue(1);
    mockGetRole.mockReturnValue('ADMIN');

    const { result } = renderHook(() => useAuth());

    expect(result.current.state.status).toBe('authenticated');

    act(() => {
      result.current.logout();
    });

    expect(mockClearTokens).toHaveBeenCalled();
    expect(result.current.state).toEqual({ status: 'idle' });
  });
});
