// src/features/article-archive/infrastructure/mapper.ts

import type { ArticleListItem } from '@/entities/article';

import type { ArticleDTO, ArticlesPageDTO } from './dto';

export function mapArticleDTOToListItem(dto: ArticleDTO): ArticleListItem {
  return {
    id: dto.id,
    title: dto.title,
    summary: dto.summary,
    coverImageUrl: dto.coverImageUrl,
    status: dto.status,
    isTop: dto.isTop,
    publishedAt: dto.publishedAt,
    viewCount: dto.viewCount,
    likeCount: dto.likeCount,
    commentCount: dto.commentCount,
    categoryId: dto.categoryId,
    categoryName: dto.categoryName,
    tags: dto.tags,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

export function mapArticlesPageDTO(dto: ArticlesPageDTO): {
  items: ArticleListItem[];
  total: number;
  page: number;
  pageSize: number;
} {
  return {
    items: dto.items.map(mapArticleDTOToListItem),
    total: dto.total,
    page: dto.page,
    pageSize: dto.pageSize,
  };
}
