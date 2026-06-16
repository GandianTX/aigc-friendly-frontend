// src/features/comment/application/use-submit-comment.ts

import { useCallback, useReducer } from 'react';

import type { Comment } from '@/entities/comment';

import { commentFormReducer, initialCommentFormState } from './comment-state';
import { createComment, replyComment } from '../infrastructure/comment-api';
import { mapCommentDTOToComment } from '../infrastructure/mapper';

export interface SubmitCommentParams {
  articleId: string;
  nickname: string;
  email: string;
  content: string;
}

export interface ReplyCommentParams extends SubmitCommentParams {
  parentId: string;
  replyToId?: string | null;
}

export function useSubmitComment(onSuccess?: (comment: Comment) => void) {
  const [formState, dispatch] = useReducer(commentFormReducer, initialCommentFormState);

  const submitComment = useCallback(async (params: SubmitCommentParams) => {
    dispatch({ type: 'SUBMIT_START' });
    try {
      const dto = await createComment({
        articleId: params.articleId,
        nickname: params.nickname,
        email: params.email,
        content: params.content,
      });
      const comment = mapCommentDTOToComment(dto);
      dispatch({ type: 'SUBMIT_SUCCESS' });
      onSuccess?.(comment);
      return comment;
    } catch (err) {
      const message = err instanceof Error ? err.message : '提交评论失败';
      dispatch({ type: 'SUBMIT_FAILURE', error: message });
      return null;
    }
  }, [onSuccess]);

  const submitReply = useCallback(async (params: ReplyCommentParams) => {
    dispatch({ type: 'SUBMIT_START' });
    try {
      const dto = await replyComment({
        articleId: params.articleId,
        parentId: params.parentId,
        replyToId: params.replyToId,
        nickname: params.nickname,
        email: params.email,
        content: params.content,
      });
      const comment = mapCommentDTOToComment(dto);
      dispatch({ type: 'SUBMIT_SUCCESS' });
      onSuccess?.(comment);
      return comment;
    } catch (err) {
      const message = err instanceof Error ? err.message : '回复评论失败';
      dispatch({ type: 'SUBMIT_FAILURE', error: message });
      return null;
    }
  }, [onSuccess]);

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    formState,
    submitComment,
    submitReply,
    resetForm,
  };
}
