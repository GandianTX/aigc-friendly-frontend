// src/features/article-search/infrastructure/article-search-api.spec.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';

import type { ArticlesPageDTO } from '@/entities/article';

// Mock executeGraphQL before importing the module under test
const mockExecuteGraphQL = vi.fn();
vi.mock('@/shared/graphql', () => ({
  executeGraphQL: (...args: unknown[]) => mockExecuteGraphQL(...args),
  PAGINATION_MODE: { OFFSET: 'OFFSET', CURSOR: 'CURSOR' },
}));

import { searchArticles } from './article-search-api';

describe('article-search-api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该正确传递搜索参数并返回结果', async () => {
    const fakeResult: ArticlesPageDTO = {
      items: [
        {
          id: 'a1',
          title: 'NestJS 入门',
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
        },
      ],
      total: 1,
      page: 1,
      pageSize: 10,
    };

    mockExecuteGraphQL.mockResolvedValue({ searchArticles: fakeResult });

    const result = await searchArticles({ keyword: 'NestJS', page: 1, pageSize: 10 });

    expect(result).toEqual(fakeResult);
    expect(mockExecuteGraphQL).toHaveBeenCalledTimes(1);

    const [, variables, options] = mockExecuteGraphQL.mock.calls[0];
    expect(variables.keyword).toBe('NestJS');
    expect(variables.pagination).toEqual({
      mode: 'OFFSET',
      page: 1,
      pageSize: 10,
    });
    expect(options.authMode).toBe('none');
  });

  it('executeGraphQL 抛错时应向上传播', async () => {
    mockExecuteGraphQL.mockRejectedValue(new Error('网络错误'));

    await expect(searchArticles({ keyword: 'test', page: 1, pageSize: 10 })).rejects.toThrow(
      '网络错误',
    );
  });
});
