// src/features/category-filter/application/use-category-filter.ts

import { useCallback, useEffect, useReducer } from 'react';

import {
  type Category,
  fetchCategories,
  mapCategoryDTOToCategory,
} from '@/entities/category';

type CategoryFilterState = {
  categories: Category[];
  loading: boolean;
  error: string | null;
  selectedCategoryId: string | null;
};

type CategoryFilterAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; categories: Category[] }
  | { type: 'FETCH_FAILURE'; error: string }
  | { type: 'SELECT'; categoryId: string | null };

const initialState: CategoryFilterState = {
  categories: [],
  loading: false,
  error: null,
  selectedCategoryId: null,
};

function categoryFilterReducer(state: CategoryFilterState, action: CategoryFilterAction): CategoryFilterState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, categories: action.categories };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.error };
    case 'SELECT':
      return { ...state, selectedCategoryId: action.categoryId };
    default:
      return state;
  }
}

export function useCategoryFilter() {
  const [state, dispatch] = useReducer(categoryFilterReducer, initialState);

  useEffect(() => {
    async function load() {
      dispatch({ type: 'FETCH_START' });
      try {
        const dtos = await fetchCategories();
        const categories = dtos.map(mapCategoryDTOToCategory);
        dispatch({ type: 'FETCH_SUCCESS', categories });
      } catch (err) {
        const message = err instanceof Error ? err.message : '加载分类失败';
        dispatch({ type: 'FETCH_FAILURE', error: message });
      }
    }
    load();
  }, []);

  const selectCategory = useCallback((categoryId: string | null) => {
    dispatch({ type: 'SELECT', categoryId });
  }, []);

  return {
    categories: state.categories,
    loading: state.loading,
    error: state.error,
    selectedCategoryId: state.selectedCategoryId,
    selectCategory,
  };
}
