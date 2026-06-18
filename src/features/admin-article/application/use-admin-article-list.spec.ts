// src/features/admin-article/application/use-admin-article-list.spec.ts

import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  fetchAllArticles,
  publishArticle,
  unpublishArticle,
  deleteArticle,
  setTopArticle,
} from '../infrastructure/admin-article-api';
import { mapDTOToListItem } from '../infrastructure/mapper';

import { useAdminArticleList } from './use-admin-article-list';

vi.mock('../infrastructure/admin-article-api');
vi.mock('../infrastructure/mapper');

const mockFetchAllArticles = vi.mocked(fetchAllArticles);
const mockPublishArticle = vi.mocked(publishArticle);
const mockUnpublishArticle = vi.mocked(unpublishArticle);
const mockDeleteArticle = vi.mocked(deleteArticle);
const mockSetTopArticle = vi.mocked(setTopArticle);
const mockMapDTOToListItem = vi.mocked(mapDTOToListItem);

const fakeDTO = {
  id: 'a1',
  title: '测试文章',
  content: '正文',
  summary: null,
  coverImageUrl: null,
  status: 'DRAFT' as const,
  isTop: false,
  publishedAt: null,
  viewCount: 0,
  likeCount: 0,
  commentCount: 0,
  categoryId: null,
  categoryName: null,
  tags: [],
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

const fakeListItem = {
  id: 'a1',
  title: '测试文章',
  status: 'DRAFT' as const,
  isTop: false,
  publishedAt: null,
  viewCount: 0,
  likeCount: 0,
  commentCount: 0,
  categoryName: null,
  tags: [],
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

describe('useAdminArticleList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMapDTOToListItem.mockReturnValue(fakeListItem);
  });

  it('初始加载应自动请求文章列表', async () => {
    mockFetchAllArticles.mockResolvedValue({
      items: [fakeDTO],
      total: 1,
      page: 1,
      pageSize: 10,
    });

    const { result } = renderHook(() => useAdminArticleList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockFetchAllArticles).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      status: undefined,
    });
    expect(result.current.items).toEqual([fakeListItem]);
    expect(result.current.total).toBe(1);
  });

  it('加载失败应设置 error', async () => {
    mockFetchAllArticles.mockRejectedValue(new Error('服务器错误'));

    const { result } = renderHook(() => useAdminArticleList());

    await waitFor(() => {
      expect(result.current.error).toBe('服务器错误');
    });
    expect(result.current.loading).toBe(false);
  });

  it('非 Error 对象应使用默认错误消息', async () => {
    mockFetchAllArticles.mockRejectedValue('unknown');

    const { result } = renderHook(() => useAdminArticleList());

    await waitFor(() => {
      expect(result.current.error).toBe('加载文章列表失败');
    });
  });

  it('setPage 应触发重新加载', async () => {
    mockFetchAllArticles
      .mockResolvedValueOnce({
        items: [fakeDTO],
        total: 5,
        page: 1,
        pageSize: 10,
      })
      .mockResolvedValueOnce({
        items: [fakeDTO],
        total: 5,
        page: 2,
        pageSize: 10,
      });

    const { result } = renderHook(() => useAdminArticleList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    vi.clearAllMocks();

    await act(async () => {
      result.current.setPage(2);
    });

    await waitFor(() => {
      expect(mockFetchAllArticles).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2 }),
      );
    });
  });

  it('setStatusFilter 应重置 page 为 1', async () => {
    mockFetchAllArticles
      .mockResolvedValueOnce({
        items: [fakeDTO],
        total: 5,
        page: 1,
        pageSize: 10,
      })
      .mockResolvedValueOnce({
        items: [fakeDTO],
        total: 5,
        page: 2,
        pageSize: 10,
      });

    const { result } = renderHook(() => useAdminArticleList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // 先翻到第2页
    await act(async () => {
      result.current.setPage(2);
    });

    await waitFor(() => {
      expect(result.current.page).toBe(2);
    });

    // setStatusFilter 应重置 page 为 1
    await act(async () => {
      result.current.setStatusFilter('PUBLISHED');
    });

    expect(result.current.page).toBe(1);
  });

  it('status 参数变化应触发重新加载', async () => {
    mockFetchAllArticles.mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      pageSize: 10,
    });

    const { result, rerender } = renderHook(
      ({ status }) => useAdminArticleList({ status }),
      { initialProps: { status: undefined as string | undefined } },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    vi.clearAllMocks();

    rerender({ status: 'DRAFT' });

    await waitFor(() => {
      expect(mockFetchAllArticles).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'DRAFT' }),
      );
    });
  });

  it('doPublish 应调用 API 并重新加载', async () => {
    mockFetchAllArticles.mockResolvedValue({
      items: [fakeDTO],
      total: 1,
      page: 1,
      pageSize: 10,
    });
    mockPublishArticle.mockResolvedValue({ ...fakeDTO, status: 'PUBLISHED' });

    const { result } = renderHook(() => useAdminArticleList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    vi.clearAllMocks();

    await act(async () => {
      await result.current.doPublish('a1');
    });

    expect(mockPublishArticle).toHaveBeenCalledWith('a1');
    expect(mockFetchAllArticles).toHaveBeenCalled();
  });

  it('doDelete 应调用 API 并重新加载', async () => {
    mockFetchAllArticles.mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      pageSize: 10,
    });
    mockDeleteArticle.mockResolvedValue({ deleted: true, id: 'a1' });

    const { result } = renderHook(() => useAdminArticleList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    vi.clearAllMocks();

    await act(async () => {
      await result.current.doDelete('a1');
    });

    expect(mockDeleteArticle).toHaveBeenCalledWith('a1');
    expect(mockFetchAllArticles).toHaveBeenCalled();
  });

  it('doSetTop 应调用 API 并重新加载', async () => {
    mockFetchAllArticles.mockResolvedValue({
      items: [fakeDTO],
      total: 1,
      page: 1,
      pageSize: 10,
    });
    mockSetTopArticle.mockResolvedValue({ ...fakeDTO, isTop: true });

    const { result } = renderHook(() => useAdminArticleList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    vi.clearAllMocks();

    await act(async () => {
      await result.current.doSetTop('a1', true);
    });

    expect(mockSetTopArticle).toHaveBeenCalledWith('a1', true);
    expect(mockFetchAllArticles).toHaveBeenCalled();
  });

  it('竞态保护：旧请求完成应被忽略', async () => {
    let resolveFirst: (value: unknown) => void;
    const firstPromise = new Promise((resolve) => { resolveFirst = resolve; });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockFetchAllArticles
      .mockImplementationOnce(() => firstPromise as any)
      .mockResolvedValueOnce({
        items: [fakeDTO],
        total: 1,
        page: 1,
        pageSize: 10,
      });

    const { result, rerender } = renderHook(
      ({ status }) => useAdminArticleList({ status }),
      { initialProps: { status: undefined as string | undefined } },
    );

    await waitFor(() => expect(result.current.loading).toBe(true));

    rerender({ status: 'PUBLISHED' });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const itemsBefore = result.current.items;

    mockMapDTOToListItem.mockReturnValue({ ...fakeListItem, id: 'old' });
    await act(async () => {
      resolveFirst!({
        items: [fakeDTO],
        total: 1,
        page: 1,
        pageSize: 10,
      });
    });

    expect(result.current.items).toEqual(itemsBefore);
  });
});
