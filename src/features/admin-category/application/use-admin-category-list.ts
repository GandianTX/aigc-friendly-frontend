// src/features/admin-category/application/use-admin-category-list.ts

import { useCallback, useEffect, useState } from 'react';

import type { CategoryDTO } from '@/entities/category';

import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../infrastructure/admin-category-api';
import type { CreateCategoryInputDTO, UpdateCategoryInputDTO } from '../infrastructure/dto';

export type { CreateCategoryInputDTO, UpdateCategoryInputDTO } from '../infrastructure/dto';

export function useAdminCategoryList() {
  const [items, setItems] = useState<CategoryDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const doCreate = useCallback(async (input: CreateCategoryInputDTO) => {
    await createCategory(input);
    await loadCategories();
  }, [loadCategories]);

  const doUpdate = useCallback(async (input: UpdateCategoryInputDTO) => {
    await updateCategory(input);
    await loadCategories();
  }, [loadCategories]);

  const doDelete = useCallback(async (id: string) => {
    await deleteCategory(id);
    await loadCategories();
  }, [loadCategories]);

  return { items, loading, reload: loadCategories, doCreate, doUpdate, doDelete };
}
