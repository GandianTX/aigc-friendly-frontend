// src/features/admin-article/infrastructure/mapper.spec.ts

import { describe, expect, it } from 'vitest';

import type { AdminArticleDTO } from './dto';
import { mapDTOToListItem } from './mapper';

const baseDTO: AdminArticleDTO = {
  id: 'a1',
  title: '测试文章',
  content: '正文',
  summary: '摘要',
  coverImageUrl: null,
  status: 'DRAFT',
  isTop: false,
  publishedAt: null,
  viewCount: 0,
  likeCount: 0,
  commentCount: 0,
  categoryId: 'c1',
  categoryName: '分类1',
  tags: [{ id: 't1', name: '标签1', slug: 'tag-1' }],
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

describe('mapDTOToListItem', () => {
  it('应正确映射所有字段', () => {
    const result = mapDTOToListItem(baseDTO);

    expect(result).toEqual({
      id: 'a1',
      title: '测试文章',
      status: 'DRAFT',
      isTop: false,
      publishedAt: null,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      categoryName: '分类1',
      tags: [{ id: 't1', name: '标签1', slug: 'tag-1' }],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    });
  });

  it('不应包含 content 和 summary', () => {
    const result = mapDTOToListItem(baseDTO);

    expect(result).not.toHaveProperty('content');
    expect(result).not.toHaveProperty('summary');
  });

  it('已发布文章应正确映射', () => {
    const published: AdminArticleDTO = {
      ...baseDTO,
      status: 'PUBLISHED',
      isTop: true,
      publishedAt: '2024-06-01',
      viewCount: 100,
    };

    const result = mapDTOToListItem(published);

    expect(result.status).toBe('PUBLISHED');
    expect(result.isTop).toBe(true);
    expect(result.publishedAt).toBe('2024-06-01');
    expect(result.viewCount).toBe(100);
  });

  it('无分类和标签应映射为 null 和空数组', () => {
    const noCategory: AdminArticleDTO = {
      ...baseDTO,
      categoryId: null,
      categoryName: null,
      tags: [],
    };

    const result = mapDTOToListItem(noCategory);

    expect(result.categoryName).toBeNull();
    expect(result.tags).toEqual([]);
  });
});
