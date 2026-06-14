// src/entities/tag/infrastructure/dto.ts

export interface TagDTO {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly articleCount: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}
