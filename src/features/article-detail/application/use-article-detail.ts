// src/features/article-detail/application/use-article-detail.ts

import { useCallback, useEffect, useReducer, useRef } from 'react';

import { type Article } from '@/entities/article';
import { fetchArticleById, fetchPrevNextArticle, incrementViewCount } from '../infrastructure/article-api';
import { mapArticleDTOToArticle, mapPrevNextArticleDTO } from '../infrastructure/mapper';

type ArticleDetailState = {
  article: Article | null;
  prevArticle: Article | null;
  nextArticle: Article | null;
  loading: boolean;
  error: string | null;
};

type ArticleDetailAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; article: Article; prev: Article | null; next: Article | null }
  | { type: 'FETCH_FAILURE'; error: string }
  | { type: 'RESET' };

const initialState: ArticleDetailState = {
  article: null,
  prevArticle: null,
  nextArticle: null,
  loading: false,
  error: null,
};

function articleDetailReducer(state: ArticleDetailState, action: ArticleDetailAction): ArticleDetailState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null, article: null };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        article: action.article,
        prevArticle: action.prev,
        nextArticle: action.next,
      };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.error };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function useArticleDetail(articleId: string | undefined) {
  const [state, dispatch] = useReducer(articleDetailReducer, initialState);
  const requestIdRef = useRef(0);

  const loadArticle = useCallback(async () => {
    if (!articleId) return;

    const requestId = ++requestIdRef.current;
    dispatch({ type: 'FETCH_START' });
    try {
      const articleDTO = await fetchArticleById(articleId);

      if (requestId !== requestIdRef.current) return;

      if (!articleDTO) {
        dispatch({ type: 'FETCH_FAILURE', error: '文章不存在' });
        return;
      }

      const article = mapArticleDTOToArticle(articleDTO);

      let prev: Article | null = null;
      let next: Article | null = null;
      try {
        const prevNextDTO = await fetchPrevNextArticle(articleId);
        if (requestId !== requestIdRef.current) return;
        const mapped = mapPrevNextArticleDTO(prevNextDTO);
        prev = mapped.prev;
        next = mapped.next;
      } catch (err) {
        // prevNextArticle 查询失败不阻塞主内容显示，但记录日志便于排查
        if (import.meta.env.DEV) {
          console.warn('[useArticleDetail] prevNextArticle failed:', err);
        }
      }

      dispatch({ type: 'FETCH_SUCCESS', article, prev, next });

      incrementViewCount(articleId).catch(() => {});
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      const message = err instanceof Error ? err.message : '加载文章失败';
      dispatch({ type: 'FETCH_FAILURE', error: message });
    }
  }, [articleId]);

  useEffect(() => {
    loadArticle();
  }, [loadArticle]);

  return {
    article: state.article,
    prevArticle: state.prevArticle,
    nextArticle: state.nextArticle,
    loading: state.loading,
    error: state.error,
    reload: loadArticle,
  };
}
