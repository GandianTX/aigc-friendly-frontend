// src/features/admin-category/ui/category-manager.tsx

import { App, Button, Form, Input, InputNumber, Modal, Popconfirm, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useState } from 'react';

import type { CategoryDTO } from '@/entities/category';

import type { CreateCategoryInputDTO } from '../application/use-admin-category-list';
import { useAdminCategoryList } from '../application/use-admin-category-list';

interface CategoryFormValues {
  name: string;
  slug: string;
  parentId?: string;
  sortOrder?: number;
}

export function CategoryManager() {
  const { message } = App.useApp();
  const { items: categories, loading, reload, doCreate, doUpdate, doDelete } = useAdminCategoryList();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDTO | null>(null);
  const [form] = Form.useForm<CategoryFormValues>();

  const handleCreate = useCallback(() => {
    setEditingCategory(null);
    form.resetFields();
    setModalOpen(true);
  }, [form]);

  const handleEdit = useCallback(
    (category: CategoryDTO) => {
      setEditingCategory(category);
      form.setFieldsValue({
        name: category.name,
        slug: category.slug,
        parentId: category.parentId ?? undefined,
        sortOrder: category.sortOrder,
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
    async (values: CategoryFormValues) => {
      try {
        if (editingCategory) {
          await doUpdate({
            id: editingCategory.id,
            name: values.name,
            slug: values.slug,
            parentId: values.parentId ?? null,
            sortOrder: values.sortOrder ?? null,
          });
          message.success('更新成功');
        } else {
          await doCreate({
            name: values.name,
            slug: values.slug,
            parentId: values.parentId ?? null,
            sortOrder: values.sortOrder,
          });
          message.success('创建成功');
        }
        setModalOpen(false);
      } catch {
        message.error('操作失败');
      }
    },
    [editingCategory, doCreate, doUpdate, message],
  );

  const columns: ColumnsType<CategoryDTO> = [
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: 'Slug', dataIndex: 'slug', key: 'slug' },
    { title: '排序', dataIndex: 'sortOrder', key: 'sortOrder', width: 80 },
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
          <Popconfirm title="确定删除此分类？" onConfirm={() => handleDelete(record.id)}>
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
        <h2 className="text-lg font-semibold">分类管理</h2>
        <Button type="primary" onClick={handleCreate}>
          新建分类
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        loading={loading}
        pagination={false}
        rowKey="id"
      />

      <Modal
        open={modalOpen}
        title={editingCategory ? '编辑分类' : '新建分类'}
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
          <Form.Item label="父分类 ID" name="parentId">
            <Input placeholder="留空为顶级分类" />
          </Form.Item>
          <Form.Item label="排序" name="sortOrder">
            <InputNumber min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
