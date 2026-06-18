// src/features/admin-article/infrastructure/dto.ts

export interface AdminArticleDTO {
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

export interface AdminArticlesPageDTO {
  readonly items: AdminArticleDTO[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}

export interface CreateArticleInputDTO {
  readonly title: string;
  readonly content: string;
  readonly summary?: string | null;
  readonly coverImageUrl?: string | null;
  readonly categoryId?: string | null;
  readonly tagIds?: string[];
}

export interface UpdateArticleInputDTO {
  readonly id: string;
  readonly title?: string | null;
  readonly content?: string | null;
  readonly summary?: string | null;
  readonly coverImageUrl?: string | null;
  readonly categoryId?: string | null;
  readonly tagIds?: string[];
}
