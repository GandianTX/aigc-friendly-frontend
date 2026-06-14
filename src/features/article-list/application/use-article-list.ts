// src/features/article-list/application/use-article-list.ts

import { useCallback, useEffect, useReducer, useRef } from 'react';

import {
  type ArticleListItem,
  fetchPublishedArticles,
  mapArticlesPageDTO,
} from '@/entities/article';
import {
  type PaginatedListState,
  type PaginatedListAction,
  createPaginatedListReducer,
  createInitialPaginatedListState,
} from '@/shared/hooks';

type ArticleListState = PaginatedListState<ArticleListItem>;
type ArticleListAction = PaginatedListAction<ArticleListItem> | { type: 'SET_PAGE'; page: number };

const articleListReducer = createPaginatedListReducer<ArticleListItem>();

function listReducer(state: ArticleListState, action: ArticleListAction): ArticleListState {
  if (action.type === 'SET_PAGE') {
    return { ...state, page: action.page };
  }
  return articleListReducer(state, action);
}

const initialState = createInitialPaginatedListState<ArticleListItem>();

interface UseArticleListOptions {
  categoryId?: string | null;
  tagId?: string | null;
}

export function useArticleList(options: UseArticleListOptions = {}) {
  const [state, dispatch] = useReducer(listReducer, initialState);
  const requestIdRef = useRef(0);

  const loadArticles = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    dispatch({ type: 'FETCH_START' });
    try {
      const dto = await fetchPublishedArticles({
        page: state.page,
        pageSize: state.pageSize,
        categoryId: options.categoryId ?? undefined,
        tagId: options.tagId ?? undefined,
      });
      if (requestId !== requestIdRef.current) return;
      const mapped = mapArticlesPageDTO(dto);
      dispatch({
        type: 'FETCH_SUCCESS',
        items: mapped.items,
        total: mapped.total,
        page: mapped.page,
        pageSize: mapped.pageSize,
      });
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      const message = err instanceof Error ? err.message : '加载文章列表失败';
      dispatch({ type: 'FETCH_FAILURE', error: message });
    }
  }, [state.page, state.pageSize, options.categoryId, options.tagId]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const setPage = useCallback((page: number) => {
    dispatch({ type: 'SET_PAGE', page });
  }, []);

  return {
    items: state.items,
    total: state.total,
    page: state.page,
    pageSize: state.pageSize,
    loading: state.loading,
    error: state.error,
    setPage,
    reload: loadArticles,
  };
}
