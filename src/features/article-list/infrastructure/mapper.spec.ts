// src/features/article-list/infrastructure/mapper.spec.ts

import { describe, it, expect } from 'vitest';

import type { ArticleDTO, ArticlesPageDTO } from './dto';
import { mapArticleDTOToListItem, mapArticlesPageDTO } from './mapper';

const baseDTO: ArticleDTO = {
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

describe('mapArticleDTOToListItem', () => {
  it('应该正确映射所有字段', () => {
    const item = mapArticleDTOToListItem(baseDTO);

    expect(item.id).toBe('a1');
    expect(item.title).toBe('测试文章');
    expect(item.summary).toBe('摘要');
    expect(item.status).toBe('PUBLISHED');
    expect(item.tags).toEqual([{ id: 't1', name: 'Node.js', slug: 'nodejs' }]);
  });

  it('null 字段应原样映射', () => {
    const dto: ArticleDTO = { ...baseDTO, summary: null, coverImageUrl: null, categoryId: null, categoryName: null, publishedAt: null };
    const item = mapArticleDTOToListItem(dto);

    expect(item.summary).toBeNull();
    expect(item.coverImageUrl).toBeNull();
    expect(item.categoryId).toBeNull();
    expect(item.categoryName).toBeNull();
    expect(item.publishedAt).toBeNull();
  });

  it('空标签应映射为空数组', () => {
    const item = mapArticleDTOToListItem({ ...baseDTO, tags: [] });
    expect(item.tags).toEqual([]);
  });
});

describe('mapArticlesPageDTO', () => {
  it('应该正确映射分页结果', () => {
    const pageDTO: ArticlesPageDTO = {
      items: [baseDTO],
      total: 1,
      page: 1,
      pageSize: 10,
    };

    const result = mapArticlesPageDTO(pageDTO);

    expect(result.items).toHaveLength(1);
    expect(result.items[0].id).toBe('a1');
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(10);
  });

  it('空列表应映射为空 items', () => {
    const pageDTO: ArticlesPageDTO = { items: [], total: 0, page: 1, pageSize: 10 };
    const result = mapArticlesPageDTO(pageDTO);

    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
  });
});
