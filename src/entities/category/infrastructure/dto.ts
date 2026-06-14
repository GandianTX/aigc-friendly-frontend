// src/entities/category/infrastructure/dto.ts

export interface CategoryDTO {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly parentId: string | null;
  readonly sortOrder: number;
  readonly articleCount: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}
