// src/features/article-detail/infrastructure/mapper.ts

import type { Article } from '@/entities/article';

import type { ArticleDTO, PrevNextArticleDTO } from './dto';

export function mapArticleDTOToArticle(dto: ArticleDTO): Article {
  return {
    id: dto.id,
    title: dto.title,
    content: dto.content,
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

export function mapPrevNextArticleDTO(dto: PrevNextArticleDTO): {
  prev: Article | null;
  next: Article | null;
} {
  return {
    prev: dto.prev ? mapArticleDTOToArticle(dto.prev) : null,
    next: dto.next ? mapArticleDTOToArticle(dto.next) : null,
  };
}
