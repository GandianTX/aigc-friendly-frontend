// src/features/admin-category/infrastructure/dto.ts

export interface CreateCategoryInputDTO {
  readonly name: string;
  readonly slug: string;
  readonly parentId?: string | null;
  readonly sortOrder?: number;
}

export interface UpdateCategoryInputDTO {
  readonly id: string;
  readonly name?: string | null;
  readonly slug?: string | null;
  readonly parentId?: string | null;
  readonly sortOrder?: number | null;
}
