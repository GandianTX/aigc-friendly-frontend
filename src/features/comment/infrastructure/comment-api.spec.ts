// src/features/comment/infrastructure/comment-api.spec.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';

import type { CommentDTO, CreateCommentInputDTO, ReplyCommentInputDTO } from './dto';

const mockExecuteGraphQL = vi.fn();
vi.mock('@/shared/graphql', () => ({
  executeGraphQL: (...args: unknown[]) => mockExecuteGraphQL(...args),
}));

import { fetchCommentsByArticle, createComment, replyComment } from './comment-api';

const fakeCommentDTO: CommentDTO = {
  id: 'c1',
  articleId: 'a1',
  parentId: null,
  replyToId: null,
  nickname: '访客',
  avatarUrl: null,
  content: '好文章！',
  status: 'PENDING',
  createdAt: '2024-06-01T00:00:00Z',
  updatedAt: '2024-06-01T00:00:00Z',
};

describe('fetchCommentsByArticle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该传递 articleId 并返回评论列表', async () => {
    mockExecuteGraphQL.mockResolvedValue({ commentsByArticle: [fakeCommentDTO] });

    const result = await fetchCommentsByArticle('a1');

    expect(result).toEqual([fakeCommentDTO]);
    const [, variables, options] = mockExecuteGraphQL.mock.calls[0];
    expect(variables.articleId).toBe('a1');
    expect(options.authMode).toBe('none');
  });

  it('文章无评论应返回空数组', async () => {
    mockExecuteGraphQL.mockResolvedValue({ commentsByArticle: [] });

    const result = await fetchCommentsByArticle('a1');

    expect(result).toEqual([]);
  });

  it('executeGraphQL 抛错时应向上传播', async () => {
    mockExecuteGraphQL.mockRejectedValue(new Error('网络错误'));

    await expect(fetchCommentsByArticle('a1')).rejects.toThrow('网络错误');
  });
});

describe('createComment', () => {
  const input: CreateCommentInputDTO = {
    articleId: 'a1',
    nickname: '访客',
    email: 'test@example.com',
    content: '好文章！',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该传递 input 并返回创建的评论', async () => {
    mockExecuteGraphQL.mockResolvedValue({ createComment: fakeCommentDTO });

    const result = await createComment(input);

    expect(result).toEqual(fakeCommentDTO);
    const [, variables, options] = mockExecuteGraphQL.mock.calls[0];
    expect(variables.input).toEqual(input);
    expect(options.authMode).toBe('none');
  });

  it('executeGraphQL 抛错时应向上传播', async () => {
    mockExecuteGraphQL.mockRejectedValue(new Error('服务器错误'));

    await expect(createComment(input)).rejects.toThrow('服务器错误');
  });
});

describe('replyComment', () => {
  const input: ReplyCommentInputDTO = {
    articleId: 'a1',
    parentId: 'p1',
    replyToId: 'p1',
    nickname: '访客B',
    email: 'b@example.com',
    content: '回复',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该传递 input 并返回回复评论', async () => {
    const replyDTO: CommentDTO = { ...fakeCommentDTO, id: 'c2', parentId: 'p1', replyToId: 'p1', content: '回复' };
    mockExecuteGraphQL.mockResolvedValue({ replyComment: replyDTO });

    const result = await replyComment(input);

    expect(result).toEqual(replyDTO);
    const [, variables, options] = mockExecuteGraphQL.mock.calls[0];
    expect(variables.input).toEqual(input);
    expect(options.authMode).toBe('none');
  });

  it('executeGraphQL 抛错时应向上传播', async () => {
    mockExecuteGraphQL.mockRejectedValue(new Error('服务器错误'));

    await expect(replyComment(input)).rejects.toThrow('服务器错误');
  });
});
