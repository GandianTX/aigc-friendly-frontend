// src/features/comment/infrastructure/mapper.spec.ts

import { describe, it, expect } from 'vitest';

import type { CommentDTO } from './dto';
import { mapCommentDTOToComment } from './mapper';

const baseDTO: CommentDTO = {
  id: 'c1',
  articleId: 'a1',
  parentId: null,
  replyToId: null,
  nickname: '访客',
  avatarUrl: 'https://gravatar.com/avatar/abc',
  content: '好文章！',
  status: 'APPROVED',
  createdAt: '2024-06-01T00:00:00Z',
  updatedAt: '2024-06-01T00:00:00Z',
};

describe('mapCommentDTOToComment', () => {
  it('应该正确映射所有字段', () => {
    const result = mapCommentDTOToComment(baseDTO);

    expect(result.id).toBe('c1');
    expect(result.articleId).toBe('a1');
    expect(result.parentId).toBeNull();
    expect(result.replyToId).toBeNull();
    expect(result.nickname).toBe('访客');
    expect(result.avatarUrl).toBe('https://gravatar.com/avatar/abc');
    expect(result.content).toBe('好文章！');
    expect(result.status).toBe('APPROVED');
    expect(result.createdAt).toBe('2024-06-01T00:00:00Z');
    expect(result.updatedAt).toBe('2024-06-01T00:00:00Z');
  });

  it('带 parentId 和 replyToId 时应正确映射', () => {
    const dto: CommentDTO = { ...baseDTO, parentId: 'p1', replyToId: 'r1' };
    const result = mapCommentDTOToComment(dto);

    expect(result.parentId).toBe('p1');
    expect(result.replyToId).toBe('r1');
  });

  it('avatarUrl 为 null 时应原样映射', () => {
    const dto: CommentDTO = { ...baseDTO, avatarUrl: null };
    const result = mapCommentDTOToComment(dto);

    expect(result.avatarUrl).toBeNull();
  });

  it('不应包含 DTO 中的额外字段', () => {
    const dto = { ...baseDTO, extraField: 'should not appear' } as CommentDTO;
    const result = mapCommentDTOToComment(dto);

    expect((result as unknown as Record<string, unknown>).extraField).toBeUndefined();
  });
});
