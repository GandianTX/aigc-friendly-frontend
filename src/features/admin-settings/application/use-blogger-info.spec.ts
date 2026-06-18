// src/features/admin-settings/application/use-blogger-info.spec.ts

import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchBloggerInfo, updateBloggerInfo } from '../infrastructure/admin-settings-api';

import { useBloggerInfo } from './use-blogger-info';

vi.mock('../infrastructure/admin-settings-api');

const mockFetchBloggerInfo = vi.mocked(fetchBloggerInfo);
const mockUpdateBloggerInfo = vi.mocked(updateBloggerInfo);

const fakeInfo = {
  nickname: '博主',
  avatarUrl: 'https://example.com/avatar.jpg',
  bio: '个人简介',
};

describe('useBloggerInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('初始加载应自动请求博主信息', async () => {
    mockFetchBloggerInfo.mockResolvedValue(fakeInfo);

    const { result } = renderHook(() => useBloggerInfo());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockFetchBloggerInfo).toHaveBeenCalled();
    expect(result.current.info).toEqual(fakeInfo);
  });

  it('加载失败应保留 info 为 null 且 loading 为 false', async () => {
    mockFetchBloggerInfo.mockRejectedValue(new Error('网络错误'));

    const { result } = renderHook(() => useBloggerInfo());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.info).toBeNull();
  });

  it('doUpdate 应调用 API 并重新加载', async () => {
    mockFetchBloggerInfo.mockResolvedValue(fakeInfo);
    const updatedInfo = { ...fakeInfo, nickname: '新博主' };
    mockUpdateBloggerInfo.mockResolvedValue(updatedInfo);

    const { result } = renderHook(() => useBloggerInfo());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    vi.clearAllMocks();
    mockFetchBloggerInfo.mockResolvedValue(updatedInfo);

    const input = { nickname: '新博主', bio: '新简介' };
    await act(async () => {
      await result.current.doUpdate(input);
    });

    expect(mockUpdateBloggerInfo).toHaveBeenCalledWith(input);
    expect(mockFetchBloggerInfo).toHaveBeenCalled();
  });

  it('doUpdate 失败应抛出异常', async () => {
    mockFetchBloggerInfo.mockResolvedValue(fakeInfo);
    mockUpdateBloggerInfo.mockRejectedValue(new Error('更新失败'));

    const { result } = renderHook(() => useBloggerInfo());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(
      act(async () => {
        await result.current.doUpdate({ nickname: '新' });
      }),
    ).rejects.toThrow('更新失败');
  });

  it('reload 应重新请求数据', async () => {
    mockFetchBloggerInfo.mockResolvedValue(fakeInfo);

    const { result } = renderHook(() => useBloggerInfo());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    vi.clearAllMocks();

    await act(async () => {
      await result.current.reload();
    });

    expect(mockFetchBloggerInfo).toHaveBeenCalled();
  });
});
