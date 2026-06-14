// src/features/article-list/application/use-article-list.spec.ts

import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { mapArticlesPageDTO } from '../infrastructure/mapper';
import { fetchPublishedArticles } from '../infrastructure/article-api';
import { useArticleList } from './use-article-list';

vi.mock('../infrastructure/article-api');
vi.mock('../infrastructure/mapper', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../infrastructure/mapper')>();
  return {
    ...actual,
    mapArticlesPageDTO: vi.fn(),
  };
});

const mockFetchPublishedArticles = vi.mocked(fetchPublishedArticles);
const mockMapArticlesPageDTO = vi.mocked(mapArticlesPageDTO);

const fakeMappedResult = {
  items: [{ id: '1', title: '文章1', summary: '摘要1' }],
  total: 1,
  page: 1,
  pageSize: 10,
};

describe('useArticleList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMapArticlesPageDTO.mockReturnValue(fakeMappedResult as ReturnType<typeof mapArticlesPageDTO>);
  });

  it('初始加载应自动请求文章列表', async () => {
    mockFetchPublishedArticles.mockResolvedValue({} as Awaited<ReturnType<typeof fetchPublishedArticles>>);

    const { result } = renderHook(() => useArticleList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockFetchPublishedArticles).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      categoryId: undefined,
      tagId: undefined,
    });
    expect(result.current.items).toEqual(fakeMappedResult.items);
    expect(result.current.total).toBe(1);
  });

  it('加载失败应设置 error', async () => {
    mockFetchPublishedArticles.mockRejectedValue(new Error('服务器错误'));

    const { result } = renderHook(() => useArticleList());

    await waitFor(() => {
      expect(result.current.error).toBe('服务器错误');
    });
    expect(result.current.loading).toBe(false);
  });

  it('非 Error 对象应使用默认错误消息', async () => {
    mockFetchPublishedArticles.mockRejectedValue('unknown');

    const { result } = renderHook(() => useArticleList());

    await waitFor(() => {
      expect(result.current.error).toBe('加载文章列表失败');
    });
  });

  it('setPage 应触发重新加载', async () => {
    mockFetchPublishedArticles.mockResolvedValue({} as Awaited<ReturnType<typeof fetchPublishedArticles>>);

    const { result } = renderHook(() => useArticleList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    vi.clearAllMocks();
    mockMapArticlesPageDTO.mockReturnValue({ ...fakeMappedResult, page: 2 } as ReturnType<typeof mapArticlesPageDTO>);

    await act(async () => {
      result.current.setPage(2);
    });

    await waitFor(() => {
      expect(mockFetchPublishedArticles).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2 }),
      );
    });
  });

  it('categoryId 变化应触发重新加载', async () => {
    mockFetchPublishedArticles.mockResolvedValue({} as Awaited<ReturnType<typeof fetchPublishedArticles>>);

    const { result, rerender } = renderHook(
      ({ categoryId }) => useArticleList({ categoryId: categoryId as string | undefined }),
      { initialProps: { categoryId: undefined as string | undefined } },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    vi.clearAllMocks();

    rerender({ categoryId: 'cat-1' });

    await waitFor(() => {
      expect(mockFetchPublishedArticles).toHaveBeenCalledWith(
        expect.objectContaining({ categoryId: 'cat-1' }),
      );
    });
  });

  it('竞态保护：旧请求完成应被忽略', async () => {
    let resolveFirst: (value: unknown) => void;
    const firstPromise = new Promise((resolve) => { resolveFirst = resolve; });

    mockFetchPublishedArticles
      .mockImplementationOnce(() => firstPromise)
      .mockResolvedValueOnce({} as Awaited<ReturnType<typeof fetchPublishedArticles>>);

    const { result, rerender } = renderHook(
      ({ tagId }) => useArticleList({ tagId: tagId as string | undefined }),
      { initialProps: { tagId: undefined as string | undefined } },
    );

    await waitFor(() => expect(result.current.loading).toBe(true));

    rerender({ tagId: 'tag-new' });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    mockMapArticlesPageDTO.mockReturnValue({ ...fakeMappedResult, items: [{ id: 'old' }] } as ReturnType<typeof mapArticlesPageDTO>);
    await act(async () => {
      resolveFirst!({});
    });

    // 旧请求结果被忽略，items 不应是 old
    expect(result.current.items).not.toEqual([{ id: 'old' }]);
  });
});
