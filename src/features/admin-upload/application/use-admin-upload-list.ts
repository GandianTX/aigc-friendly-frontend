// src/features/admin-upload/application/use-admin-upload-list.ts

import { useCallback, useEffect, useReducer, useRef } from 'react';

import {
  createPaginatedListReducer,
  createInitialPaginatedListState,
  type PaginatedListState,
  type PaginatedListAction,
} from '@/shared/hooks';

import { fetchUploads, deleteUpload, uploadImage } from '../infrastructure/admin-upload-api';
import type { UploadDTO } from '../infrastructure/dto';

export type { UploadDTO } from '../infrastructure/dto';

type UploadListState = PaginatedListState<UploadDTO>;
type UploadListAction = PaginatedListAction<UploadDTO> | { type: 'SET_PAGE'; page: number };

const listReducer = createPaginatedListReducer<UploadDTO>();

function uploadListReducer(state: UploadListState, action: UploadListAction): UploadListState {
  if (action.type === 'SET_PAGE') {
    return { ...state, page: action.page };
  }
  return listReducer(state, action);
}

const initialState = createInitialPaginatedListState<UploadDTO>();

export function useAdminUploadList() {
  const [state, dispatch] = useReducer(uploadListReducer, initialState);
  const requestIdRef = useRef(0);

  const loadUploads = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    dispatch({ type: 'FETCH_START' });
    try {
      const dto = await fetchUploads({ page: state.page, pageSize: state.pageSize });
      if (requestId !== requestIdRef.current) return;
      dispatch({
        type: 'FETCH_SUCCESS',
        items: dto.items,
        total: dto.total,
        page: dto.page,
        pageSize: dto.pageSize,
      });
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      const message = err instanceof Error ? err.message : '加载文件列表失败';
      dispatch({ type: 'FETCH_FAILURE', error: message });
    }
  }, [state.page, state.pageSize]);

  useEffect(() => {
    loadUploads();
  }, [loadUploads]);

  const setPage = useCallback((page: number) => {
    dispatch({ type: 'SET_PAGE', page });
  }, []);

  const doDelete = useCallback(async (id: string) => {
    await deleteUpload(id);
    await loadUploads();
  }, [loadUploads]);

  const doUpload = useCallback(async (file: File) => {
    await uploadImage(file);
    await loadUploads();
  }, [loadUploads]);

  return {
    items: state.items,
    total: state.total,
    page: state.page,
    pageSize: state.pageSize,
    loading: state.loading,
    error: state.error,
    setPage,
    reload: loadUploads,
    doDelete,
    doUpload,
  };
}
