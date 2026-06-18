// src/features/admin-article/application/use-article-edit.spec.ts

import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createArticle,
  fetchArticleByIdAdmin,
  publishArticle,
  updateArticle,
} from '../infrastructure/admin-article-api';
import { fetchCategories } from '@/entities/category';
import { fetchTags } from '@/entities/tag';

import { useArticleEdit } from './use-article-edit';

vi.mock('../infrastructure/admin-article-api');
vi.mock('@/entities/category');
vi.mock('@/entities/tag');

const mockFetchArticleByIdAdmin = vi.mocked(fetchArticleByIdAdmin);
const mockCreateArticle = vi.mocked(createArticle);
const mockUpdateArticle = vi.mocked(updateArticle);
const mockPublishArticle = vi.mocked(publishArticle);
const mockFetchCategories = vi.mocked(fetchCategories);
const mockFetchTags = vi.mocked(fetchTags);

const fakeArticle = {
  id: 'a1',
  title: '测试文章',
  content: '正文',
  summary: '摘要',
  coverImageUrl: null,
  status: 'DRAFT' as const,
  isTop: false,
  publishedAt: null,
  viewCount: 0,
  likeCount: 0,
  commentCount: 0,
  categoryId: 'c1',
  categoryName: '分类1',
  tags: [{ id: 't1', name: '标签1', slug: 'tag-1' }],
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

const formValues = {
  title: '新文章',
  content: '新正文',
  summary: '新摘要',
  categoryId: 'c1',
  tagIds: ['t1'],
};

// 辅助：模拟 UI 的 useEffect(() => { loadArticle() }, [loadArticle])
function renderWithAutoLoad(articleId?: string) {
  const result = renderHook(() => useArticleEdit(articleId));
  act(() => {
    result.result.current.loadArticle();
  });
  return result;
}

describe('useArticleEdit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchCategories.mockResolvedValue([]);
    mockFetchTags.mockResolvedValue([]);
  });

  describe('新建模式（无 articleId）', () => {
    it('loadArticle 后应进入 editing 状态', () => {
      const { result } = renderWithAutoLoad(undefined);

      expect(result.current.state.status).toBe('editing');
      expect(result.current.article).toBeNull();
    });

    it('saveDraft 应调用 createArticle', async () => {
      mockCreateArticle.mockResolvedValue(fakeArticle);

      const { result } = renderWithAutoLoad(undefined);

      await act(async () => {
        await result.current.saveDraft(formValues);
      });

      expect(mockCreateArticle).toHaveBeenCalledWith({
        title: '新文章',
        content: '新正文',
        summary: '新摘要',
        categoryId: 'c1',
        tagIds: ['t1'],
      });
      expect(result.current.state.status).toBe('saved');
    });

    it('publish 应先 create 再 publish', async () => {
      mockCreateArticle.mockResolvedValue(fakeArticle);
      mockPublishArticle.mockResolvedValue({ ...fakeArticle, status: 'PUBLISHED' });

      const { result } = renderWithAutoLoad(undefined);

      await act(async () => {
        await result.current.publish(formValues);
      });

      expect(mockCreateArticle).toHaveBeenCalled();
      expect(mockPublishArticle).toHaveBeenCalledWith('a1');
      expect(result.current.state.status).toBe('published');
    });

    it('saveDraft 失败应转为 failed 并抛出异常', async () => {
      mockCreateArticle.mockRejectedValue(new Error('创建失败'));

      const { result } = renderWithAutoLoad(undefined);

      let error: Error | undefined;
      await act(async () => {
        try {
          await result.current.saveDraft(formValues);
        } catch (e) {
          error = e as Error;
        }
      });

      expect(error?.message).toBe('创建失败');
      expect(result.current.state.status).toBe('failed');
    });

    it('publish 失败应转为 failed 并抛出异常', async () => {
      mockCreateArticle.mockRejectedValue(new Error('创建失败'));

      const { result } = renderWithAutoLoad(undefined);

      let error: Error | undefined;
      await act(async () => {
        try {
          await result.current.publish(formValues);
        } catch (e) {
          error = e as Error;
        }
      });

      expect(error?.message).toBe('创建失败');
      expect(result.current.state.status).toBe('failed');
    });
  });

  describe('编辑模式（有 articleId）', () => {
    it('loadArticle 成功应从 loading 转为 editing', async () => {
      mockFetchArticleByIdAdmin.mockResolvedValue(fakeArticle);

      const { result } = renderHook(() => useArticleEdit('a1'));

      // 初始状态为 idle（loadArticle 需要手动调用）
      expect(result.current.state.status).toBe('idle');

      await act(async () => {
        result.current.loadArticle();
      });

      expect(result.current.state.status).toBe('editing');
      expect(result.current.article).toEqual(fakeArticle);
    });

    it('文章不存在应转为 failed', async () => {
      mockFetchArticleByIdAdmin.mockResolvedValue(null);

      const { result } = renderHook(() => useArticleEdit('nonexistent'));

      await act(async () => {
        result.current.loadArticle();
      });

      expect(result.current.state.status).toBe('failed');
      expect(result.current.state).toHaveProperty('error', '文章不存在');
    });

    it('加载失败应转为 failed', async () => {
      mockFetchArticleByIdAdmin.mockRejectedValue(new Error('网络错误'));

      const { result } = renderHook(() => useArticleEdit('a1'));

      await act(async () => {
        result.current.loadArticle();
      });

      expect(result.current.state.status).toBe('failed');
      expect(result.current.state).toHaveProperty('error', '网络错误');
    });

    it('非 Error 对象应使用默认错误消息', async () => {
      mockFetchArticleByIdAdmin.mockRejectedValue('unknown');

      const { result } = renderHook(() => useArticleEdit('a1'));

      await act(async () => {
        result.current.loadArticle();
      });

      expect(result.current.state).toHaveProperty('error', '加载文章失败');
    });

    it('saveDraft 应调用 updateArticle', async () => {
      mockFetchArticleByIdAdmin.mockResolvedValue(fakeArticle);
      mockUpdateArticle.mockResolvedValue(fakeArticle);

      const { result } = renderHook(() => useArticleEdit('a1'));

      await act(async () => {
        result.current.loadArticle();
      });

      await act(async () => {
        await result.current.saveDraft(formValues);
      });

      expect(mockUpdateArticle).toHaveBeenCalledWith({
        id: 'a1',
        title: '新文章',
        content: '新正文',
        summary: '新摘要',
        categoryId: 'c1',
        tagIds: ['t1'],
      });
      expect(result.current.state.status).toBe('saved');
    });

    it('publish 应先 update 再 publish', async () => {
      mockFetchArticleByIdAdmin.mockResolvedValue(fakeArticle);
      mockUpdateArticle.mockResolvedValue(fakeArticle);
      mockPublishArticle.mockResolvedValue({ ...fakeArticle, status: 'PUBLISHED' });

      const { result } = renderHook(() => useArticleEdit('a1'));

      await act(async () => {
        result.current.loadArticle();
      });

      await act(async () => {
        await result.current.publish(formValues);
      });

      expect(mockUpdateArticle).toHaveBeenCalled();
      expect(mockPublishArticle).toHaveBeenCalledWith('a1');
      expect(result.current.state.status).toBe('published');
    });
  });

  describe('表单选项', () => {
    it('应加载 categories 和 tags', async () => {
      mockFetchCategories.mockResolvedValue([
        { id: 'c1', name: '分类1', slug: 'cat-1', parentId: null, sortOrder: 0, articleCount: 1, createdAt: '', updatedAt: '' },
      ]);
      mockFetchTags.mockResolvedValue([
        { id: 't1', name: '标签1', slug: 'tag-1', articleCount: 1, createdAt: '', updatedAt: '' },
      ]);

      const { result } = renderWithAutoLoad(undefined);

      await waitFor(() => {
        expect(result.current.categories).toEqual([{ id: 'c1', name: '分类1' }]);
        expect(result.current.tags).toEqual([{ id: 't1', name: '标签1' }]);
      });
    });

    it('categories 加载失败不应阻塞主流程', async () => {
      mockFetchCategories.mockRejectedValue(new Error('分类加载失败'));

      const { result } = renderWithAutoLoad(undefined);

      // 新建模式仍应进入 editing
      expect(result.current.state.status).toBe('editing');
      expect(result.current.categories).toEqual([]);
    });
  });
});
