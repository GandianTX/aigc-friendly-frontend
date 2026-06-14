// src/features/article-archive/application/use-archive-articles.ts

import { useCallback, useEffect, useReducer, useRef } from 'react';

import { type ArticleListItem } from '@/entities/article';
import { fetchArticlesByArchive } from '../infrastructure/article-archive-api';
import { mapArticlesPageDTO } from '../infrastructure/mapper';
import {
  createPaginatedListReducer,
  createInitialPaginatedListState,
} from '@/shared/hooks';

const archiveArticlesReducer = createPaginatedListReducer<ArticleListItem>();
const initialState = createInitialPaginatedListState<ArticleListItem>();

export function useArchiveArticles(year: number, month: number) {
  const [state, dispatch] = useReducer(archiveArticlesReducer, initialState);
  const requestIdRef = useRef(0);

  const loadPage = useCallback(async (page: number) => {
    const requestId = ++requestIdRef.current;
    dispatch({ type: 'FETCH_START' });
    try {
      const dto = await fetchArticlesByArchive({ year, month, page, pageSize: state.pageSize });
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
      const message = err instanceof Error ? err.message : '加载归档文章失败';
      dispatch({ type: 'FETCH_FAILURE', error: message });
    }
  }, [year, month, state.pageSize]);

  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  return {
    items: state.items,
    total: state.total,
    page: state.page,
    pageSize: state.pageSize,
    loading: state.loading,
    error: state.error,
    loadPage,
  };
}
