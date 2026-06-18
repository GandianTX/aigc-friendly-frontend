// src/features/admin-tag/application/use-admin-tag-list.ts

import { useCallback, useEffect, useState } from 'react';

import type { TagDTO } from '@/entities/tag';

import {
  fetchTags,
  createTag,
  updateTag,
  deleteTag,
} from '../infrastructure/admin-tag-api';
import type { CreateTagInputDTO, UpdateTagInputDTO } from '../infrastructure/dto';

export type { CreateTagInputDTO, UpdateTagInputDTO } from '../infrastructure/dto';

export function useAdminTagList() {
  const [items, setItems] = useState<TagDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTags = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTags();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  const doCreate = useCallback(async (input: CreateTagInputDTO) => {
    await createTag(input);
    await loadTags();
  }, [loadTags]);

  const doUpdate = useCallback(async (input: UpdateTagInputDTO) => {
    await updateTag(input);
    await loadTags();
  }, [loadTags]);

  const doDelete = useCallback(async (id: string) => {
    await deleteTag(id);
    await loadTags();
  }, [loadTags]);

  return { items, loading, reload: loadTags, doCreate, doUpdate, doDelete };
}
