// src/widgets/admin-layout/admin-layout.tsx

import { useCallback, useState } from 'react';
import {
  DashboardOutlined,
  FileTextOutlined,
  MessageOutlined,
  AppstoreOutlined,
  TagsOutlined,
  CloudUploadOutlined,
  SettingOutlined,
  LinkOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import type { ReactNode } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

import { clearTokens } from '@/features/admin-auth';

const { Header, Sider, Content } = Layout;

type MenuItem = {
  key: string;
  icon: ReactNode;
  label: string;
};

const MENU_ITEMS: MenuItem[] = [
  { key: '/admin', icon: <DashboardOutlined />, label: '仪表盘' },
  { key: '/admin/articles', icon: <FileTextOutlined />, label: '文章管理' },
  { key: '/admin/comments', icon: <MessageOutlined />, label: '评论管理' },
  { key: '/admin/categories', icon: <AppstoreOutlined />, label: '分类管理' },
  { key: '/admin/tags', icon: <TagsOutlined />, label: '标签管理' },
  { key: '/admin/uploads', icon: <CloudUploadOutlined />, label: '文件管理' },
  { key: '/admin/settings', icon: <SettingOutlined />, label: '个人设置' },
  { key: '/admin/links', icon: <LinkOutlined />, label: '友链管理' },
];

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  const handleMenuClick = useCallback(
    (info: { key: string }) => {
      navigate(info.key);
    },
    [navigate],
  );

  const handleLogout = useCallback(() => {
    clearTokens();
    navigate('/admin/login');
  }, [navigate]);

  const selectedKey = MENU_ITEMS.find((item) => location.pathname === item.key)?.key ?? '/admin';

  return (
    <Layout className="min-h-screen">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        width={200}
      >
        <div className="flex h-8 items-center justify-center text-white">
          {collapsed ? 'A' : 'Admin'}
        </div>
        <Menu
          items={MENU_ITEMS}
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ borderRight: 0 }}
          theme="dark"
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header
          className="flex items-center justify-between bg-white px-4 dark:bg-gray-800"
          style={{ padding: '0 16px', background: token.colorBgContainer }}
        >
          <Button
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            type="text"
            onClick={() => setCollapsed(!collapsed)}
          />
          <Button icon={<LogoutOutlined />} type="text" onClick={handleLogout}>
            退出
          </Button>
        </Header>
        <Content className="m-4 min-h-0 overflow-auto rounded-lg bg-white p-0 dark:bg-gray-800">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
