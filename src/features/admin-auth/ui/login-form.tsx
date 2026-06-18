// src/features/admin-auth/ui/login-form.tsx

import { Alert, Button, Form, Input } from 'antd';
import { useCallback } from 'react';

interface LoginFormProps {
  onLogin: (loginName: string, loginPassword: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function LoginForm({ onLogin, loading, error }: LoginFormProps) {
  const [form] = Form.useForm();

  const handleSubmit = useCallback(
    async (values: { loginName: string; loginPassword: string }) => {
      await onLogin(values.loginName, values.loginPassword);
    },
    [onLogin],
  );

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h1 className="mb-6 text-center text-xl font-semibold">管理端登录</h1>
        {error && (
          <Alert className="mb-4" message={error} type="error" showIcon closable />
        )}
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="用户名"
            name="loginName"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="loginPassword"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item>
            <Button block htmlType="submit" loading={loading} type="primary">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
