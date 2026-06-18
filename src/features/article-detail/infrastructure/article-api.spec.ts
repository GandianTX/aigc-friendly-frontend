// src/features/article-detail/infrastructure/article-api.spec.ts

import { beforeEach,describe, expect, it, vi } from 'vitest';

import type { ArticleDTO, PrevNextArticleDTO } from './dto';

const mockExecuteGraphQL = vi.fn();
vi.mock('@/shared/graphql', () => ({
  executeGraphQL: (...args: unknown[]) => mockExecuteGraphQL(...args),
}));

import { fetchArticleById, fetchPrevNextArticle, incrementViewCount } from './article-api';

const baseArticleDTO: ArticleDTO = {
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
  categoryId: null,
  categoryName: null,
  tags: [],
  createdAt: '2024-01-01',
  updatedAt: '2024-06-01',
};

describe('fetchArticleById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该返回文章 DTO', async () => {
    mockExecuteGraphQL.mockResolvedValue({ articleById: baseArticleDTO });

    const result = await fetchArticleById('a1');

    expect(result).toEqual(baseArticleDTO);
    const [, variables, options] = mockExecuteGraphQL.mock.calls[0];
    expect(variables.id).toBe('a1');
    expect(options.authMode).toBe('none');
  });

  it('文章不存在时应返回 null', async () => {
    mockExecuteGraphQL.mockResolvedValue({ articleById: null });

    const result = await fetchArticleById('nonexistent');

    expect(result).toBeNull();
  });

  it('executeGraphQL 抛错时应向上传播', async () => {
    mockExecuteGraphQL.mockRejectedValue(new Error('网络错误'));

    await expect(fetchArticleById('a1')).rejects.toThrow('网络错误');
  });
});

describe('fetchPrevNextArticle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该返回上下篇 DTO', async () => {
    const fakeResult: PrevNextArticleDTO = {
      prev: { ...baseArticleDTO, id: 'prev-1', title: '上一篇' },
      next: { ...baseArticleDTO, id: 'next-1', title: '下一篇' },
    };
    mockExecuteGraphQL.mockResolvedValue({ prevNextArticle: fakeResult });

    const result = await fetchPrevNextArticle('a1');

    expect(result).toEqual(fakeResult);
    const [, variables] = mockExecuteGraphQL.mock.calls[0];
    expect(variables.articleId).toBe('a1');
  });

  it('无上下篇时 prev/next 应为 null', async () => {
    const fakeResult: PrevNextArticleDTO = { prev: null, next: null };
    mockExecuteGraphQL.mockResolvedValue({ prevNextArticle: fakeResult });

    const result = await fetchPrevNextArticle('a1');

    expect(result.prev).toBeNull();
    expect(result.next).toBeNull();
  });
});

describe('incrementViewCount', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该返回 true', async () => {
    mockExecuteGraphQL.mockResolvedValue({ incrementViewCount: true });

    const result = await incrementViewCount('a1');

    expect(result).toBe(true);
    const [, variables] = mockExecuteGraphQL.mock.calls[0];
    expect(variables.id).toBe('a1');
  });
});
