// src/features/comment/infrastructure/dto.ts

import type { CommentStatus } from '@/entities/comment';

export interface CommentDTO {
  readonly id: string;
  readonly articleId: string;
  readonly parentId: string | null;
  readonly replyToId: string | null;
  readonly nickname: string;
  readonly avatarUrl: string | null;
  readonly content: string;
  readonly status: CommentStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateCommentInputDTO {
  readonly articleId: string;
  readonly parentId?: string | null;
  readonly replyToId?: string | null;
  readonly nickname: string;
  readonly email: string;
  readonly content: string;
}

export interface ReplyCommentInputDTO {
  readonly articleId: string;
  readonly parentId: string;
  readonly replyToId?: string | null;
  readonly nickname: string;
  readonly email: string;
  readonly content: string;
}
