// src/features/admin-tag/infrastructure/dto.ts

export interface CreateTagInputDTO {
  readonly name: string;
  readonly slug: string;
}

export interface UpdateTagInputDTO {
  readonly id: string;
  readonly name?: string | null;
  readonly slug?: string | null;
}
