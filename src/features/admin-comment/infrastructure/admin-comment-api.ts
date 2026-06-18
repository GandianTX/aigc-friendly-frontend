// src/features/admin-comment/infrastructure/admin-comment-api.ts

import { executeGraphQL, PAGINATION_MODE } from '@/shared/graphql';

import type { AdminCommentDTO, CommentStatus, CommentsPageDTO } from './dto';

type AllCommentsVariables = {
  pagination: { mode: string; page: number; pageSize: number };
  status?: CommentStatus | null;
};

type PendingCommentsVariables = {
  pagination: { mode: string; page: number; pageSize: number };
};

type IdVariable = { id: string };

type ReplyInput = {
  articleId: string;
  parentId?: string | null;
  replyToId?: string | null;
  nickname: string;
  email?: string | null;
  content: string;
};

const ALL_COMMENTS_QUERY = `
  query AllComments($pagination: PaginationArgs!, $status: CommentStatus) {
    allComments(pagination: $pagination, status: $status) {
      items {
        id articleId articleTitle parentId replyToId
        nickname email content status createdAt updatedAt
      }
      total page pageSize
    }
  }
`;

const PENDING_COMMENTS_QUERY = `
  query PendingComments($pagination: PaginationArgs!) {
    pendingComments(pagination: $pagination) {
      items {
        id articleId articleTitle parentId replyToId
        nickname email content status createdAt updatedAt
      }
      total page pageSize
    }
  }
`;

const APPROVE_COMMENT_MUTATION = `
  mutation ApproveComment($id: String!) {
    approveComment(id: $id) { id status }
  }
`;

const REJECT_COMMENT_MUTATION = `
  mutation RejectComment($id: String!) {
    rejectComment(id: $id)
  }
`;

const HIDE_COMMENT_MUTATION = `
  mutation HideComment($id: String!) {
    hideComment(id: $id)
  }
`;

const DELETE_COMMENT_MUTATION = `
  mutation DeleteComment($id: String!) {
    deleteComment(id: $id)
  }
`;

const REPLY_AS_ADMIN_MUTATION = `
  mutation ReplyCommentAsAdmin($input: ReplyCommentInput!) {
    replyCommentAsAdmin(input: $input) {
      id articleId parentId replyToId
      nickname email content status createdAt updatedAt
    }
  }
`;

export async function fetchAllComments(params: {
  page: number;
  pageSize: number;
  status?: CommentStatus;
}): Promise<CommentsPageDTO> {
  const data = await executeGraphQL<{ allComments: CommentsPageDTO }, AllCommentsVariables>(
    ALL_COMMENTS_QUERY,
    {
      pagination: {
        mode: PAGINATION_MODE.OFFSET,
        page: params.page,
        pageSize: params.pageSize,
      },
      status: params.status ?? null,
    },
  );
  return data.allComments;
}

export async function fetchPendingComments(params: {
  page: number;
  pageSize: number;
}): Promise<CommentsPageDTO> {
  const data = await executeGraphQL<
    { pendingComments: CommentsPageDTO },
    PendingCommentsVariables
  >(PENDING_COMMENTS_QUERY, {
    pagination: {
      mode: PAGINATION_MODE.OFFSET,
      page: params.page,
      pageSize: params.pageSize,
    },
  });
  return data.pendingComments;
}

export async function approveComment(id: string): Promise<AdminCommentDTO> {
  const data = await executeGraphQL<{ approveComment: AdminCommentDTO }, IdVariable>(
    APPROVE_COMMENT_MUTATION,
    { id },
  );
  return data.approveComment;
}

export async function rejectComment(id: string): Promise<boolean> {
  const data = await executeGraphQL<{ rejectComment: boolean }, IdVariable>(
    REJECT_COMMENT_MUTATION,
    { id },
  );
  return data.rejectComment;
}

export async function hideComment(id: string): Promise<boolean> {
  const data = await executeGraphQL<{ hideComment: boolean }, IdVariable>(
    HIDE_COMMENT_MUTATION,
    { id },
  );
  return data.hideComment;
}

export async function deleteComment(id: string): Promise<boolean> {
  const data = await executeGraphQL<{ deleteComment: boolean }, IdVariable>(
    DELETE_COMMENT_MUTATION,
    { id },
  );
  return data.deleteComment;
}

export async function replyCommentAsAdmin(input: ReplyInput): Promise<AdminCommentDTO> {
  const data = await executeGraphQL<{ replyCommentAsAdmin: AdminCommentDTO }, { input: ReplyInput }>(
    REPLY_AS_ADMIN_MUTATION,
    { input },
  );
  return data.replyCommentAsAdmin;
}
