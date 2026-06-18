// src/features/article-archive/infrastructure/article-archive-api.spec.ts

import { beforeEach,describe, expect, it, vi } from 'vitest';

import type { ArchiveDTO,ArticlesPageDTO } from './dto';

// Mock executeGraphQL before importing the module under test
const mockExecuteGraphQL = vi.fn();
vi.mock('@/shared/graphql', () => ({
  executeGraphQL: (...args: unknown[]) => mockExecuteGraphQL(...args),
}));

import { fetchArticleArchives, fetchArticlesByArchive } from './article-archive-api';

describe('article-archive-api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchArticleArchives', () => {
    it('应该返回归档列表', async () => {
      const fakeArchives: ArchiveDTO[] = [
        { year: 2024, month: 6, count: 3 },
        { year: 2024, month: 5, count: 1 },
      ];

      mockExecuteGraphQL.mockResolvedValue({ articleArchives: fakeArchives });

      const result = await fetchArticleArchives();

      expect(result).toEqual(fakeArchives);
      expect(mockExecuteGraphQL).toHaveBeenCalledTimes(1);

      const [, variables, options] = mockExecuteGraphQL.mock.calls[0];
      expect(variables).toEqual({});
      expect(options.authMode).toBe('none');
    });

    it('无归档数据时应返回空数组', async () => {
      mockExecuteGraphQL.mockResolvedValue({ articleArchives: [] });

      const result = await fetchArticleArchives();

      expect(result).toEqual([]);
    });

    it('executeGraphQL 抛错时应向上传播', async () => {
      mockExecuteGraphQL.mockRejectedValue(new Error('网络错误'));

      await expect(fetchArticleArchives()).rejects.toThrow('网络错误');
    });
  });

  describe('fetchArticlesByArchive', () => {
    it('应该正确传递年月和分页参数', async () => {
      const fakeResult: ArticlesPageDTO = {
        items: [],
        total: 0,
        page: 1,
        pageSize: 10,
      };

      mockExecuteGraphQL.mockResolvedValue({ articlesByArchive: fakeResult });

      const result = await fetchArticlesByArchive({
        year: 2024,
        month: 6,
        page: 2,
        pageSize: 15,
      });

      expect(result).toEqual(fakeResult);

      const [, variables, options] = mockExecuteGraphQL.mock.calls[0];
      expect(variables).toEqual({
        year: 2024,
        month: 6,
        page: 2,
        pageSize: 15,
      });
      expect(options.authMode).toBe('none');
    });

    it('executeGraphQL 抛错时应向上传播', async () => {
      mockExecuteGraphQL.mockRejectedValue(new Error('服务器错误'));

      await expect(
        fetchArticlesByArchive({ year: 2024, month: 6, page: 1, pageSize: 10 }),
      ).rejects.toThrow('服务器错误');
    });
  });
});
