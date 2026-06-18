// src/features/admin-link/infrastructure/dto.ts

export interface BlogLinkDTO {
  readonly id: string;
  readonly name: string;
  readonly url: string;
  readonly description: string | null;
  readonly logoUrl: string | null;
  readonly sortOrder: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateBlogLinkInputDTO {
  readonly name: string;
  readonly url: string;
  readonly description?: string | null;
  readonly logoUrl?: string | null;
  readonly sortOrder?: number;
}

export interface UpdateBlogLinkInputDTO {
  readonly id: string;
  readonly name?: string | null;
  readonly url?: string | null;
  readonly description?: string | null;
  readonly logoUrl?: string | null;
  readonly sortOrder?: number | null;
}
