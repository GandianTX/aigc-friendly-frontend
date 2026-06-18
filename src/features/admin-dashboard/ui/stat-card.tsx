// src/features/admin-dashboard/ui/stat-card.tsx

import { Card, Statistic } from 'antd';
import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  prefix?: ReactNode;
  loading?: boolean;
}

export function StatCard({ title, value, prefix, loading }: StatCardProps) {
  return (
    <Card loading={loading}>
      <Statistic prefix={prefix} title={title} value={value} />
    </Card>
  );
}
