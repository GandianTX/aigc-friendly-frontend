// src/features/comment/ui/reply-form.tsx

import { Button, Form, Input, Alert } from 'antd';

import { useSubmitComment } from '../application/use-submit-comment';
import type { ReplyCommentParams } from '../application/use-submit-comment';

interface ReplyFormValues {
  nickname: string;
  email: string;
  content: string;
}

export function ReplyForm({
  articleId,
  parentId,
  replyToId,
  onSuccess,
  onCancel,
}: {
  articleId: string | undefined;
  parentId: string;
  replyToId?: string | null;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [form] = Form.useForm<ReplyFormValues>();
  const { formState, submitReply, resetForm } = useSubmitComment(() => {
    form.resetFields();
    onSuccess();
    setTimeout(() => resetForm(), 3000);
  });

  const handleSubmit = async (values: ReplyFormValues) => {
    if (!articleId) return;

    const params: ReplyCommentParams = {
      articleId,
      parentId,
      replyToId,
      nickname: values.nickname,
      email: values.email,
      content: values.content,
    };

    await submitReply(params);
  };

  return (
    <div>
      {formState.status === 'failed' && (
        <Alert
          message={formState.error}
          type="error"
          showIcon
          className="mb-3"
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={formState.status === 'submitting'}
        size="small"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Form.Item
            name="nickname"
            rules={[{ required: true, message: '请输入昵称' }]}
          >
            <Input placeholder="昵称" maxLength={50} />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="邮箱（不公开）" maxLength={100} />
          </Form.Item>
        </div>

        <Form.Item
          name="content"
          rules={[{ required: true, message: '请输入回复内容' }]}
        >
          <Input.TextArea rows={2} placeholder="写下你的回复..." maxLength={2000} />
        </Form.Item>

        <div className="flex gap-2">
          <Button
            type="primary"
            htmlType="submit"
            size="small"
            loading={formState.status === 'submitting'}
          >
            回复
          </Button>
          <Button size="small" onClick={onCancel}>
            取消
          </Button>
        </div>
      </Form>
    </div>
  );
}
