// src/features/article-like/application/use-article-like.ts

import { useCallback, useEffect, useReducer, useRef } from 'react';

import { toggleArticleLike, fetchArticleLikeCount, fetchIsArticleLiked, generateFingerprint } from '../infrastructure/like-api';

type LikeState = {
  isLiked: boolean;
  likeCount: number;
  loading: boolean;
  toggling: boolean;
  error: string | null;
};

type LikeAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; isLiked: boolean; likeCount: number }
  | { type: 'FETCH_FAILURE'; error: string }
  | { type: 'TOGGLE_OPTIMISTIC'; isLiked: boolean; likeCount: number }
  | { type: 'TOGGLE_SUCCESS'; isLiked: boolean; likeCount: number }
  | { type: 'TOGGLE_FAILURE'; previousIsLiked: boolean; previousLikeCount: number; error: string };

const initialState: LikeState = {
  isLiked: false,
  likeCount: 0,
  loading: false,
  toggling: false,
  error: null,
};

function likeReducer(state: LikeState, action: LikeAction): LikeState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, isLiked: action.isLiked, likeCount: action.likeCount };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.error };
    case 'TOGGLE_OPTIMISTIC':
      return { ...state, isLiked: action.isLiked, likeCount: action.likeCount, toggling: true, error: null };
    case 'TOGGLE_SUCCESS':
      return { ...state, isLiked: action.isLiked, likeCount: action.likeCount, toggling: false };
    case 'TOGGLE_FAILURE':
      return { ...state, isLiked: action.previousIsLiked, likeCount: action.previousLikeCount, toggling: false, error: action.error };
    default:
      return state;
  }
}

export function useArticleLike(articleId: string | undefined) {
  const [state, dispatch] = useReducer(likeReducer, initialState);
  const fingerprintRef = useRef<string | null>(null);

  const getFingerprint = useCallback(() => {
    if (!fingerprintRef.current) {
      fingerprintRef.current = generateFingerprint();
    }
    return fingerprintRef.current;
  }, []);

  useEffect(() => {
    if (!articleId) return;

    const fingerprint = getFingerprint();
    let cancelled = false;

    dispatch({ type: 'FETCH_START' });

    Promise.all([
      fetchArticleLikeCount(articleId),
      fetchIsArticleLiked(articleId, fingerprint),
    ])
      .then(([likeCount, isLiked]) => {
        if (cancelled) return;
        dispatch({ type: 'FETCH_SUCCESS', isLiked, likeCount });
      })
      .catch((err) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : '加载点赞状态失败';
        dispatch({ type: 'FETCH_FAILURE', error: message });
      });

    return () => {
      cancelled = true;
    };
  }, [articleId, getFingerprint]);

  const toggleLike = useCallback(async () => {
    if (!articleId || state.toggling) return;

    const fingerprint = getFingerprint();
    const previousIsLiked = state.isLiked;
    const previousLikeCount = state.likeCount;

    // 乐观更新
    const optimisticIsLiked = !previousIsLiked;
    const optimisticLikeCount = previousLikeCount + (optimisticIsLiked ? 1 : -1);
    dispatch({ type: 'TOGGLE_OPTIMISTIC', isLiked: optimisticIsLiked, likeCount: optimisticLikeCount });

    try {
      const result = await toggleArticleLike(articleId, fingerprint);
      dispatch({ type: 'TOGGLE_SUCCESS', isLiked: result.isLiked, likeCount: result.likeCount });
    } catch (err) {
      const message = err instanceof Error ? err.message : '操作失败';
      dispatch({ type: 'TOGGLE_FAILURE', previousIsLiked, previousLikeCount, error: message });
    }
  }, [articleId, state.toggling, state.isLiked, state.likeCount, getFingerprint]);

  return {
    isLiked: state.isLiked,
    likeCount: state.likeCount,
    loading: state.loading,
    toggling: state.toggling,
    error: state.error,
    toggleLike,
  };
}
