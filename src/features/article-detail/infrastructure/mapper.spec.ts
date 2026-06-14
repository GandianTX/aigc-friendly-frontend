// src/features/article-detail/infrastructure/mapper.spec.ts

import { describe, it, expect } from 'vitest';

import type { ArticleDTO, PrevNextArticleDTO } from './dto';
import { mapArticleDTOToArticle, mapPrevNextArticleDTO } from './mapper';

const baseDTO: ArticleDTO = {
  id: 'a1',
  title: '测试文章',
  content: '正文内容',
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
  tags: [{ id: 't1', name: 'Node.js', slug: 'nodejs' }],
  createdAt: '2024-01-01',
  updatedAt: '2024-06-01',
};

describe('mapArticleDTOToArticle', () => {
  it('应该正确映射所有字段（含 content）', () => {
    const article = mapArticleDTOToArticle(baseDTO);

    expect(article.id).toBe('a1');
    expect(article.title).toBe('测试文章');
    expect(article.content).toBe('正文内容');
    expect(article.summary).toBe('摘要');
    expect(article.tags).toEqual([{ id: 't1', name: 'Node.js', slug: 'nodejs' }]);
  });

  it('null 字段应原样映射', () => {
    const dto: ArticleDTO = { ...baseDTO, summary: null, coverImageUrl: null, publishedAt: null };
    const article = mapArticleDTOToArticle(dto);

    expect(article.summary).toBeNull();
    expect(article.coverImageUrl).toBeNull();
    expect(article.publishedAt).toBeNull();
  });
});

describe('mapPrevNextArticleDTO', () => {
  it('prev/next 都存在时应正确映射', () => {
    const dto: PrevNextArticleDTO = {
      prev: { ...baseDTO, id: 'prev-1', title: '上一篇' },
      next: { ...baseDTO, id: 'next-1', title: '下一篇' },
    };

    const result = mapPrevNextArticleDTO(dto);

    expect(result.prev).not.toBeNull();
    expect(result.prev!.id).toBe('prev-1');
    expect(result.next).not.toBeNull();
    expect(result.next!.id).toBe('next-1');
  });

  it('prev/next 为 null 时应映射为 null', () => {
    const dto: PrevNextArticleDTO = { prev: null, next: null };

    const result = mapPrevNextArticleDTO(dto);

    expect(result.prev).toBeNull();
    expect(result.next).toBeNull();
  });

  it('仅 prev 存在时 next 应为 null', () => {
    const dto: PrevNextArticleDTO = {
      prev: { ...baseDTO, id: 'prev-1', title: '上一篇' },
      next: null,
    };

    const result = mapPrevNextArticleDTO(dto);

    expect(result.prev).not.toBeNull();
    expect(result.next).toBeNull();
  });
});
