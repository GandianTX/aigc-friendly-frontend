// src/shared/hooks/paginated-list.spec.ts

import { describe, expect, it } from 'vitest';

import {
  type PaginatedListState,
  type PaginatedListAction,
  createPaginatedListReducer,
  createInitialPaginatedListState,
} from './paginated-list';

interface Item {
  id: string;
  name: string;
}

describe('createInitialPaginatedListState', () => {
  it('应该返回默认初始状态', () => {
    const state = createInitialPaginatedListState<Item>();

    expect(state.items).toEqual([]);
    expect(state.total).toBe(0);
    expect(state.page).toBe(1);
    expect(state.pageSize).toBe(10);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('应该支持覆盖部分字段', () => {
    const state = createInitialPaginatedListState<Item>({ pageSize: 20, page: 3 });

    expect(state.pageSize).toBe(20);
    expect(state.page).toBe(3);
    expect(state.items).toEqual([]);
  });
});

describe('createPaginatedListReducer', () => {
  const reducer = createPaginatedListReducer<Item>();
  const initialState: PaginatedListState<Item> = createInitialPaginatedListState();

  it('FETCH_START 应设置 loading=true 并清除 error', () => {
    const state: PaginatedListState<Item> = { ...initialState, error: '之前的错误' };
    const next = reducer(state, { type: 'FETCH_START' });

    expect(next.loading).toBe(true);
    expect(next.error).toBeNull();
  });

  it('FETCH_SUCCESS 应更新列表数据并设置 loading=false', () => {
    const items: Item[] = [{ id: '1', name: 'A' }, { id: '2', name: 'B' }];
    const state: PaginatedListState<Item> = { ...initialState, loading: true };
    const action: PaginatedListAction<Item> = {
      type: 'FETCH_SUCCESS',
      items,
      total: 42,
      page: 2,
      pageSize: 20,
    };
    const next = reducer(state, action);

    expect(next.loading).toBe(false);
    expect(next.items).toEqual(items);
    expect(next.total).toBe(42);
    expect(next.page).toBe(2);
    expect(next.pageSize).toBe(20);
  });

  it('FETCH_FAILURE 应设置 error 并设置 loading=false', () => {
    const state: PaginatedListState<Item> = { ...initialState, loading: true };
    const next = reducer(state, { type: 'FETCH_FAILURE', error: '网络错误' });

    expect(next.loading).toBe(false);
    expect(next.error).toBe('网络错误');
  });

  it('未知 action 类型应返回原状态', () => {
    const next = reducer(initialState, { type: 'UNKNOWN' } as unknown as PaginatedListAction<Item>);

    expect(next).toBe(initialState);
  });

  it('FETCH_SUCCESS 应覆盖之前的数据', () => {
    const state: PaginatedListState<Item> = {
      ...initialState,
      items: [{ id: 'old', name: '旧数据' }],
      total: 1,
      loading: true,
    };
    const next = reducer(state, {
      type: 'FETCH_SUCCESS',
      items: [{ id: 'new', name: '新数据' }],
      total: 5,
      page: 1,
      pageSize: 10,
    });

    expect(next.items).toEqual([{ id: 'new', name: '新数据' }]);
    expect(next.total).toBe(5);
  });
});
