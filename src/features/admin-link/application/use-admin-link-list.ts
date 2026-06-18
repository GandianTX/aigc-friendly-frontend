// src/features/admin-link/application/use-admin-link-list.ts

import { useCallback, useEffect, useState } from 'react';

import type { BlogLinkDTO, CreateBlogLinkInputDTO, UpdateBlogLinkInputDTO } from '../infrastructure/dto';
import {
  fetchBlogLinks,
  createBlogLink,
  updateBlogLink,
  deleteBlogLink,
} from '../infrastructure/admin-link-api';

export type { BlogLinkDTO, CreateBlogLinkInputDTO, UpdateBlogLinkInputDTO } from '../infrastructure/dto';

export function useAdminLinkList() {
  const [items, setItems] = useState<BlogLinkDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const loadLinks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchBlogLinks();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  const doCreate = useCallback(async (input: CreateBlogLinkInputDTO) => {
    await createBlogLink(input);
    await loadLinks();
  }, [loadLinks]);

  const doUpdate = useCallback(async (input: UpdateBlogLinkInputDTO) => {
    await updateBlogLink(input);
    await loadLinks();
  }, [loadLinks]);

  const doDelete = useCallback(async (id: string) => {
    await deleteBlogLink(id);
    await loadLinks();
  }, [loadLinks]);

  return { items, loading, reload: loadLinks, doCreate, doUpdate, doDelete };
}
