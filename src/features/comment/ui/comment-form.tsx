// src/features/comment/ui/comment-form.tsx

import { Button, Form, Input, Alert } from 'antd';

import { useSubmitComment } from '../application/use-submit-comment';
import type { SubmitCommentParams } from '../application/use-submit-comment';

interface CommentFormValues {
  nickname: string;
  email: string;
  content: string;
}

export function CommentForm({
  articleId,
  onSuccess,
}: {
  articleId: string | undefined;
  onSuccess: () => void;
}) {
  const [form] = Form.useForm<CommentFormValues>();
  const { formState, submitComment, resetForm } = useSubmitComment(() => {
    form.resetFields();
    onSuccess();
    // 成功后 3 秒重置状态
    setTimeout(() => resetForm(), 3000);
  });

  const handleSubmit = async (values: CommentFormValues) => {
    if (!articleId) return;

    const params: SubmitCommentParams = {
      articleId,
      nickname: values.nickname,
      email: values.email,
      content: values.content,
    };

    await submitComment(params);
  };

  return (
    <div>
      {formState.status === 'success' && (
        <Alert
          message="评论已提交，等待审核"
          type="success"
          showIcon
          className="mb-4"
        />
      )}

      {formState.status === 'failed' && (
        <Alert
          message={formState.error}
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={formState.status === 'submitting'}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Form.Item
            name="nickname"
            label="昵称"
            rules={[{ required: true, message: '请输入昵称' }]}
          >
            <Input placeholder="你的昵称" maxLength={50} />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="你的邮箱（不公开）" maxLength={100} />
          </Form.Item>
        </div>

        <Form.Item
          name="content"
          label="评论内容"
          rules={[{ required: true, message: '请输入评论内容' }]}
        >
          <Input.TextArea rows={4} placeholder="写下你的评论..." maxLength={2000} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={formState.status === 'submitting'}
          >
            提交评论
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
