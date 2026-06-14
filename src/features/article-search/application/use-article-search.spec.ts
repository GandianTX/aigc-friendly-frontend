// src/features/article-search/application/use-article-search.spec.ts

import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import * as articleApi from '@/entities/article/infrastructure/article-api';
import * as articleMapper from '@/entities/article/infrastructure/mapper';

import { useArticleSearch } from './use-article-search';

vi.mock('@/entities/article/infrastructure/article-api');
vi.mock('@/entities/article/infrastructure/mapper');

const mockSearchArticles = vi.mocked(articleApi.searchArticles);
const mockMapArticlesPageDTO = vi.mocked(articleMapper.mapArticlesPageDTO);

const fakeMappedResult = {
  items: [
    { id: '1', title: 'NestJS 入门', summary: '摘要' },
  ],
  total: 1,
  page: 1,
  pageSize: 10,
};

describe('useArticleSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMapArticlesPageDTO.mockReturnValue(fakeMappedResult as ReturnType<typeof articleMapper.mapArticlesPageDTO>);
  });

  it('初始状态应该为空', () => {
    const { result } = renderHook(() => useArticleSearch());

    expect(result.current.items).toEqual([]);
    expect(result.current.keyword).toBe('');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('search 应该触发搜索并更新结果', async () => {
    mockSearchArticles.mockResolvedValue({} as Awaited<ReturnType<typeof articleApi.searchArticles>>);

    const { result } = renderHook(() => useArticleSearch());

    await act(async () => {
      await result.current.search('NestJS');
    });

    expect(mockSearchArticles).toHaveBeenCalledWith({
      keyword: 'NestJS',
      page: 1,
      pageSize: 10,
    });
    expect(result.current.items).toEqual(fakeMappedResult.items);
    expect(result.current.keyword).toBe('NestJS');
    expect(result.current.loading).toBe(false);
  });

  it('空关键词不应触发搜索', async () => {
    const { result } = renderHook(() => useArticleSearch());

    await act(async () => {
      await result.current.search('   ');
    });

    expect(mockSearchArticles).not.toHaveBeenCalled();
  });

  it('搜索失败应设置 error', async () => {
    mockSearchArticles.mockRejectedValue(new Error('服务器错误'));

    const { result } = renderHook(() => useArticleSearch());

    await act(async () => {
      await result.current.search('test');
    });

    expect(result.current.error).toBe('服务器错误');
    expect(result.current.loading).toBe(false);
  });

  it('非 Error 对象应使用默认错误消息', async () => {
    mockSearchArticles.mockRejectedValue('unknown');

    const { result } = renderHook(() => useArticleSearch());

    await act(async () => {
      await result.current.search('test');
    });

    expect(result.current.error).toBe('搜索失败');
  });

  it('loadPage 应该加载指定页', async () => {
    mockSearchArticles.mockResolvedValue({} as Awaited<ReturnType<typeof articleApi.searchArticles>>);

    const { result } = renderHook(() => useArticleSearch());

    // 先搜索一次，设置 keyword
    await act(async () => {
      await result.current.search('NestJS');
    });

    vi.clearAllMocks();
    mockMapArticlesPageDTO.mockReturnValue({ ...fakeMappedResult, page: 2 } as ReturnType<typeof articleMapper.mapArticlesPageDTO>);

    await act(async () => {
      await result.current.loadPage(2);
    });

    expect(mockSearchArticles).toHaveBeenCalledWith({
      keyword: 'NestJS',
      page: 2,
      pageSize: 10,
    });
  });

  it('loadPage 在无关键词时不应触发请求', async () => {
    const { result } = renderHook(() => useArticleSearch());

    await act(async () => {
      await result.current.loadPage(2);
    });

    expect(mockSearchArticles).not.toHaveBeenCalled();
  });

  it('setKeyword 应该更新 keyword', () => {
    const { result } = renderHook(() => useArticleSearch());

    act(() => {
      result.current.setKeyword('React');
    });

    expect(result.current.keyword).toBe('React');
  });

  it('竞态保护：旧搜索完成应被忽略', async () => {
    let resolveFirst: (value: unknown) => void;
    const firstPromise = new Promise((resolve) => { resolveFirst = resolve; });

    mockSearchArticles
      .mockImplementationOnce(() => firstPromise)
      .mockResolvedValueOnce({} as Awaited<ReturnType<typeof articleApi.searchArticles>>);

    const { result } = renderHook(() => useArticleSearch());

    // 发起第一次搜索
    act(() => {
      result.current.search('旧关键词');
    });

    // 发起第二次搜索
    await act(async () => {
      await result.current.search('新关键词');
    });

    // 第一个请求完成，但应该被忽略
    mockMapArticlesPageDTO.mockReturnValue({ ...fakeMappedResult, items: [{ id: 'old', title: '旧数据' }] } as ReturnType<typeof articleMapper.mapArticlesPageDTO>);
    await act(async () => {
      resolveFirst!({});
    });

    // 结果应该是第二次搜索的数据
    expect(result.current.keyword).toBe('新关键词');
  });
});
