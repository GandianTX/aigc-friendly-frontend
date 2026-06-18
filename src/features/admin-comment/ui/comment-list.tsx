// src/features/admin-comment/ui/comment-list.tsx

import { App, Button, Modal, Popconfirm, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useState } from 'react';

import type { AdminCommentDTO, CommentStatus } from '../application/use-admin-comment-list';
import { useAdminCommentList } from '../application/use-admin-comment-list';

const STATUS_LABEL: Record<CommentStatus, { text: string; color: string }> = {
  PENDING: { text: '待审核', color: 'orange' },
  APPROVED: { text: '已通过', color: 'green' },
  REJECTED: { text: '已驳回', color: 'red' },
  HIDDEN: { text: '已隐藏', color: 'default' },
};

interface CommentListProps {
  pendingOnly?: boolean;
}

export function AdminCommentList({ pendingOnly }: CommentListProps) {
  const { message } = App.useApp();
  const [statusFilter, setStatusFilter] = useState<CommentStatus | undefined>(undefined);
  const [replyModal, setReplyModal] = useState<{ open: boolean; comment: AdminCommentDTO | null }>({
    open: false,
    comment: null,
  });
  const [replyContent, setReplyContent] = useState('');

  const { items, total, page, pageSize, loading, setPage, setStatusFilter: applyStatusFilter, reload, doApprove, doReject, doHide, doDelete, doReply } = useAdminCommentList({
    status: statusFilter,
    pendingOnly,
  });

  const handleApprove = useCallback(
    async (id: string) => {
      try {
        await doApprove(id);
        message.success('审核通过');
      } catch {
        message.error('操作失败');
      }
    },
    [doApprove, message],
  );

  const handleReject = useCallback(
    async (id: string) => {
      try {
        await doReject(id);
        message.success('已驳回');
      } catch {
        message.error('操作失败');
      }
    },
    [doReject, message],
  );

  const handleHide = useCallback(
    async (id: string) => {
      try {
        await doHide(id);
        message.success('已隐藏');
      } catch {
        message.error('操作失败');
      }
    },
    [doHide, message],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await doDelete(id);
        message.success('已删除');
      } catch {
        message.error('删除失败');
      }
    },
    [doDelete, message],
  );

  const handleReply = useCallback(async () => {
    if (!replyModal.comment || !replyContent.trim()) return;
    try {
      await doReply({
        articleId: replyModal.comment.articleId,
        parentId: replyModal.comment.parentId ?? replyModal.comment.id,
        replyToId: replyModal.comment.id,
        nickname: '博主',
        content: replyContent.trim(),
      });
      message.success('回复成功');
      setReplyModal({ open: false, comment: null });
      setReplyContent('');
    } catch {
      message.error('回复失败');
    }
  }, [replyModal, replyContent, doReply, message]);

  const columns: ColumnsType<AdminCommentDTO> = [
    { title: '昵称', dataIndex: 'nickname', key: 'nickname', width: 100 },
    { title: '内容', dataIndex: 'content', key: 'content', ellipsis: true },
    {
      title: '文章',
      dataIndex: 'articleTitle',
      key: 'articleTitle',
      width: 150,
      render: (v: string | null) => v ?? '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: CommentStatus) => {
        const info = STATUS_LABEL[status];
        return <Tag color={info.color}>{info.text}</Tag>;
      },
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (v: string) => new Date(v).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 260,
      render: (_, record) => (
        <Space size="small">
          {record.status === 'PENDING' && (
            <>
              <Button size="small" type="link" onClick={() => handleApprove(record.id)}>
                通过
              </Button>
              <Button danger size="small" type="link" onClick={() => handleReject(record.id)}>
                驳回
              </Button>
            </>
          )}
          {record.status === 'APPROVED' && (
            <Button size="small" type="link" onClick={() => handleHide(record.id)}>
              隐藏
            </Button>
          )}
          <Button
            size="small"
            type="link"
            onClick={() => {
              setReplyModal({ open: true, comment: record });
              setReplyContent('');
            }}
          >
            回复
          </Button>
          <Popconfirm title="确定删除此评论？" onConfirm={() => handleDelete(record.id)}>
            <Button danger size="small" type="link">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{pendingOnly ? '待审核评论' : '评论管理'}</h2>
        {!pendingOnly && (
          <Select
            allowClear
            placeholder="状态筛选"
            style={{ width: 120 }}
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v);
              applyStatusFilter(v);
            }}
            options={Object.entries(STATUS_LABEL).map(([value, { text }]) => ({
              label: text,
              value,
            }))}
          />
        )}
      </div>

      <Table
        columns={columns}
        dataSource={items}
        loading={loading}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: false,
          onChange: setPage,
        }}
        rowKey="id"
      />

      <Modal
        open={replyModal.open}
        title="回复评论"
        onCancel={() => setReplyModal({ open: false, comment: null })}
        onOk={handleReply}
      >
        <div className="mb-2 text-sm text-gray-500">
          回复 {replyModal.comment?.nickname}：{replyModal.comment?.content?.slice(0, 50)}
        </div>
        <textarea
          className="w-full rounded border p-2"
          placeholder="输入回复内容"
          rows={4}
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
        />
      </Modal>
    </div>
  );
}
