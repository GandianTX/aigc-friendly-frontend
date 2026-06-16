// src/features/comment/infrastructure/comment-api.ts

import { executeGraphQL } from '@/shared/graphql';

import type { CommentDTO, CreateCommentInputDTO, ReplyCommentInputDTO } from './dto';

type CommentsByArticleVariables = {
  articleId: string;
};

type CreateCommentVariables = {
  input: CreateCommentInputDTO;
};

type ReplyCommentVariables = {
  input: ReplyCommentInputDTO;
};

const COMMENTS_BY_ARTICLE_QUERY = `
  query CommentsByArticle($articleId: String!) {
    commentsByArticle(articleId: $articleId) {
      id articleId parentId replyToId nickname avatarUrl content status
      createdAt updatedAt
      children { id articleId parentId replyToId nickname avatarUrl content status createdAt updatedAt
        children { id articleId parentId replyToId nickname avatarUrl content status createdAt updatedAt
          children { id articleId parentId replyToId nickname avatarUrl content status createdAt updatedAt }
        }
      }
    }
  }
`;

const CREATE_COMMENT_MUTATION = `
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id articleId parentId replyToId nickname avatarUrl content status createdAt updatedAt
    }
  }
`;

const REPLY_COMMENT_MUTATION = `
  mutation ReplyComment($input: ReplyCommentInput!) {
    replyComment(input: $input) {
      id articleId parentId replyToId nickname avatarUrl content status createdAt updatedAt
    }
  }
`;

export async function fetchCommentsByArticle(articleId: string): Promise<CommentDTO[]> {
  const data = await executeGraphQL<
    { commentsByArticle: CommentDTO[] },
    CommentsByArticleVariables
  >(COMMENTS_BY_ARTICLE_QUERY, { articleId }, { authMode: 'none' });

  return data.commentsByArticle;
}

export async function createComment(input: CreateCommentInputDTO): Promise<CommentDTO> {
  const data = await executeGraphQL<
    { createComment: CommentDTO },
    CreateCommentVariables
  >(CREATE_COMMENT_MUTATION, { input }, { authMode: 'none' });

  return data.createComment;
}

export async function replyComment(input: ReplyCommentInputDTO): Promise<CommentDTO> {
  const data = await executeGraphQL<
    { replyComment: CommentDTO },
    ReplyCommentVariables
  >(REPLY_COMMENT_MUTATION, { input }, { authMode: 'none' });

  return data.replyComment;
}
