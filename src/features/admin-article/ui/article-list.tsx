// src/features/admin-article/ui/article-list.tsx

import { App, Button, Popconfirm, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useState } from 'react';

import type { AdminArticleListItem } from '../application/use-admin-article-list';
import { useAdminArticleList } from '../application/use-admin-article-list';

interface ArticleListProps {
  onEdit: (id: string) => void;
  onCreate: () => void;
}

export function AdminArticleList({ onEdit, onCreate }: ArticleListProps) {
  const { message } = App.useApp();
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const { items, total, page, pageSize, loading, setPage, setStatusFilter: applyStatusFilter, reload, doPublish, doUnpublish, doDelete, doSetTop } =
    useAdminArticleList({ status: statusFilter });

  const handlePublish = useCallback(
    async (id: string) => {
      try {
        await doPublish(id);
        message.success('发布成功');
      } catch {
        message.error('发布失败');
      }
    },
    [doPublish, message],
  );

  const handleUnpublish = useCallback(
    async (id: string) => {
      try {
        await doUnpublish(id);
        message.success('下架成功');
      } catch {
        message.error('下架失败');
      }
    },
    [doUnpublish, message],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await doDelete(id);
        message.success('删除成功');
      } catch {
        message.error('删除失败');
      }
    },
    [doDelete, message],
  );

  const handleSetTop = useCallback(
    async (id: string, isTop: boolean) => {
      try {
        await doSetTop(id, isTop);
        message.success(isTop ? '置顶成功' : '取消置顶成功');
      } catch {
        message.error('操作失败');
      }
    },
    [doSetTop, message],
  );

  const columns: ColumnsType<AdminArticleListItem> = [
    { title: '标题', dataIndex: 'title', key: 'title', ellipsis: true },
    {
      title: '分类',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 120,
      render: (v: string | null) => v ?? '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'PUBLISHED' ? 'green' : 'default'}>
          {status === 'PUBLISHED' ? '已发布' : '草稿'}
        </Tag>
      ),
    },
    {
      title: '置顶',
      dataIndex: 'isTop',
      key: 'isTop',
      width: 80,
      render: (isTop: boolean) => (isTop ? <Tag color="blue">置顶</Tag> : '-'),
    },
    { title: '阅读', dataIndex: 'viewCount', key: 'viewCount', width: 80 },
    { title: '点赞', dataIndex: 'likeCount', key: 'likeCount', width: 80 },
    {
      title: '发布时间',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      width: 160,
      render: (v: string | null) => (v ? new Date(v).toLocaleString() : '-'),
    },
    {
      title: '操作',
      key: 'action',
      width: 240,
      render: (_, record) => (
        <Space size="small">
          <Button size="small" type="link" onClick={() => onEdit(record.id)}>
            编辑
          </Button>
          {record.status === 'DRAFT' && (
            <Button size="small" type="link" onClick={() => handlePublish(record.id)}>
              发布
            </Button>
          )}
          {record.status === 'PUBLISHED' && (
            <Button size="small" type="link" onClick={() => handleUnpublish(record.id)}>
              下架
            </Button>
          )}
          <Button
            size="small"
            type="link"
            onClick={() => handleSetTop(record.id, !record.isTop)}
          >
            {record.isTop ? '取消置顶' : '置顶'}
          </Button>
          <Popconfirm
            title="确定删除此文章？"
            onConfirm={() => handleDelete(record.id)}
          >
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
        <h2 className="text-lg font-semibold">文章管理</h2>
        <Space>
          <Select
            allowClear
            placeholder="状态筛选"
            style={{ width: 120 }}
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v);
              applyStatusFilter(v);
            }}
            options={[
              { label: '草稿', value: 'DRAFT' },
              { label: '已发布', value: 'PUBLISHED' },
            ]}
          />
          <Button type="primary" onClick={onCreate}>
            新建文章
          </Button>
        </Space>
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
    </div>
  );
}
