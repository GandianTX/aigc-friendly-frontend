// src/features/admin-article/infrastructure/mapper.ts

import type { AdminArticleDTO } from './dto';

export interface AdminArticleListItem {
  readonly id: string;
  readonly title: string;
  readonly status: 'DRAFT' | 'PUBLISHED';
  readonly isTop: boolean;
  readonly publishedAt: string | null;
  readonly viewCount: number;
  readonly likeCount: number;
  readonly commentCount: number;
  readonly categoryName: string | null;
  readonly tags: ReadonlyArray<{ id: string; name: string; slug: string }>;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export function mapDTOToListItem(dto: AdminArticleDTO): AdminArticleListItem {
  return {
    id: dto.id,
    title: dto.title,
    status: dto.status,
    isTop: dto.isTop,
    publishedAt: dto.publishedAt,
    viewCount: dto.viewCount,
    likeCount: dto.likeCount,
    commentCount: dto.commentCount,
    categoryName: dto.categoryName,
    tags: dto.tags,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}
