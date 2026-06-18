// src/features/admin-article/application/use-admin-article-list.ts

import { useCallback, useEffect, useReducer, useRef } from 'react';

import {
  createPaginatedListReducer,
  createInitialPaginatedListState,
  type PaginatedListState,
  type PaginatedListAction,
} from '@/shared/hooks';

import { fetchAllArticles, publishArticle, unpublishArticle, deleteArticle, setTopArticle } from '../infrastructure/admin-article-api';
import { mapDTOToListItem, type AdminArticleListItem } from '../infrastructure/mapper';

export type { AdminArticleListItem } from '../infrastructure/mapper';

type ArticleListState = PaginatedListState<AdminArticleListItem>;
type ArticleListAction = PaginatedListAction<AdminArticleListItem> | { type: 'SET_PAGE'; page: number } | { type: 'SET_STATUS'; status: string | undefined };

const listReducer = createPaginatedListReducer<AdminArticleListItem>();

function articleListReducer(state: ArticleListState, action: ArticleListAction): ArticleListState {
  if (action.type === 'SET_PAGE') {
    return { ...state, page: action.page };
  }
  if (action.type === 'SET_STATUS') {
    return { ...state, page: 1 };
  }
  return listReducer(state, action);
}

const initialState = createInitialPaginatedListState<AdminArticleListItem>();

interface UseAdminArticleListOptions {
  status?: string;
}

export function useAdminArticleList(options: UseAdminArticleListOptions = {}) {
  const [state, dispatch] = useReducer(articleListReducer, initialState);
  const requestIdRef = useRef(0);

  const loadArticles = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    dispatch({ type: 'FETCH_START' });
    try {
      const dto = await fetchAllArticles({
        page: state.page,
        pageSize: state.pageSize,
        status: options.status,
      });
      if (requestId !== requestIdRef.current) return;
      dispatch({
        type: 'FETCH_SUCCESS',
        items: dto.items.map(mapDTOToListItem),
        total: dto.total,
        page: dto.page,
        pageSize: dto.pageSize,
      });
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      const message = err instanceof Error ? err.message : '加载文章列表失败';
      dispatch({ type: 'FETCH_FAILURE', error: message });
    }
  }, [state.page, state.pageSize, options.status]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const setPage = useCallback((page: number) => {
    dispatch({ type: 'SET_PAGE', page });
  }, []);

  const setStatusFilter = useCallback((status: string | undefined) => {
    dispatch({ type: 'SET_STATUS', status });
  }, []);

  const doPublish = useCallback(async (id: string) => {
    await publishArticle(id);
    await loadArticles();
  }, [loadArticles]);

  const doUnpublish = useCallback(async (id: string) => {
    await unpublishArticle(id);
    await loadArticles();
  }, [loadArticles]);

  const doDelete = useCallback(async (id: string) => {
    await deleteArticle(id);
    await loadArticles();
  }, [loadArticles]);

  const doSetTop = useCallback(async (id: string, isTop: boolean) => {
    await setTopArticle(id, isTop);
    await loadArticles();
  }, [loadArticles]);

  return {
    items: state.items,
    total: state.total,
    page: state.page,
    pageSize: state.pageSize,
    loading: state.loading,
    error: state.error,
    setPage,
    setStatusFilter,
    reload: loadArticles,
    doPublish,
    doUnpublish,
    doDelete,
    doSetTop,
  };
}
