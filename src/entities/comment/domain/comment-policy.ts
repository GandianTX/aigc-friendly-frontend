// src/entities/comment/domain/comment-policy.ts

import type { Comment, CommentTreeNode } from './comment';

/** 评论最大嵌套深度 */
export const COMMENT_MAX_NESTING_DEPTH = 3;

/**
 * 将扁平评论列表构建为树形结构。
 * 顶级评论（parentId 为 null）作为根节点，
 * 子评论按 parentId 分组挂载到对应父节点下。
 * 单次遍历 O(n)。
 */
export function buildCommentTree(comments: Comment[]): CommentTreeNode[] {
  const viewMap = new Map<string, CommentTreeNode>();
  const roots: CommentTreeNode[] = [];

  for (const comment of comments) {
    const node: CommentTreeNode = {
      ...comment,
      children: [],
    };
    viewMap.set(comment.id, node);

    if (!comment.parentId) {
      roots.push(node);
    } else {
      const parent = viewMap.get(comment.parentId);
      if (parent) {
        parent.children.push(node);
      }
    }
  }

  return roots;
}

/**
 * 判断是否可以继续回复（嵌套深度未超过上限）。
 */
export function canReply(comment: Comment, allComments: Comment[]): boolean {
  const depth = getCommentDepth(comment, allComments);
  return depth < COMMENT_MAX_NESTING_DEPTH;
}

/**
 * 计算评论嵌套深度。
 */
export function getCommentDepth(comment: Comment, allComments: Comment[]): number {
  let depth = 1;
  const commentMap = new Map(allComments.map((c) => [c.id, c]));
  let current = comment;
  while (current.parentId) {
    depth++;
    const parent = commentMap.get(current.parentId);
    if (!parent) break;
    current = parent;
  }
  return depth;
}
