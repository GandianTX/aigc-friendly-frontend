// src/entities/article/domain/article-status.ts

export type ArticleStatus = 'DRAFT' | 'PUBLISHED';

export function isPublished(status: ArticleStatus): boolean {
  return status === 'PUBLISHED';
}

export function isDraft(status: ArticleStatus): boolean {
  return status === 'DRAFT';
}
