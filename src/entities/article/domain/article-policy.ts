// src/entities/article/domain/article-policy.ts

import type { ArticleStatus } from './article-status';
import { isPublished } from './article-status';

export function canEdit(): boolean {
  return true;
}

export function canPublish(status: ArticleStatus): boolean {
  return !isPublished(status);
}

export function canUnpublish(status: ArticleStatus): boolean {
  return isPublished(status);
}

export function formatPublishedDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}
