// src/features/admin-comment/application/use-admin-comment-list.spec.ts

import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  fetchAllComments,
  fetchPendingComments,
  approveComment,
  rejectComment,
  hideComment,
  deleteComment,
  replyCommentAsAdmin,
} from '../infrastructure/admin-comment-api';

import { useAdminCommentList } from './use-admin-comment-list';

vi.mock('../infrastructure/admin-comment-api');

const mockFetchAllComments = vi.mocked(fetchAllComments);
const mockFetchPendingComments = vi.mocked(fetchPendingComments);
const mockApproveComment = vi.mocked(approveComment);
const mockRejectComment = vi.mocked(rejectComment);
const mockHideComment = vi.mocked(hideComment);
const mockDeleteComment = vi.mocked(deleteComment);
const mockReplyCommentAsAdmin = vi.mocked(replyCommentAsAdmin);

const fakeComment = {
  id: 'c1',
  articleId: 'a1',
  articleTitle: '文章1',
  parentId: null,
  replyToId: null,
  nickname: '用户1',
  email: null,
  content: '评论内容',
  status: 'PENDING' as const,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

const fakePage = {
  items: [fakeComment],
  total: 1,
  page: 1,
  pageSize: 10,
};

describe('useAdminCommentList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('默认应使用 fetchAllComments 加载', async () => {
    mockFetchAllComments.mockResolvedValue(fakePage);

    const { result } = renderHook(() => useAdminCommentList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockFetchAllComments).toHaveBeenCalled();
    expect(mockFetchPendingComments).not.toHaveBeenCalled();
    expect(result.current.items).toEqual([fakeComment]);
  });

  it('pendingOnly=true 应使用 fetchPendingComments', async () => {
    mockFetchPendingComments.mockResolvedValue(fakePage);

    const { result } = renderHook(() => useAdminCommentList({ pendingOnly: true }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockFetchPendingComments).toHaveBeenCalled();
    expect(mockFetchAllComments).not.toHaveBeenCalled();
  });

  it('加载失败应设置 error', async () => {
    mockFetchAllComments.mockRejectedValue(new Error('服务器错误'));

    const { result } = renderHook(() => useAdminCommentList());

    await waitFor(() => {
      expect(result.current.error).toBe('服务器错误');
    });
  });

  it('setStatusFilter 应重置 page 为 1', async () => {
    mockFetchAllComments
      .mockResolvedValueOnce({ ...fakePage, page: 1 })
      .mockResolvedValueOnce({ ...fakePage, page: 2 });

    const { result } = renderHook(() => useAdminCommentList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // 先翻到第2页
    await act(async () => {
      result.current.setPage(2);
    });

    await waitFor(() => {
      expect(result.current.page).toBe(2);
    });

    // setStatusFilter 应重置 page 为 1
    await act(async () => {
      result.current.setStatusFilter('APPROVED');
    });

    expect(result.current.page).toBe(1);
  });

  it('status 参数应传递给 API', async () => {
    mockFetchAllComments.mockResolvedValue(fakePage);

    const { result } = renderHook(() =>
      useAdminCommentList({ status: 'PENDING' }),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockFetchAllComments).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'PENDING' }),
    );
  });

  it('doApprove 应调用 API 并重新加载', async () => {
    mockFetchAllComments.mockResolvedValue(fakePage);
    mockApproveComment.mockResolvedValue({ ...fakeComment, status: 'APPROVED' });

    const { result } = renderHook(() => useAdminCommentList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    vi.clearAllMocks();

    await act(async () => {
      await result.current.doApprove('c1');
    });

    expect(mockApproveComment).toHaveBeenCalledWith('c1');
    expect(mockFetchAllComments).toHaveBeenCalled();
  });

  it('doReject 应调用 API 并重新加载', async () => {
    mockFetchAllComments.mockResolvedValue(fakePage);
    mockRejectComment.mockResolvedValue(true);

    const { result } = renderHook(() => useAdminCommentList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    vi.clearAllMocks();

    await act(async () => {
      await result.current.doReject('c1');
    });

    expect(mockRejectComment).toHaveBeenCalledWith('c1');
    expect(mockFetchAllComments).toHaveBeenCalled();
  });

  it('doDelete 应调用 API 并重新加载', async () => {
    mockFetchAllComments.mockResolvedValue(fakePage);
    mockDeleteComment.mockResolvedValue(true);

    const { result } = renderHook(() => useAdminCommentList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    vi.clearAllMocks();

    await act(async () => {
      await result.current.doDelete('c1');
    });

    expect(mockDeleteComment).toHaveBeenCalledWith('c1');
    expect(mockFetchAllComments).toHaveBeenCalled();
  });

  it('doReply 应调用 API 并重新加载', async () => {
    mockFetchAllComments.mockResolvedValue(fakePage);
    mockReplyCommentAsAdmin.mockResolvedValue(fakeComment);

    const { result } = renderHook(() => useAdminCommentList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    vi.clearAllMocks();

    await act(async () => {
      await result.current.doReply({
        articleId: 'a1',
        parentId: null,
        replyToId: 'c1',
        nickname: '博主',
        content: '回复内容',
      });
    });

    expect(mockReplyCommentAsAdmin).toHaveBeenCalledWith(
      expect.objectContaining({ articleId: 'a1', content: '回复内容' }),
    );
    expect(mockFetchAllComments).toHaveBeenCalled();
  });
});
