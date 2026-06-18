// src/features/admin-dashboard/ui/dashboard.tsx

import { Badge, Button, Spin } from 'antd';
import { FileTextOutlined, EyeOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons';

import { StatCard } from './stat-card';
import { useDashboardStats } from '../application/use-dashboard-stats';

interface DashboardProps {
  onNavigateToComments?: () => void;
}

export function Dashboard({ onNavigateToComments }: DashboardProps) {
  const { stats, loading, error, reload } = useDashboardStats();

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error}</p>
        <Button onClick={reload}>重试</Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">仪表盘</h2>
        <Button onClick={reload} loading={loading}>
          刷新
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          loading={loading}
          prefix={<FileTextOutlined />}
          title="文章总数"
          value={stats?.totalArticles ?? 0}
        />
        <StatCard
          loading={loading}
          prefix={<MessageOutlined />}
          title="评论总数"
          value={stats?.totalComments ?? 0}
        />
        <StatCard
          loading={loading}
          prefix={<EyeOutlined />}
          title="总阅读量"
          value={stats?.totalViews ?? 0}
        />
        <StatCard
          loading={loading}
          prefix={<LikeOutlined />}
          title="总点赞量"
          value={stats?.totalLikes ?? 0}
        />
      </div>

      {stats && stats.totalPendingComments > 0 && (
        <div className="mt-6">
          <Badge count={stats.totalPendingComments} offset={[6, 0]}>
            <Button onClick={onNavigateToComments}>待审核评论</Button>
          </Badge>
        </div>
      )}
    </div>
  );
}
