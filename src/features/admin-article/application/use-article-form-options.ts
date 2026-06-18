// src/features/admin-article/application/use-article-form-options.ts

import { useEffect, useState } from 'react';

import { fetchCategories } from '@/entities/category';
import { fetchTags } from '@/entities/tag';

type SelectOption = { id: string; name: string };

export function useArticleFormOptions() {
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [tags, setTags] = useState<SelectOption[]>([]);

  useEffect(() => {
    fetchCategories()
      .then((cats) => setCategories(cats.map((c) => ({ id: c.id, name: c.name }))))
      .catch(() => {});
    fetchTags()
      .then((t) => setTags(t.map((tag) => ({ id: tag.id, name: tag.name }))))
      .catch(() => {});
  }, []);

  return { categories, tags };
}
