// src/pages/admin-articles/index.tsx

import { useCallback, useState } from 'react';

import { AdminArticleList, ArticleEdit } from '@/features/admin-article';

export function AdminArticlesPage() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const handleEdit = useCallback((id: string) => {
    setEditingId(id);
    setCreating(false);
  }, []);

  const handleCreate = useCallback(() => {
    setEditingId(null);
    setCreating(true);
  }, []);

  const handleBack = useCallback(() => {
    setEditingId(null);
    setCreating(false);
  }, []);

  if (creating) {
    return <ArticleEdit onSave={handleBack} />;
  }

  if (editingId) {
    return <ArticleEdit articleId={editingId} onSave={handleBack} />;
  }

  return <AdminArticleList onCreate={handleCreate} onEdit={handleEdit} />;
}
