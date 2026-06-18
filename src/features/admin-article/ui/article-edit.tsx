// src/features/admin-article/ui/article-edit.tsx

import { App, Button, Form, Input, Select, Space, Spin, Alert } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { useArticleEdit, type ArticleFormValues } from '../application/use-article-edit';

interface ArticleEditProps {
  articleId?: string;
  onSave: () => void;
}

export function ArticleEdit({ articleId, onSave }: ArticleEditProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm<ArticleFormValues>();
  const { state, article, categories, tags, loadArticle, saveDraft, publish } = useArticleEdit(articleId);
  const [submitAction, setSubmitAction] = useState<'draft' | 'publish'>('draft');

  useEffect(() => {
    loadArticle();
  }, [loadArticle]);

  useEffect(() => {
    if (article) {
      form.setFieldsValue({
        title: article.title,
        content: article.content,
        summary: article.summary ?? undefined,
        categoryId: article.categoryId ?? undefined,
        tagIds: article.tags.map((t) => t.id),
      });
    }
  }, [article, form]);

  const handleSaveDraft = useCallback(
    async (values: ArticleFormValues) => {
      try {
        await saveDraft(values);
        message.success('保存成功');
        onSave();
      } catch {
        message.error('保存失败');
      }
    },
    [saveDraft, onSave, message],
  );

  const handlePublish = useCallback(
    async (values: ArticleFormValues) => {
      try {
        await publish(values);
        message.success('发布成功');
        onSave();
      } catch {
        message.error('发布失败');
      }
    },
    [publish, onSave, message],
  );

  const handleFinish = useCallback(
    async (values: ArticleFormValues) => {
      if (submitAction === 'publish') {
        await handlePublish(values);
      } else {
        await handleSaveDraft(values);
      }
    },
    [submitAction, handlePublish, handleSaveDraft],
  );

  const isSubmitting = state.status === 'saving' || state.status === 'publishing';

  if (state.status === 'loading') {
    return (
      <div className="flex items-center justify-center p-12">
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  if (state.status === 'failed' && !isSubmitting) {
    return (
      <div className="p-6">
        <Alert
          type="error"
          message={state.error}
          showIcon
          action={
            <Button size="small" onClick={onSave}>
              返回
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{articleId ? '编辑文章' : '新建文章'}</h2>
      </div>

      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
          <Input placeholder="文章标题" />
        </Form.Item>

        <Form.Item label="摘要" name="summary">
          <Input.TextArea placeholder="文章摘要（可选）" rows={2} />
        </Form.Item>

        <Form.Item label="正文" name="content" rules={[{ required: true, message: '请输入正文' }]}>
          <Input.TextArea placeholder="Markdown 正文" rows={16} />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="分类" name="categoryId">
            <Select allowClear placeholder="选择分类">
              {categories.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="标签" name="tagIds">
            <Select allowClear mode="multiple" placeholder="选择标签">
              {tags.map((t) => (
                <Select.Option key={t.id} value={t.id}>
                  {t.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Form.Item>
          <Space>
            <Button
              htmlType="submit"
              loading={isSubmitting && state.status === 'saving'}
              type="primary"
              onClick={() => setSubmitAction('draft')}
            >
              保存草稿
            </Button>
            <Button
              htmlType="submit"
              loading={isSubmitting && state.status === 'publishing'}
              type="primary"
              onClick={() => setSubmitAction('publish')}
            >
              {article?.status === 'PUBLISHED' ? '更新并发布' : '发布'}
            </Button>
            <Button onClick={onSave}>返回</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}
