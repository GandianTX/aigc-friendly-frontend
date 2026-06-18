// src/features/admin-upload/ui/upload-manager.tsx

import { App, Button, Popconfirm, Space, Table, Upload, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';

import type { UploadDTO } from '../application/use-admin-upload-list';
import { useAdminUploadList } from '../application/use-admin-upload-list';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadManager() {
  const { message } = App.useApp();
  const { items, total, page, pageSize, loading, setPage, doDelete, doUpload } = useAdminUploadList();
  const [uploading, setUploading] = useState(false);

  const handleUpload = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        await doUpload(file);
        message.success('上传成功');
      } catch {
        message.error('上传失败');
      } finally {
        setUploading(false);
      }
    },
    [doUpload, message],
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

  const columns: ColumnsType<UploadDTO> = [
    { title: '文件名', dataIndex: 'originalName', key: 'originalName', ellipsis: true },
    {
      title: '类型',
      dataIndex: 'mimeType',
      key: 'mimeType',
      width: 120,
      render: (v: string) => <Tag>{v}</Tag>,
    },
    {
      title: '大小',
      dataIndex: 'sizeBytes',
      key: 'sizeBytes',
      width: 100,
      render: (v: number) => formatFileSize(v),
    },
    {
      title: '路径',
      dataIndex: 'urlPath',
      key: 'urlPath',
      ellipsis: true,
      render: (v: string) => (
        <a href={v} rel="noreferrer" target="_blank">
          {v}
        </a>
      ),
    },
    {
      title: '上传时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (v: string) => new Date(v).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Popconfirm title="确定删除此文件？" onConfirm={() => handleDelete(record.id)}>
          <Button danger size="small" type="link">
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">文件管理</h2>
        <Upload
          showUploadList={false}
          beforeUpload={(file) => {
            handleUpload(file);
            return false;
          }}
        >
          <Button icon={<UploadOutlined />} loading={uploading} type="primary">
            上传图片
          </Button>
        </Upload>
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
