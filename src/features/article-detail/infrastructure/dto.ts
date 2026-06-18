// src/features/article-detail/infrastructure/dto.ts

export type { ArticleDTO } from '@/entities/article';

export interface PrevNextArticleDTO {
  readonly prev: import('@/entities/article').ArticleDTO | null;
  readonly next: import('@/entities/article').ArticleDTO | null;
}
