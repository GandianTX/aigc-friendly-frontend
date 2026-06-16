// src/features/comment/application/use-comments.ts

import { useCallback, useEffect, useReducer, useRef } from 'react';

import type { Comment, CommentTreeNode } from '@/entities/comment';
import { buildCommentTree } from '@/entities/comment';

import { fetchCommentsByArticle } from '../infrastructure/comment-api';
import { mapCommentDTOToComment } from '../infrastructure/mapper';

type CommentsState = {
  comments: CommentTreeNode[];
  loading: boolean;
  error: string | null;
};

type CommentsAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; comments: CommentTreeNode[] }
  | { type: 'FETCH_FAILURE'; error: string };

const initialCommentsState: CommentsState = {
  comments: [],
  loading: false,
  error: null,
};

function commentsReducer(state: CommentsState, action: CommentsAction): CommentsState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, comments: action.comments };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
}

export function useComments(articleId: string | undefined) {
  const [state, dispatch] = useReducer(commentsReducer, initialCommentsState);
  const requestIdRef = useRef(0);

  const loadComments = useCallback(async () => {
    if (!articleId) return;

    const requestId = ++requestIdRef.current;
    dispatch({ type: 'FETCH_START' });

    try {
      const dtos = await fetchCommentsByArticle(articleId);
      if (requestId !== requestIdRef.current) return;

      const comments: Comment[] = dtos.map(mapCommentDTOToComment);
      const tree = buildCommentTree(comments);
      dispatch({ type: 'FETCH_SUCCESS', comments: tree });
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      const message = err instanceof Error ? err.message : '加载评论失败';
      dispatch({ type: 'FETCH_FAILURE', error: message });
    }
  }, [articleId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  return {
    comments: state.comments,
    loading: state.loading,
    error: state.error,
    reload: loadComments,
  };
}
