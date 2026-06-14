// src/features/article-archive/application/use-article-archive.ts

import { useEffect, useReducer, useRef } from 'react';

import {
  type ArchiveDTO,
  fetchArticleArchives,
} from '../infrastructure/article-archive-api';

type ArchiveState = {
  archives: ArchiveDTO[];
  loading: boolean;
  error: string | null;
};

type ArchiveAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; archives: ArchiveDTO[] }
  | { type: 'FETCH_FAILURE'; error: string };

const initialState: ArchiveState = {
  archives: [],
  loading: false,
  error: null,
};

function archiveReducer(state: ArchiveState, action: ArchiveAction): ArchiveState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, archives: action.archives };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
}

export function useArticleArchive() {
  const [state, dispatch] = useReducer(archiveReducer, initialState);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    async function load() {
      dispatch({ type: 'FETCH_START' });
      try {
        const archives = await fetchArticleArchives();
        if (requestId !== requestIdRef.current) return;
        dispatch({ type: 'FETCH_SUCCESS', archives });
      } catch (err) {
        if (requestId !== requestIdRef.current) return;
        const message = err instanceof Error ? err.message : '加载归档失败';
        dispatch({ type: 'FETCH_FAILURE', error: message });
      }
    }
    load();
  }, []);

  return {
    archives: state.archives,
    loading: state.loading,
    error: state.error,
  };
}
