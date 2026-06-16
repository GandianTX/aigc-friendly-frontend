// src/features/article-like/infrastructure/dto.ts

export interface LikeResultDTO {
  readonly isLiked: boolean;
  readonly likeCount: number;
}
