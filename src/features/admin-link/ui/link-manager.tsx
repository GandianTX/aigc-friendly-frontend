// src/features/admin-link/ui/link-manager.tsx

import { App, Button, Form, Input, InputNumber, Modal, Popconfirm, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useState } from 'react';

import type { BlogLinkDTO } from '../application/use-admin-link-list';
import { useAdminLinkList } from '../application/use-admin-link-list';

interface LinkFormValues {
  name: string;
  url: string;
  description?: string;
  logoUrl?: string;
  sortOrder?: number;
}

export function LinkManager() {
  const { message } = App.useApp();
  const { items: links, loading, doCreate, doUpdate, doDelete } = useAdminLinkList();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<BlogLinkDTO | null>(null);
  const [form] = Form.useForm<LinkFormValues>();

  const handleCreate = useCallback(() => {
    setEditingLink(null);
    form.resetFields();
    setModalOpen(true);
  }, [form]);

  const handleEdit = useCallback(
    (link: BlogLinkDTO) => {
      setEditingLink(link);
      form.setFieldsValue({
        name: link.name,
        url: link.url,
        description: link.description ?? undefined,
        logoUrl: link.logoUrl ?? undefined,
        sortOrder: link.sortOrder,
      });
      setModalOpen(true);
    },
    [form],
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

  const handleSubmit = useCallback(
    async (values: LinkFormValues) => {
      try {
        if (editingLink) {
          await doUpdate({
            id: editingLink.id,
            name: values.name,
            url: values.url,
            description: values.description ?? null,
            logoUrl: values.logoUrl ?? null,
            sortOrder: values.sortOrder ?? null,
          });
          message.success('更新成功');
        } else {
          await doCreate({
            name: values.name,
            url: values.url,
            description: values.description ?? null,
            logoUrl: values.logoUrl ?? null,
            sortOrder: values.sortOrder,
          });
          message.success('创建成功');
        }
        setModalOpen(false);
      } catch {
        message.error('操作失败');
      }
    },
    [editingLink, doCreate, doUpdate, message],
  );

  const columns: ColumnsType<BlogLinkDTO> = [
    { title: '名称', dataIndex: 'name', key: 'name' },
    {
      title: '链接',
      dataIndex: 'url',
      key: 'url',
      ellipsis: true,
      render: (v: string) => (
        <a href={v} rel="noreferrer" target="_blank">
          {v}
        </a>
      ),
    },
    { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: '排序', dataIndex: 'sortOrder', key: 'sortOrder', width: 80 },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Space size="small">
          <Button size="small" type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确定删除此友链？" onConfirm={() => handleDelete(record.id)}>
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
        <h2 className="text-lg font-semibold">友链管理</h2>
        <Button type="primary" onClick={handleCreate}>
          新建友链
        </Button>
      </div>

      <Table columns={columns} dataSource={links} loading={loading} pagination={false} rowKey="id" />

      <Modal
        open={modalOpen}
        title={editingLink ? '编辑友链' : '新建友链'}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="链接" name="url" rules={[{ required: true, message: '请输入链接' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="Logo URL" name="logoUrl">
            <Input />
          </Form.Item>
          <Form.Item label="排序" name="sortOrder">
            <InputNumber min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
