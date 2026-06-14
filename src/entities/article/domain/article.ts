// src/entities/article/domain/article.ts

import type { ArticleStatus } from './article-status';

export interface Article {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly summary: string | null;
  readonly coverImageUrl: string | null;
  readonly status: ArticleStatus;
  readonly isTop: boolean;
  readonly publishedAt: string | null;
  readonly viewCount: number;
  readonly likeCount: number;
  readonly commentCount: number;
  readonly categoryId: string | null;
  readonly categoryName: string | null;
  readonly tags: ReadonlyArray<{ id: string; name: string; slug: string }>;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface ArticleListItem {
  readonly id: string;
  readonly title: string;
  readonly summary: string | null;
  readonly coverImageUrl: string | null;
  readonly status: ArticleStatus;
  readonly isTop: boolean;
  readonly publishedAt: string | null;
  readonly viewCount: number;
  readonly likeCount: number;
  readonly commentCount: number;
  readonly categoryId: string | null;
  readonly categoryName: string | null;
  readonly tags: ReadonlyArray<{ id: string; name: string; slug: string }>;
  readonly createdAt: string;
  readonly updatedAt: string;
}
