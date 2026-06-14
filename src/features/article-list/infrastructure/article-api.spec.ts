// src/features/article-list/infrastructure/article-api.spec.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';

import type { ArticlesPageDTO } from './dto';

const mockExecuteGraphQL = vi.fn();
vi.mock('@/shared/graphql', () => ({
  executeGraphQL: (...args: unknown[]) => mockExecuteGraphQL(...args),
  PAGINATION_MODE: { OFFSET: 'OFFSET', CURSOR: 'CURSOR' },
}));

import { fetchPublishedArticles } from './article-api';

const fakeArticleDTO: ArticlesPageDTO['items'][number] = {
  id: 'a1',
  title: '测试文章',
  content: '正文',
  summary: '摘要',
  coverImageUrl: null,
  status: 'PUBLISHED',
  isTop: false,
  publishedAt: '2024-06-01',
  viewCount: 10,
  likeCount: 5,
  commentCount: 2,
  categoryId: 'c1',
  categoryName: '技术',
  tags: [{ id: 't1', name: 'Node.js', slug: 'nodejs' }],
  createdAt: '2024-01-01',
  updatedAt: '2024-06-01',
};

describe('fetchPublishedArticles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该正确传递分页参数并返回结果', async () => {
    const fakeResult: ArticlesPageDTO = {
      items: [fakeArticleDTO],
      total: 1,
      page: 1,
      pageSize: 10,
    };
    mockExecuteGraphQL.mockResolvedValue({ publishedArticles: fakeResult });

    const result = await fetchPublishedArticles({ page: 1, pageSize: 10 });

    expect(result).toEqual(fakeResult);
    const [, variables, options] = mockExecuteGraphQL.mock.calls[0];
    expect(variables.pagination).toEqual({ mode: 'OFFSET', page: 1, pageSize: 10 });
    expect(variables.categoryId).toBeNull();
    expect(variables.tagId).toBeNull();
    expect(options.authMode).toBe('none');
  });

  it('应该传递 categoryId 和 tagId 过滤参数', async () => {
    mockExecuteGraphQL.mockResolvedValue({
      publishedArticles: { items: [], total: 0, page: 1, pageSize: 10 },
    });

    await fetchPublishedArticles({ page: 1, pageSize: 10, categoryId: 'cat-1', tagId: 'tag-1' });

    const [, variables] = mockExecuteGraphQL.mock.calls[0];
    expect(variables.categoryId).toBe('cat-1');
    expect(variables.tagId).toBe('tag-1');
  });

  it('executeGraphQL 抛错时应向上传播', async () => {
    mockExecuteGraphQL.mockRejectedValue(new Error('网络错误'));

    await expect(fetchPublishedArticles({ page: 1, pageSize: 10 })).rejects.toThrow('网络错误');
  });
});
