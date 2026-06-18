// src/features/admin-tag/ui/tag-manager.tsx

import { App, Button, Form, Input, Modal, Popconfirm, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useState } from 'react';

import type { TagDTO } from '@/entities/tag';

import type { CreateTagInputDTO } from '../application/use-admin-tag-list';
import { useAdminTagList } from '../application/use-admin-tag-list';

interface TagFormValues {
  name: string;
  slug: string;
}

export function TagManager() {
  const { message } = App.useApp();
  const { items: tags, loading, doCreate, doUpdate, doDelete } = useAdminTagList();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagDTO | null>(null);
  const [form] = Form.useForm<TagFormValues>();

  const handleCreate = useCallback(() => {
    setEditingTag(null);
    form.resetFields();
    setModalOpen(true);
  }, [form]);

  const handleEdit = useCallback(
    (tag: TagDTO) => {
      setEditingTag(tag);
      form.setFieldsValue({ name: tag.name, slug: tag.slug });
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
    async (values: TagFormValues) => {
      try {
        if (editingTag) {
          await doUpdate({ id: editingTag.id, name: values.name, slug: values.slug });
          message.success('更新成功');
        } else {
          await doCreate({ name: values.name, slug: values.slug });
          message.success('创建成功');
        }
        setModalOpen(false);
      } catch {
        message.error('操作失败');
      }
    },
    [editingTag, doCreate, doUpdate, message],
  );

  const columns: ColumnsType<TagDTO> = [
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: 'Slug', dataIndex: 'slug', key: 'slug' },
    { title: '文章数', dataIndex: 'articleCount', key: 'articleCount', width: 80 },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Space size="small">
          <Button size="small" type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确定删除此标签？" onConfirm={() => handleDelete(record.id)}>
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
        <h2 className="text-lg font-semibold">标签管理</h2>
        <Button type="primary" onClick={handleCreate}>
          新建标签
        </Button>
      </div>

      <Table columns={columns} dataSource={tags} loading={loading} pagination={false} rowKey="id" />

      <Modal
        open={modalOpen}
        title={editingTag ? '编辑标签' : '新建标签'}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Slug" name="slug" rules={[{ required: true, message: '请输入 Slug' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
