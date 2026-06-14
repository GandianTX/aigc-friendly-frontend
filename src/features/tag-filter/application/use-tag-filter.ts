// src/features/tag-filter/application/use-tag-filter.ts

import { useCallback, useEffect, useReducer } from 'react';

import {
  fetchTags,
  mapTagDTOToTag,
  type Tag,
} from '@/entities/tag';

type TagFilterState = {
  tags: Tag[];
  loading: boolean;
  error: string | null;
  selectedTagId: string | null;
};

type TagFilterAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; tags: Tag[] }
  | { type: 'FETCH_FAILURE'; error: string }
  | { type: 'SELECT'; tagId: string | null };

const initialState: TagFilterState = {
  tags: [],
  loading: false,
  error: null,
  selectedTagId: null,
};

function tagFilterReducer(state: TagFilterState, action: TagFilterAction): TagFilterState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, tags: action.tags };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.error };
    case 'SELECT':
      return { ...state, selectedTagId: action.tagId };
    default:
      return state;
  }
}

export function useTagFilter() {
  const [state, dispatch] = useReducer(tagFilterReducer, initialState);

  useEffect(() => {
    async function load() {
      dispatch({ type: 'FETCH_START' });
      try {
        const dtos = await fetchTags();
        const tags = dtos.map(mapTagDTOToTag);
        dispatch({ type: 'FETCH_SUCCESS', tags });
      } catch (err) {
        const message = err instanceof Error ? err.message : '加载标签失败';
        dispatch({ type: 'FETCH_FAILURE', error: message });
      }
    }
    load();
  }, []);

  const selectTag = useCallback((tagId: string | null) => {
    dispatch({ type: 'SELECT', tagId });
  }, []);

  return {
    tags: state.tags,
    loading: state.loading,
    error: state.error,
    selectedTagId: state.selectedTagId,
    selectTag,
  };
}
