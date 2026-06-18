// src/features/admin-settings/ui/settings-panel.tsx

import { App, Button, Card, Divider, Form, Input } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import type { BloggerInfoDTO, UpdateBloggerInfoInputDTO } from '../application/use-blogger-info';
import { useBloggerInfo } from '../application/use-blogger-info';
import { changePassword } from '@/features/admin-auth';

interface BloggerFormValues {
  nickname?: string;
  bio?: string;
  avatarUrl?: string;
}

interface PasswordFormValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function SettingsPanel() {
  const { message } = App.useApp();
  const [bloggerForm] = Form.useForm<BloggerFormValues>();
  const [passwordForm] = Form.useForm<PasswordFormValues>();
  const { info, loading, doUpdate } = useBloggerInfo();
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (info) {
      bloggerForm.setFieldsValue({
        nickname: info.nickname ?? undefined,
        bio: info.bio ?? undefined,
        avatarUrl: info.avatarUrl ?? undefined,
      });
    }
  }, [info, bloggerForm]);

  const handleSaveBloggerInfo = useCallback(
    async (values: BloggerFormValues) => {
      setSaving(true);
      try {
        await doUpdate({
          nickname: values.nickname ?? null,
          bio: values.bio ?? null,
          avatarUrl: values.avatarUrl ?? null,
        });
        message.success('保存成功');
      } catch {
        message.error('保存失败');
      } finally {
        setSaving(false);
      }
    },
    [doUpdate, message],
  );

  const handleChangePassword = useCallback(
    async (values: PasswordFormValues) => {
      if (values.newPassword !== values.confirmPassword) {
        message.error('两次输入的密码不一致');
        return;
      }
      setChangingPassword(true);
      try {
        await changePassword({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        });
        message.success('密码修改成功');
        passwordForm.resetFields();
      } catch {
        message.error('密码修改失败');
      } finally {
        setChangingPassword(false);
      }
    },
    [message, passwordForm],
  );

  return (
    <div className="p-6">
      <h2 className="mb-4 text-lg font-semibold">个人设置</h2>

      <Card loading={loading} title="博主信息">
        <Form form={bloggerForm} layout="vertical" onFinish={handleSaveBloggerInfo}>
          <Form.Item label="昵称" name="nickname">
            <Input placeholder="博主昵称" />
          </Form.Item>
          <Form.Item label="简介" name="bio">
            <Input.TextArea placeholder="博主简介" rows={3} />
          </Form.Item>
          <Form.Item label="头像 URL" name="avatarUrl">
            <Input placeholder="头像图片地址" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" loading={saving} type="primary">
              保存
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Divider />

      <Card title="修改密码">
        <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword}>
          <Form.Item
            label="旧密码"
            name="oldPassword"
            rules={[{ required: true, message: '请输入旧密码' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 8, message: '密码长度不能少于8位' },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" loading={changingPassword} type="primary">
              修改密码
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
