// src/features/admin-article/application/use-article-edit.ts

import { useCallback, useEffect, useReducer, useState } from 'react';

import { articleEditReducer, initialArticleEditState } from './article-edit-state';
import {
  createArticle,
  fetchArticleByIdAdmin,
  publishArticle,
  updateArticle,
} from '../infrastructure/admin-article-api';
import type { AdminArticleDTO } from '../infrastructure/dto';
import { useArticleFormOptions } from './use-article-form-options';

export type ArticleFormValues = {
  title: string;
  content: string;
  summary?: string;
  categoryId?: string;
  tagIds?: string[];
};

export function useArticleEdit(articleId?: string) {
  const [state, dispatch] = useReducer(articleEditReducer, initialArticleEditState);
  const [article, setArticle] = useState<AdminArticleDTO | null>(null);
  const { categories, tags } = useArticleFormOptions();

  const loadArticle = useCallback(() => {
    if (articleId) {
      dispatch({ type: 'LOAD_START' });
      fetchArticleByIdAdmin(articleId).then((a) => {
        if (a) {
          setArticle(a);
          dispatch({ type: 'START_EDIT' });
        } else {
          dispatch({ type: 'FAILURE', error: '文章不存在' });
        }
      }).catch((err) => {
        const msg = err instanceof Error ? err.message : '加载文章失败';
        dispatch({ type: 'FAILURE', error: msg });
      });
    } else {
      dispatch({ type: 'START_EDIT' });
    }
  }, [articleId]);

  const saveDraft = useCallback(
    async (values: ArticleFormValues) => {
      dispatch({ type: 'SAVE_START' });
      try {
        if (articleId) {
          await updateArticle({
            id: articleId,
            title: values.title,
            content: values.content,
            summary: values.summary ?? null,
            categoryId: values.categoryId ?? null,
            tagIds: values.tagIds,
          });
        } else {
          await createArticle({
            title: values.title,
            content: values.content,
            summary: values.summary ?? null,
            categoryId: values.categoryId ?? null,
            tagIds: values.tagIds,
          });
        }
        dispatch({ type: 'SAVE_SUCCESS' });
      } catch (err) {
        const msg = err instanceof Error ? err.message : '保存失败';
        dispatch({ type: 'FAILURE', error: msg });
        throw err;
      }
    },
    [articleId],
  );

  const publish = useCallback(
    async (values: ArticleFormValues) => {
      dispatch({ type: 'PUBLISH_START' });
      try {
        let id = articleId;
        if (!id) {
          const created = await createArticle({
            title: values.title,
            content: values.content,
            summary: values.summary ?? null,
            categoryId: values.categoryId ?? null,
            tagIds: values.tagIds,
          });
          id = created.id;
        } else {
          await updateArticle({
            id,
            title: values.title,
            content: values.content,
            summary: values.summary ?? null,
            categoryId: values.categoryId ?? null,
            tagIds: values.tagIds,
          });
        }
        await publishArticle(id);
        dispatch({ type: 'PUBLISH_SUCCESS' });
      } catch (err) {
        const msg = err instanceof Error ? err.message : '发布失败';
        dispatch({ type: 'FAILURE', error: msg });
        throw err;
      }
    },
    [articleId],
  );

  return {
    state,
    article,
    categories,
    tags,
    loadArticle,
    saveDraft,
    publish,
  };
}
