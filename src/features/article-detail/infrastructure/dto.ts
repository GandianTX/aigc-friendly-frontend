// src/features/article-detail/infrastructure/dto.ts

export interface ArticleDTO {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly summary: string | null;
  readonly coverImageUrl: string | null;
  readonly status: 'DRAFT' | 'PUBLISHED';
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

export interface PrevNextArticleDTO {
  readonly prev: ArticleDTO | null;
  readonly next: ArticleDTO | null;
}
