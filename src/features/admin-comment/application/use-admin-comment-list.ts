// src/features/admin-comment/application/use-admin-comment-list.ts

import { useCallback, useEffect, useReducer, useRef } from 'react';

import {
  createPaginatedListReducer,
  createInitialPaginatedListState,
  type PaginatedListState,
  type PaginatedListAction,
} from '@/shared/hooks';

import { fetchAllComments, fetchPendingComments, approveComment, rejectComment, hideComment, deleteComment, replyCommentAsAdmin } from '../infrastructure/admin-comment-api';
import type { AdminCommentDTO, CommentStatus } from '../infrastructure/dto';

export type { AdminCommentDTO, CommentStatus } from '../infrastructure/dto';

type CommentListState = PaginatedListState<AdminCommentDTO>;
type CommentListAction = PaginatedListAction<AdminCommentDTO> | { type: 'SET_PAGE'; page: number } | { type: 'SET_STATUS'; status: CommentStatus | undefined };

const listReducer = createPaginatedListReducer<AdminCommentDTO>();

function commentListReducer(state: CommentListState, action: CommentListAction): CommentListState {
  if (action.type === 'SET_PAGE') {
    return { ...state, page: action.page };
  }
  if (action.type === 'SET_STATUS') {
    return { ...state, page: 1 };
  }
  return listReducer(state, action);
}

const initialState = createInitialPaginatedListState<AdminCommentDTO>();

interface UseAdminCommentListOptions {
  status?: CommentStatus;
  pendingOnly?: boolean;
}

export function useAdminCommentList(options: UseAdminCommentListOptions = {}) {
  const [state, dispatch] = useReducer(commentListReducer, initialState);
  const requestIdRef = useRef(0);

  const loadComments = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    dispatch({ type: 'FETCH_START' });
    try {
      const fetcher = options.pendingOnly ? fetchPendingComments : fetchAllComments;
      const dto = await fetcher({
        page: state.page,
        pageSize: state.pageSize,
        ...(!options.pendingOnly && options.status ? { status: options.status } : {}),
      });
      if (requestId !== requestIdRef.current) return;
      dispatch({
        type: 'FETCH_SUCCESS',
        items: dto.items,
        total: dto.total,
        page: dto.page,
        pageSize: dto.pageSize,
      });
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      const message = err instanceof Error ? err.message : '加载评论列表失败';
      dispatch({ type: 'FETCH_FAILURE', error: message });
    }
  }, [state.page, state.pageSize, options.status, options.pendingOnly]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const setPage = useCallback((page: number) => {
    dispatch({ type: 'SET_PAGE', page });
  }, []);

  const setStatusFilter = useCallback((status: CommentStatus | undefined) => {
    dispatch({ type: 'SET_STATUS', status });
  }, []);

  const doApprove = useCallback(async (id: string) => {
    await approveComment(id);
    await loadComments();
  }, [loadComments]);

  const doReject = useCallback(async (id: string) => {
    await rejectComment(id);
    await loadComments();
  }, [loadComments]);

  const doHide = useCallback(async (id: string) => {
    await hideComment(id);
    await loadComments();
  }, [loadComments]);

  const doDelete = useCallback(async (id: string) => {
    await deleteComment(id);
    await loadComments();
  }, [loadComments]);

  const doReply = useCallback(async (input: {
    articleId: string;
    parentId?: string | null;
    replyToId?: string | null;
    nickname: string;
    email?: string | null;
    content: string;
  }) => {
    await replyCommentAsAdmin(input);
    await loadComments();
  }, [loadComments]);

  return {
    items: state.items,
    total: state.total,
    page: state.page,
    pageSize: state.pageSize,
    loading: state.loading,
    error: state.error,
    setPage,
    setStatusFilter,
    reload: loadComments,
    doApprove,
    doReject,
    doHide,
    doDelete,
    doReply,
  };
}
