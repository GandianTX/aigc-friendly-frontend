// src/features/article-search/application/use-article-search.ts

import { useCallback, useReducer, useRef } from 'react';

import { type ArticleListItem } from '@/entities/article';
import { searchArticles } from '../infrastructure/article-search-api';
import { mapArticlesPageDTO } from '../infrastructure/mapper';
import {
  type PaginatedListState,
  type PaginatedListAction,
  createPaginatedListReducer,
  createInitialPaginatedListState,
} from '@/shared/hooks';

type ArticleSearchState = PaginatedListState<ArticleListItem> & { keyword: string };
type ArticleSearchAction =
  | PaginatedListAction<ArticleListItem>
  | { type: 'SEARCH_START'; keyword: string };

const baseReducer = createPaginatedListReducer<ArticleListItem>();

function articleSearchReducer(state: ArticleSearchState, action: ArticleSearchAction): ArticleSearchState {
  switch (action.type) {
    case 'SEARCH_START':
      return { ...baseReducer(state, { type: 'FETCH_START' }), keyword: action.keyword, page: 1 };
    default:
      return baseReducer(state, action as PaginatedListAction<ArticleListItem>) as ArticleSearchState;
  }
}

const initialState: ArticleSearchState = {
  ...createInitialPaginatedListState<ArticleListItem>(),
  keyword: '',
};

export function useArticleSearch() {
  const [state, dispatch] = useReducer(articleSearchReducer, initialState);
  const requestIdRef = useRef(0);

  const search = useCallback(async (keyword: string) => {
    if (!keyword.trim()) return;
    const requestId = ++requestIdRef.current;
    dispatch({ type: 'SEARCH_START', keyword });
    try {
      const dto = await searchArticles({
        keyword,
        page: 1,
        pageSize: state.pageSize,
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
      const message = err instanceof Error ? err.message : '搜索失败';
      dispatch({ type: 'FETCH_FAILURE', error: message });
    }
  }, [state.pageSize]);

  const loadPage = useCallback(async (page: number) => {
    if (!state.keyword.trim()) return;
    const requestId = ++requestIdRef.current;
    dispatch({ type: 'SEARCH_START', keyword: state.keyword });
    try {
      const dto = await searchArticles({
        keyword: state.keyword,
        page,
        pageSize: state.pageSize,
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
      const message = err instanceof Error ? err.message : '搜索失败';
      dispatch({ type: 'FETCH_FAILURE', error: message });
    }
  }, [state.keyword, state.pageSize]);

  return {
    items: state.items,
    total: state.total,
    page: state.page,
    pageSize: state.pageSize,
    loading: state.loading,
    error: state.error,
    keyword: state.keyword,
    search,
    loadPage,
  };
}
