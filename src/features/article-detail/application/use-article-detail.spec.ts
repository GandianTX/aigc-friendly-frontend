// src/features/article-detail/application/use-article-detail.spec.ts

import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { mapArticleDTOToArticle, mapPrevNextArticleDTO } from '../infrastructure/mapper';
import { fetchArticleById, fetchPrevNextArticle, incrementViewCount } from '../infrastructure/article-api';
import { useArticleDetail } from './use-article-detail';

vi.mock('../infrastructure/article-api');
vi.mock('../infrastructure/mapper', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../infrastructure/mapper')>();
  return {
    ...actual,
    mapArticleDTOToArticle: vi.fn(),
    mapPrevNextArticleDTO: vi.fn(),
  };
});

const mockFetchArticleById = vi.mocked(fetchArticleById);
const mockFetchPrevNextArticle = vi.mocked(fetchPrevNextArticle);
const mockIncrementViewCount = vi.mocked(incrementViewCount);
const mockMapArticleDTOToArticle = vi.mocked(mapArticleDTOToArticle);
const mockMapPrevNextArticleDTO = vi.mocked(mapPrevNextArticleDTO);

const fakeArticle = {
  id: 'a1',
  title: '测试文章',
  content: '正文',
  summary: '摘要',
  coverImageUrl: null,
  status: 'PUBLISHED' as const,
  isTop: false,
  publishedAt: '2024-06-01',
  viewCount: 10,
  likeCount: 5,
  commentCount: 2,
  categoryId: null,
  categoryName: null,
  tags: [],
  createdAt: '2024-01-01',
  updatedAt: '2024-06-01',
};

const fakePrevNext = {
  prev: { ...fakeArticle, id: 'prev-1', title: '上一篇' },
  next: { ...fakeArticle, id: 'next-1', title: '下一篇' },
};

describe('useArticleDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMapArticleDTOToArticle.mockReturnValue(fakeArticle as ReturnType<typeof mapArticleDTOToArticle>);
    mockMapPrevNextArticleDTO.mockReturnValue(fakePrevNext as ReturnType<typeof mapPrevNextArticleDTO>);
    mockIncrementViewCount.mockResolvedValue(true);
  });

  it('articleId 为 undefined 时不应请求', () => {
    renderHook(() => useArticleDetail(undefined));

    expect(mockFetchArticleById).not.toHaveBeenCalled();
  });

  it('应该加载文章详情和上下篇', async () => {
    mockFetchArticleById.mockResolvedValue({} as Awaited<ReturnType<typeof fetchArticleById>>);
    mockFetchPrevNextArticle.mockResolvedValue({} as Awaited<ReturnType<typeof fetchPrevNextArticle>>);

    const { result } = renderHook(() => useArticleDetail('a1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockFetchArticleById).toHaveBeenCalledWith('a1');
    expect(mockFetchPrevNextArticle).toHaveBeenCalledWith('a1');
    expect(result.current.article).toEqual(fakeArticle);
    expect(result.current.prevArticle).toEqual(fakePrevNext.prev);
    expect(result.current.nextArticle).toEqual(fakePrevNext.next);
    expect(result.current.error).toBeNull();
  });

  it('文章不存在时应设置错误', async () => {
    mockFetchArticleById.mockResolvedValue(null);

    const { result } = renderHook(() => useArticleDetail('nonexistent'));

    await waitFor(() => {
      expect(result.current.error).toBe('文章不存在');
    });
    expect(result.current.article).toBeNull();
  });

  it('fetchArticleById 失败应设置错误', async () => {
    mockFetchArticleById.mockRejectedValue(new Error('网络错误'));

    const { result } = renderHook(() => useArticleDetail('a1'));

    await waitFor(() => {
      expect(result.current.error).toBe('网络错误');
    });
    expect(result.current.loading).toBe(false);
  });

  it('非 Error 对象应使用默认错误消息', async () => {
    mockFetchArticleById.mockRejectedValue('unknown');

    const { result } = renderHook(() => useArticleDetail('a1'));

    await waitFor(() => {
      expect(result.current.error).toBe('加载文章失败');
    });
  });

  it('prevNextArticle 失败不应阻塞主内容', async () => {
    mockFetchArticleById.mockResolvedValue({} as Awaited<ReturnType<typeof fetchArticleById>>);
    mockFetchPrevNextArticle.mockRejectedValue(new Error('上下篇查询失败'));

    const { result } = renderHook(() => useArticleDetail('a1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // 主内容应正常显示
    expect(result.current.article).toEqual(fakeArticle);
    // 上下篇应为 null（mapper 未被调用）
    expect(result.current.prevArticle).toBeNull();
    expect(result.current.nextArticle).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('incrementViewCount 应被调用但失败不影响结果', async () => {
    mockFetchArticleById.mockResolvedValue({} as Awaited<ReturnType<typeof fetchArticleById>>);
    mockFetchPrevNextArticle.mockResolvedValue({} as Awaited<ReturnType<typeof fetchPrevNextArticle>>);
    mockIncrementViewCount.mockRejectedValue(new Error('计数失败'));

    const { result } = renderHook(() => useArticleDetail('a1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockIncrementViewCount).toHaveBeenCalledWith('a1');
    expect(result.current.article).toEqual(fakeArticle);
  });

  it('articleId 变化应重新加载', async () => {
    mockFetchArticleById.mockResolvedValue({} as Awaited<ReturnType<typeof fetchArticleById>>);
    mockFetchPrevNextArticle.mockResolvedValue({} as Awaited<ReturnType<typeof fetchPrevNextArticle>>);

    const { result, rerender } = renderHook(
      ({ id }) => useArticleDetail(id),
      { initialProps: { id: 'a1' } },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    vi.clearAllMocks();
    mockMapArticleDTOToArticle.mockReturnValue({ ...fakeArticle, id: 'a2' } as ReturnType<typeof mapArticleDTOToArticle>);

    rerender({ id: 'a2' });

    await waitFor(() => {
      expect(mockFetchArticleById).toHaveBeenCalledWith('a2');
    });
  });
});
