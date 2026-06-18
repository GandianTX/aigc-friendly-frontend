// src/features/article-archive/infrastructure/dto.ts

export type { ArticleDTO, ArticlesPageDTO } from '@/entities/article';

export interface ArchiveDTO {
  readonly year: number;
  readonly month: number;
  readonly count: number;
}
