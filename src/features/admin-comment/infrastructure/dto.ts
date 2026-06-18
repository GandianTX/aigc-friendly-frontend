// src/features/admin-comment/infrastructure/dto.ts

export type CommentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'HIDDEN';

export interface AdminCommentDTO {
  readonly id: string;
  readonly articleId: string;
  readonly articleTitle: string | null;
  readonly parentId: string | null;
  readonly replyToId: string | null;
  readonly nickname: string;
  readonly email: string | null;
  readonly content: string;
  readonly status: CommentStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CommentsPageDTO {
  readonly items: AdminCommentDTO[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}
