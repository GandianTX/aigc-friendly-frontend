// src/entities/comment/domain/comment.ts

import type { CommentStatus } from './comment-status';

export interface Comment {
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

export interface CommentTreeNode extends Comment {
  readonly children: CommentTreeNode[];
}
