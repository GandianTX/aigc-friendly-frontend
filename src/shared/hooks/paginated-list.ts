// src/shared/hooks/paginated-list.ts
// 通用分页列表 state / reducer，供多个 feature hook 复用

export interface PaginatedListState<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
}

export type PaginatedListAction<T> =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; items: T[]; total: number; page: number; pageSize: number }
  | { type: 'FETCH_FAILURE'; error: string };

export function createPaginatedListReducer<T>() {
  return function paginatedListReducer(
    state: PaginatedListState<T>,
    action: PaginatedListAction<T>,
  ): PaginatedListState<T> {
    switch (action.type) {
      case 'FETCH_START':
        return { ...state, loading: true, error: null };
      case 'FETCH_SUCCESS':
        return {
          ...state,
          loading: false,
          items: action.items,
          total: action.total,
          page: action.page,
          pageSize: action.pageSize,
        };
      case 'FETCH_FAILURE':
        return { ...state, loading: false, error: action.error };
      default:
        return state;
    }
  };
}

export function createInitialPaginatedListState<T>(
  overrides?: Partial<PaginatedListState<T>>,
): PaginatedListState<T> {
  return {
    items: [],
    total: 0,
    page: 1,
    pageSize: 10,
    loading: false,
    error: null,
    ...overrides,
  };
}
