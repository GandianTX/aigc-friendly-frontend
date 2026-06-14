// src/features/article-archive/application/use-archive-articles.spec.ts

import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import * as articleApi from '@/entities/article/infrastructure/article-api';
import * as articleMapper from '@/entities/article/infrastructure/mapper';

import { useArchiveArticles } from './use-archive-articles';

// Mock API 和 mapper
vi.mock('@/entities/article/infrastructure/article-api');
vi.mock('@/entities/article/infrastructure/mapper');

const mockFetchArticlesByArchive = vi.mocked(articleApi.fetchArticlesByArchive);
const mockMapArticlesPageDTO = vi.mocked(articleMapper.mapArticlesPageDTO);

const fakeMappedResult = {
  items: [
    { id: '1', title: '归档文章A', summary: '摘要A' },
    { id: '2', title: '归档文章B', summary: '摘要B' },
  ],
  total: 2,
  page: 1,
  pageSize: 10,
};

describe('useArchiveArticles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMapArticlesPageDTO.mockReturnValue(fakeMappedResult as ReturnType<typeof articleMapper.mapArticlesPageDTO>);
  });

  it('挂载时应该自动加载第一页数据', async () => {
    mockFetchArticlesByArchive.mockResolvedValue({} as Awaited<ReturnType<typeof articleApi.fetchArticlesByArchive>>);

    const { result } = renderHook(() => useArchiveArticles(2024, 6));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockFetchArticlesByArchive).toHaveBeenCalledWith({
      year: 2024,
      month: 6,
      page: 1,
      pageSize: 10,
    });
    expect(result.current.items).toEqual(fakeMappedResult.items);
    expect(result.current.total).toBe(2);
  });

  it('API 失败时应该设置 error', async () => {
    mockFetchArticlesByArchive.mockRejectedValue(new Error('网络错误'));

    const { result } = renderHook(() => useArchiveArticles(2024, 6));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('网络错误');
  });

  it('非 Error 对象应使用默认错误消息', async () => {
    mockFetchArticlesByArchive.mockRejectedValue('字符串错误');

    const { result } = renderHook(() => useArchiveArticles(2024, 6));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('加载归档文章失败');
  });

  it('loadPage 应该加载指定页', async () => {
    mockFetchArticlesByArchive.mockResolvedValue({} as Awaited<ReturnType<typeof articleApi.fetchArticlesByArchive>>);

    const { result } = renderHook(() => useArchiveArticles(2024, 6));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    vi.clearAllMocks();
    mockMapArticlesPageDTO.mockReturnValue({ ...fakeMappedResult, page: 2 } as ReturnType<typeof articleMapper.mapArticlesPageDTO>);

    await act(async () => {
      await result.current.loadPage(2);
    });

    expect(mockFetchArticlesByArchive).toHaveBeenCalledWith({
      year: 2024,
      month: 6,
      page: 2,
      pageSize: 10,
    });
  });

  it('竞态保护：旧请求完成应被忽略', async () => {
    let resolveFirst: (value: unknown) => void;
    const firstPromise = new Promise((resolve) => { resolveFirst = resolve; });

    mockFetchArticlesByArchive
      .mockImplementationOnce(() => firstPromise)
      .mockResolvedValueOnce({} as Awaited<ReturnType<typeof articleApi.fetchArticlesByArchive>>);

    const { result, rerender } = renderHook(
      ({ year, month }) => useArchiveArticles(year, month),
      { initialProps: { year: 2024, month: 6 } },
    );

    // 触发第二次请求（改变参数导致 useEffect 重新执行）
    rerender({ year: 2024, month: 7 });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // 第二次请求成功后，mapArticlesPageDTO 应被调用 1 次（仅第二次请求）
    expect(mockMapArticlesPageDTO).toHaveBeenCalledTimes(1);

    // 第一个请求完成，但由于竞态保护，mapArticlesPageDTO 不应再被调用
    await act(async () => {
      resolveFirst!({});
    });

    // 仍然是 1 次，旧请求的结果被忽略
    expect(mockMapArticlesPageDTO).toHaveBeenCalledTimes(1);
  });
});
