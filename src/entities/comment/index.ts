// src/entities/comment/index.ts

export type { Comment, CommentTreeNode } from './domain/comment';
export type { CommentStatus } from './domain/comment-status';
export { isApproved, isPending } from './domain/comment-status';
export {
  buildCommentTree,
  canReply,
  getCommentDepth,
  COMMENT_MAX_NESTING_DEPTH,
} from './domain/comment-policy';
