// src/entities/tag/domain/tag.ts

export interface Tag {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly articleCount: number;
}
