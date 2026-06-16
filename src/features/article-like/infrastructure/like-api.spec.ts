// src/features/article-like/infrastructure/like-api.spec.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockExecuteGraphQL = vi.fn();
vi.mock('@/shared/graphql', () => ({
  executeGraphQL: (...args: unknown[]) => mockExecuteGraphQL(...args),
}));

import {
  toggleArticleLike,
  fetchArticleLikeCount,
  fetchIsArticleLiked,
  generateFingerprint,
} from './like-api';

describe('toggleArticleLike', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('点赞成功应返回 isLiked=true 和 likeCount', async () => {
    mockExecuteGraphQL.mockResolvedValue({
      toggleArticleLike: { isLiked: true, likeCount: 6 },
    });

    const result = await toggleArticleLike('a1', 'fp1');

    expect(result).toEqual({ isLiked: true, likeCount: 6 });
    const [, variables, options] = mockExecuteGraphQL.mock.calls[0];
    expect(variables.input).toEqual({ articleId: 'a1', fingerprint: 'fp1' });
    expect(options.authMode).toBe('none');
  });

  it('取消点赞应返回 isLiked=false', async () => {
    mockExecuteGraphQL.mockResolvedValue({
      toggleArticleLike: { isLiked: false, likeCount: 4 },
    });

    const result = await toggleArticleLike('a1', 'fp1');

    expect(result.isLiked).toBe(false);
  });

  it('executeGraphQL 抛错时应向上传播', async () => {
    mockExecuteGraphQL.mockRejectedValue(new Error('网络错误'));

    await expect(toggleArticleLike('a1', 'fp1')).rejects.toThrow('网络错误');
  });
});

describe('fetchArticleLikeCount', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应返回文章点赞数', async () => {
    mockExecuteGraphQL.mockResolvedValue({ articleLikeCount: 5 });

    const result = await fetchArticleLikeCount('a1');

    expect(result).toBe(5);
    const [, variables, options] = mockExecuteGraphQL.mock.calls[0];
    expect(variables.articleId).toBe('a1');
    expect(options.authMode).toBe('none');
  });

  it('无点赞应返回 0', async () => {
    mockExecuteGraphQL.mockResolvedValue({ articleLikeCount: 0 });

    const result = await fetchArticleLikeCount('a1');

    expect(result).toBe(0);
  });
});

describe('fetchIsArticleLiked', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('已点赞应返回 true', async () => {
    mockExecuteGraphQL.mockResolvedValue({ isArticleLiked: true });

    const result = await fetchIsArticleLiked('a1', 'fp1');

    expect(result).toBe(true);
    const [, variables] = mockExecuteGraphQL.mock.calls[0];
    expect(variables.articleId).toBe('a1');
    expect(variables.fingerprint).toBe('fp1');
  });

  it('未点赞应返回 false', async () => {
    mockExecuteGraphQL.mockResolvedValue({ isArticleLiked: false });

    const result = await fetchIsArticleLiked('a1', 'fp1');

    expect(result).toBe(false);
  });
});

describe('generateFingerprint', () => {
  it('应返回非空字符串', () => {
    const fp = generateFingerprint();
    expect(fp).toBeTruthy();
    expect(typeof fp).toBe('string');
  });

  it('同一环境多次调用应返回相同指纹', () => {
    const fp1 = generateFingerprint();
    const fp2 = generateFingerprint();
    expect(fp1).toBe(fp2);
  });
});
