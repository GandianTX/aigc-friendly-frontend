// src/entities/comment/domain/comment-status.ts

export type CommentStatus = 'PENDING' | 'APPROVED' | 'HIDDEN' | 'REJECTED';

export function isApproved(status: CommentStatus): boolean {
  return status === 'APPROVED';
}

export function isPending(status: CommentStatus): boolean {
  return status === 'PENDING';
}
