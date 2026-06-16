// src/features/comment/infrastructure/mapper.ts

import type { Comment } from '@/entities/comment';

import type { CommentDTO } from './dto';

export function mapCommentDTOToComment(dto: CommentDTO): Comment {
  return {
    id: dto.id,
    articleId: dto.articleId,
    parentId: dto.parentId,
    replyToId: dto.replyToId,
    nickname: dto.nickname,
    avatarUrl: dto.avatarUrl,
    content: dto.content,
    status: dto.status,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}
