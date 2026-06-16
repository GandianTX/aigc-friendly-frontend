// src/entities/comment/domain/comment-policy.spec.ts

import { describe, it, expect } from 'vitest';

import type { Comment } from './comment';
import { buildCommentTree, canReply, getCommentDepth, COMMENT_MAX_NESTING_DEPTH } from './comment-policy';

const makeComment = (overrides: Partial<Comment> & { id: string }): Comment => ({
  articleId: 'article-1',
  parentId: null,
  replyToId: null,
  nickname: '访客',
  avatarUrl: null,
  content: '内容',
  status: 'APPROVED',
  createdAt: '2024-06-01',
  updatedAt: '2024-06-01',
  ...overrides,
});

describe('buildCommentTree', () => {
  it('空列表应返回空数组', () => {
    expect(buildCommentTree([])).toEqual([]);
  });

  it('只有顶级评论时直接返回', () => {
    const c1 = makeComment({ id: 'c1' });
    const tree = buildCommentTree([c1]);

    expect(tree).toHaveLength(1);
    expect(tree[0].id).toBe('c1');
    expect(tree[0].children).toEqual([]);
  });

  it('父子评论应正确构建树', () => {
    const c1 = makeComment({ id: 'c1', parentId: null });
    const c2 = makeComment({ id: 'c2', parentId: 'c1' });

    const tree = buildCommentTree([c1, c2]);

    expect(tree).toHaveLength(1);
    expect(tree[0].id).toBe('c1');
    expect(tree[0].children).toHaveLength(1);
    expect(tree[0].children[0].id).toBe('c2');
  });

  it('多级嵌套应正确构建', () => {
    const c1 = makeComment({ id: 'c1', parentId: null });
    const c2 = makeComment({ id: 'c2', parentId: 'c1' });
    const c3 = makeComment({ id: 'c3', parentId: 'c2' });

    const tree = buildCommentTree([c1, c2, c3]);

    expect(tree).toHaveLength(1);
    expect(tree[0].children[0].children[0].id).toBe('c3');
  });

  it('多个顶级评论应并列返回', () => {
    const c1 = makeComment({ id: 'c1', parentId: null });
    const c2 = makeComment({ id: 'c2', parentId: null });

    const tree = buildCommentTree([c1, c2]);

    expect(tree).toHaveLength(2);
  });

  it('子评论先于父评论出现时无法挂载（单次遍历限制）', () => {
    const c2 = makeComment({ id: 'c2', parentId: 'c1' });
    const c1 = makeComment({ id: 'c1', parentId: null });

    // buildCommentTree 是单次遍历 O(n)，子先于父时子节点无法找到父
    const tree = buildCommentTree([c2, c1]);

    expect(tree).toHaveLength(1);
    expect(tree[0].id).toBe('c1');
    // c2 在 c1 之前处理，此时 c1 尚不在 viewMap 中，c2 成为孤儿
    expect(tree[0].children).toHaveLength(0);
  });

  it('parentId 指向不存在的评论时子评论不挂载到任何节点', () => {
    const orphan = makeComment({ id: 'orphan', parentId: 'nonexistent' });

    const tree = buildCommentTree([orphan]);

    expect(tree).toHaveLength(0);
  });
});

describe('getCommentDepth', () => {
  it('顶级评论深度为 1', () => {
    const c1 = makeComment({ id: 'c1', parentId: null });
    expect(getCommentDepth(c1, [c1])).toBe(1);
  });

  it('二级评论深度为 2', () => {
    const c1 = makeComment({ id: 'c1', parentId: null });
    const c2 = makeComment({ id: 'c2', parentId: 'c1' });
    expect(getCommentDepth(c2, [c1, c2])).toBe(2);
  });

  it('三级评论深度为 3', () => {
    const c1 = makeComment({ id: 'c1', parentId: null });
    const c2 = makeComment({ id: 'c2', parentId: 'c1' });
    const c3 = makeComment({ id: 'c3', parentId: 'c2' });
    expect(getCommentDepth(c3, [c1, c2, c3])).toBe(3);
  });

  it('parentId 链断裂时返回当前已追踪深度', () => {
    const c2 = makeComment({ id: 'c2', parentId: 'missing' });
    expect(getCommentDepth(c2, [c2])).toBe(2);
  });
});

describe('canReply', () => {
  it('顶级评论可以回复', () => {
    const c1 = makeComment({ id: 'c1', parentId: null });
    expect(canReply(c1, [c1])).toBe(true);
  });

  it('达到最大嵌套深度时不可回复', () => {
    const c1 = makeComment({ id: 'c1', parentId: null });
    const c2 = makeComment({ id: 'c2', parentId: 'c1' });
    const c3 = makeComment({ id: 'c3', parentId: 'c2' });

    expect(canReply(c3, [c1, c2, c3])).toBe(false);
  });

  it('未达到最大嵌套深度时可以回复', () => {
    const c1 = makeComment({ id: 'c1', parentId: null });
    const c2 = makeComment({ id: 'c2', parentId: 'c1' });

    expect(canReply(c2, [c1, c2])).toBe(true);
  });
});

it('COMMENT_MAX_NESTING_DEPTH 应为 3', () => {
  expect(COMMENT_MAX_NESTING_DEPTH).toBe(3);
});
